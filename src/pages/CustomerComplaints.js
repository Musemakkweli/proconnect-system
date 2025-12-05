import React, { useState, useMemo, useEffect, useRef } from 'react';
import BASE_URL from '../config';

export default function CustomerComplaints({ toast }) {
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrivate, setNewPrivate] = useState(false);
  const [newAddress, setNewAddress] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [tab, setTab] = useState('all'); // 'all' | 'private' | 'common'
  const [query, setQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [showChatModal, setShowChatModal] = useState(false);
  const [activeComplaint, setActiveComplaint] = useState(null);
  const [messagesMap, setMessagesMap] = useState({});
  const [chatText, setChatText] = useState('');
  const [sending, setSending] = useState(false);
  const [onlineMap, setOnlineMap] = useState({});
  const [customerUserId, setCustomerUserId] = useState(null);
  const wsRef = useRef(null);

  const counts = {
    all: complaints.length,
    private: complaints.filter(c => c.private).length,
    common: complaints.filter(c => !c.private).length,
  };

  // apply tab filter first
  const tabFiltered = useMemo(() => complaints.filter(c => {
    if (tab === 'private') return c.private;
    if (tab === 'common') return !c.private;
    return true;
  }), [complaints, tab]);

  // apply search query (id, title, status)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tabFiltered;
    return tabFiltered.filter(c => {
      return String(c.id).includes(q)
        || c.title.toLowerCase().includes(q)
        || c.status.toLowerCase().includes(q);
    });
  }, [tabFiltered, query]);

  // pagination
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));

  useEffect(() => {
    // reset to first page when filters change
    setPage(1);
  }, [query, tab, rowsPerPage]);

  // load complaints for logged-in user from arlande API
  useEffect(() => {
    let mounted = true;
    (async () => {
      setIsLoading(true);
      try {
        // get logged-in user id from stored `user` object (set in LoginBox)
        let user_id = null;
        try {
          const u = JSON.parse(localStorage.getItem('user') || 'null');
          // if the stored user is an employee (has employee_id) do NOT use it here
          if (u && (u.employee_id || u.emp_id || u.employeeId)) {
            // logged-in account is an employee — customer complaints are per-customer only
            if (toast && toast.error) toast.error('Not a customer account');
            setIsLoading(false);
            return;
          }
          user_id = u?.user_id || u?.id || null;
        } catch (e) {
          user_id = null;
        }

        if (!user_id) {
          // nothing to load
          if (toast && toast.error) toast.error('Not logged in');
          return;
        }

        const url = `https://arlande-api.mababa.app/complaints/user/${user_id}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch complaints (${res.status})`);
        const data = await res.json();

        // API may return single object or array; normalize to array
        const arr = Array.isArray(data) ? data : (data.results || (data ? [data] : []));
        const mapped = arr.map(item => ({
          id: item.id,
          user_id: item.user_id,
          title: item.title,
          description: item.description,
          complaint_type: item.complaint_type,
          address: item.address,
          status: item.status ? item.status.toString() : '',
          assigned_to: item.assigned_to || item.assigned_employee_id || null,
          employee_id: item.employee_id || null,
          created: item.created_at ? new Date(item.created_at).toLocaleString() : (item.created || ''),
          private: (item.complaint_type || '').toString().toLowerCase() === 'private'
        }));

        if (mounted) {
          setComplaints(mapped);
          // Store customer user ID for chat functionality
          setCustomerUserId(user_id);
        }

        if (mounted) setComplaints(mapped);
      } catch (err) {
        console.error('Failed to load user complaints', err);
        if (toast && toast.error) toast.error('Failed to load your complaints');
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, []);

  const paginated = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  async function loadMessagesForComplaint(complaintId) {
    // Try to load from server, otherwise fall back to local state
    try {
      const res = await fetch(`${BASE_URL}/complaints/${complaintId}/messages`);
      if (res.ok) {
        const data = await res.json();
        const arr = Array.isArray(data) ? data : (data.results || (data ? [data] : []));
        setMessagesMap(m => ({ ...m, [complaintId]: arr }));
        return;
      }
    } catch (e) {
      console.warn('No server messages or failed to load, using local state', e);
    }
    setMessagesMap(m => ({ ...m, [complaintId]: m[complaintId] || [] }));
  }

  function openChatSocketForEmployee(employeeUserId, complaintId) {
    // close existing
    if (wsRef.current) {
      try { wsRef.current.close(); } catch (e) { /* ignore */ }
      wsRef.current = null;
    }

    if (!employeeUserId || !customerUserId) return;
    
    // Connect customer to their own websocket endpoint
    const url = `wss://chat.mababa.app/ws/${customerUserId}`;
    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        // Mark employee as online when customer connects
        setOnlineMap(m => ({ ...m, [employeeUserId]: true }));
        console.log(`Customer ${customerUserId} connected to chat with employee ${employeeUserId}`);
      };

      ws.onmessage = (ev) => {
        try {
          console.log('Raw message received:', ev.data);
          
          // Handle messages from FastAPI backend
          let messageData;
          
          try {
            // Try to parse as JSON first (direct employee messages)
            messageData = JSON.parse(ev.data);
            console.log('Parsed JSON message:', messageData);
            
            if (messageData.message) {
              // Direct message from employee: {"message": "content"}
              const newMessage = {
                content: messageData.message,
                timestamp: new Date().toISOString(),
                received: true,
                fromEmployee: true
              };
              console.log('Adding employee message to chat:', newMessage);
              setMessagesMap(m => ({ ...m, [complaintId]: [ ...(m[complaintId] || []), newMessage ] }));
              return;
            }
          } catch (jsonError) {
            // Not JSON, handle as text
            const messageText = ev.data;
            console.log('Processing text message:', messageText);
            
            if (messageText.includes(' is typing...')) {
              // Typing indicator from employee
              console.log('Employee typing:', messageText);
              return;
            } else if (messageText.includes(': ')) {
              // Regular message from employee: "sender: content"
              const [sender, ...contentParts] = messageText.split(': ');
              const content = contentParts.join(': ');
              console.log(`Message from ${sender}:`, content);
              
              // Only show messages from the employee we're chatting with
              if (sender === employeeUserId || messageText.startsWith(employeeUserId)) {
                const newMessage = {
                  sender: sender,
                  content,
                  timestamp: new Date().toISOString(),
                  received: true,
                  fromEmployee: true
                };
                console.log('Adding formatted employee message to chat:', newMessage);
                setMessagesMap(m => ({ ...m, [complaintId]: [ ...(m[complaintId] || []), newMessage ] }));
              }
            } else {
              // Any other text message
              console.log('Unformatted message received:', messageText);
              const newMessage = {
                content: messageText,
                timestamp: new Date().toISOString(),
                received: true,
                fromEmployee: true
              };
              setMessagesMap(m => ({ ...m, [complaintId]: [ ...(m[complaintId] || []), newMessage ] }));
            }
          }
        } catch (e) {
          console.warn('ws message parse failed', e, ev.data);
        }
      };

      ws.onclose = () => {
        // mark employee offline when customer disconnects
        setOnlineMap(m => ({ ...m, [employeeUserId]: false }));
        wsRef.current = null;
        console.log(`Customer disconnected from chat with employee ${employeeUserId}`);
      };

      ws.onerror = (e) => {
        console.warn('ws error', e);
        setOnlineMap(m => ({ ...m, [employeeUserId]: false }));
      };
    } catch (e) {
      console.warn('Failed to open websocket', e);
    }
  }

  function closeChatSocket() {
    if (wsRef.current) {
      try { wsRef.current.close(); } catch (e) { /* ignore */ }
      wsRef.current = null;
    }
  }

  // cleanup on unmount
  useEffect(() => {
    return () => { closeChatSocket(); };
  }, []);

  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (showChatModal && activeComplaint) {
      const chatContainer = document.getElementById(`chat-${activeComplaint.id}`);
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }
  }, [messagesMap, showChatModal, activeComplaint]);

  async function sendChatMessage() {
    if (!activeComplaint || !chatText.trim() || !customerUserId) return;
    const id = activeComplaint.id;
    const employeeUserId = activeComplaint.employee_id;
    
    setSending(true);
    try {
      // Get current customer info for sender
      let customerName = 'Customer';
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        customerName = user.name || user.fullname || user.username || 'Customer';
      } catch (e) { /* ignore */ }

      // Send via websocket if available
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        // Try the Message format first (sender/receiver/content)
        const message = {
          sender: customerUserId,  // Customer's user_id as sender
          receiver: employeeUserId, // Employee's user_id as receiver
          content: chatText
        };
        
        console.log(`Customer ${customerUserId} sending message to employee ${employeeUserId}:`, message);
        wsRef.current.send(JSON.stringify(message));
        
        // Add to local messages immediately
        const localMessage = {
          sender: customerName,
          content: chatText,
          timestamp: new Date().toISOString(),
          sent: true,
          fromCustomer: true,
          messageId: Date.now() // Add unique ID for tracking
        };
        setMessagesMap(m => ({ ...m, [id]: [ ...(m[id] || []), localMessage ] }));
        setChatText('');
        
        if (toast && toast.success) {
          toast.success(`Message sent to employee`);
        }
      } else {
        // Fallback to HTTP if websocket not available
        const body = { message: chatText };
        const res = await fetch(`${BASE_URL}/complaints/${id}/messages`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
        });
        const jr = await res.json().catch(() => ({}));
        if (res.ok) {
          setMessagesMap(m => ({ ...m, [id]: [ ...(m[id] || []), jr.message || { text: chatText, sent_at: new Date().toISOString() } ] }));
          setChatText('');
        } else {
          if (toast && toast.error) toast.error(jr.message || `Failed to send (${res.status})`);
        }
      }
    } catch (err) {
      console.error('Failed to send chat', err);
      if (toast && toast.error) toast.error(err.message || 'Network error');
      // append locally so user can still see it
      setMessagesMap(m => ({ ...m, [id]: [ ...(m[id] || []), { text: chatText, sent_at: new Date().toISOString(), local: true } ] }));
      setChatText('');
    } finally { setSending(false); }
  }

  function submitNewComplaint(e) {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) {
      return; // simple validation - require title
    }
    // build payload for server
    // get logged-in user id from stored `user` object (set in LoginBox)
    let user_id = null;
    try {
      const u = JSON.parse(localStorage.getItem('user') || 'null');
      if (u && (u.employee_id || u.emp_id || u.employeeId)) {
        if (toast && toast.error) toast.error('Employee accounts cannot submit customer complaints');
        return;
      }
      user_id = u?.user_id || u?.id || null;
    } catch (e) {
      user_id = null;
    }
    if (!user_id) {
      if (toast && toast.error) toast.error('You must be logged in to submit a complaint');
      return;
    }
    const payload = {
      user_id,
      title,
      description: newDesc.trim(),
      complaint_type: newPrivate ? 'private' : 'common',
      address: newAddress || 'N/A',
    };

    // optimistic UI + server POST
    (async () => {
      try {
        const res = await fetch(`${BASE_URL}/complaints`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const jr = await res.json();

        if (res.ok) {
          // server returned created complaint
          const created = jr?.complaint?.created_at ? jr.complaint.created_at.slice(0, 10) : new Date().toISOString().slice(0, 10);
          const newItem = {
            id: jr?.complaint?.id || (complaints.length ? Math.max(...complaints.map(c => c.id)) + 1 : 1),
            title: payload.title,
            status: jr?.complaint?.status || 'Pending',
            created,
            private: payload.complaint_type === 'private',
            description: payload.description,
            address: payload.address,
          };
          setComplaints(prev => [newItem, ...prev]);
          setShowModal(false);
          setNewTitle('');
          setNewDesc('');
          setNewPrivate(false);
          setNewAddress('');
          setTab('all');
          if (toast && toast.success) toast.success(jr?.message || 'Complaint submitted successfully');
          else setSuccessMsg(jr?.message || 'Complaint submitted');
          setTimeout(() => setSuccessMsg(''), 3000);
        } else {
          const msg = jr?.message || 'Failed to submit complaint';
          if (toast && toast.error) toast.error(msg);
          else setSuccessMsg(msg);
          setTimeout(() => setSuccessMsg(''), 4000);
        }
      } catch (err) {
        const msg = err?.message || 'Network error';
        if (toast && toast.error) toast.error(msg);
        else setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    })();
  }

  function handleView(item) {
    setSuccessMsg(`Viewing ${item.title}`);
    setTimeout(() => setSuccessMsg(''), 2500);
    setMenuOpenId(null);
  }

  function handleEdit(item) {
    setSuccessMsg(`Edit ${item.title} (not implemented)`);
    setTimeout(() => setSuccessMsg(''), 2500);
    setMenuOpenId(null);
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 pb-28">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Complaints</h1>
            <div className="text-sm text-gray-600 dark:text-gray-300">{counts.all} total</div>
          </div>

          <div className="flex items-center space-x-2">
           
            <button onClick={() => setShowModal(true)} className="ml-2 px-3 py-1 rounded-md text-sm font-semibold bg-green-600 text-white hover:bg-green-700">
              + New Complaint
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center space-x-2 w-full md:w-auto">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by ID, title or status"
                className="w-full md:w-60 px-3 py-2 rounded border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-gray-700 dark:text-gray-200"
              />
              <select value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))} className="px-2 py-2 rounded border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-gray-700 dark:text-gray-200">
                <option value={5}>5 rows</option>
                <option value={10}>10 rows</option>
                <option value={25}>25 rows</option>
                <option value={50}>50 rows</option>
              </select>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Showing <span className="font-medium">{total === 0 ? 0 : ( (page-1)*rowsPerPage + 1 )}</span> to <span className="font-medium">{Math.min(page*rowsPerPage, total)}</span> of <span className="font-medium">{total}</span>
            </div>
          </div>
            {successMsg && (
              <div className="px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 text-sm">
                {successMsg}
              </div>
            )}
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead className="bg-gray-50 dark:bg-slate-700">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Title</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Created</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Private</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-100 dark:divide-slate-700">
                  {paginated.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                      <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">{c.id}</td>
                      <td className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100">{c.title}</td>
                      <td className="px-4 py-2 text-sm">
                        {(() => {
                          const s = (c.status || '').toString().toLowerCase();
                          const label = s ? (s.charAt(0).toUpperCase() + s.slice(1)) : '';
                          const cls = s === 'resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                            s === 'pending' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300' :
                            s === 'in progress' || s === 'in_progress' || s === 'processing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' :
                            'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-gray-200';
                          return <span className={`px-2 py-1 rounded text-xs ${cls}`}>{label}</span>;
                        })()}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">{c.created}</td>
                      <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">{c.private ? 'Yes' : 'No'}</td>
                      <td className="px-4 py-2 text-sm text-right relative">
                        <div className="flex items-center justify-end space-x-2">
                          {c.status && c.status.toLowerCase() === 'assigned' && c.employee_id && (
                            <button 
                              onClick={async () => { 
                                setActiveComplaint(c); 
                                setShowChatModal(true); 
                                await loadMessagesForComplaint(c.id); 
                                openChatSocketForEmployee(c.employee_id, c.id); 
                              }} 
                              className="px-3 py-1 rounded bg-green-600 text-white text-sm hover:bg-green-700"
                            >
                              Chat
                            </button>
                          )}
                          <div className="inline-block text-left">
                            <button onClick={() => setMenuOpenId(menuOpenId === c.id ? null : c.id)} className="px-2 py-1 rounded text-gray-600 dark:text-gray-200 bg-transparent hover:bg-gray-100 dark:hover:bg-slate-700">
                              <span className="text-xl">⋯</span>
                            </button>

                            {menuOpenId === c.id && (
                              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded shadow-lg z-20">
                                <div className="py-1">
                                  <button onClick={() => handleView(c)} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700">View</button>
                                  {c.private && (
                                    <button onClick={() => handleEdit(c)} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700">Edit</button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
            </table>
          </div>
          {/* pagination controls */}
          <div className="px-4 py-3 border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-200">
              Page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage(p => Math.max(1, p-1))}
                disabled={page === 1}
                className={`px-3 py-1 rounded-md text-sm ${page === 1 ? 'opacity-50 cursor-not-allowed' : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700'}`}>
                Prev
              </button>

              {/* simple page numbers */}
              {Array.from({ length: totalPages }).map((_, i) => {
                const p = i + 1;
                return (
                  <button key={p} onClick={() => setPage(p)} className={`px-3 py-1 rounded-md text-sm ${p === page ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700'}`}>
                    {p}
                  </button>
                );
              })}

              <button
                onClick={() => setPage(p => Math.min(totalPages, p+1))}
                disabled={page === totalPages}
                className={`px-3 py-1 rounded-md text-sm ${page === totalPages ? 'opacity-50 cursor-not-allowed' : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700'}`}>
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {showChatModal && activeComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => { setShowChatModal(false); closeChatSocket(); }} />
          <div className="relative bg-white dark:bg-slate-800 rounded-lg shadow-lg w-full max-w-2xl p-4 z-10">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold">Chat with assigned employee</h3>
                {activeComplaint.employee_id && (
                  <div className="flex items-center mt-1">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      onlineMap[activeComplaint.employee_id] ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {onlineMap[activeComplaint.employee_id] ? 'Online' : 'Offline'}
                    </span>
                  </div>
                )}
                
              </div>
              <button onClick={() => { setShowChatModal(false); closeChatSocket(); }} className="text-sm text-gray-600">Close</button>
            </div>
            <div className="h-64 overflow-y-auto p-3 border rounded bg-gray-50 dark:bg-slate-900" id={`chat-${activeComplaint.id}`}>
              {(messagesMap[activeComplaint.id] || []).map((m, i) => {
                const isFromCustomer = m.sent || m.fromCustomer;
                const isFromEmployee = m.fromEmployee || (!isFromCustomer && m.received);
                
                return (
                  <div key={i} className={`mb-3 ${
                    isFromCustomer ? 'text-right' : 'text-left'
                  }`}>
                    <div className={`inline-block max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                      isFromCustomer 
                        ? 'bg-blue-500 text-white shadow-md' 
                        : 'bg-green-100 dark:bg-green-900 text-gray-700 dark:text-gray-200 border shadow-sm'
                    }`}>
                      {isFromEmployee && (
                        <div className="text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">
                          Employee
                        </div>
                      )}
                      {isFromCustomer && (
                        <div className="text-xs font-medium mb-1 text-blue-100">
                          You
                        </div>
                      )}
                      <div className="text-sm font-medium">{m.content || m.text || m.message || m.body}</div>
                      {m.messageId && (
                        <div className="text-xs mt-1 opacity-75">
                          ✓ Sent
                        </div>
                      )}
                      {isFromEmployee && (
                        <div className="text-xs mt-1 opacity-75 text-green-600 dark:text-green-400">
                          📨 Received
                        </div>
                      )}
                    </div>
                    <div className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${
                      isFromCustomer ? 'text-right' : 'text-left'
                    }`}>
                      {new Date(m.timestamp || m.sent_at || m.created_at).toLocaleTimeString() || ''}
                    </div>
                  </div>
                );
              })}
              {(messagesMap[activeComplaint.id] || []).length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
                  No messages yet. Start the conversation!
                </div>
              )}
            </div>
            <div className="mt-3 flex items-center space-x-2">
              <input 
                value={chatText} 
                onChange={(e) => setChatText(e.target.value)} 
                placeholder="Type a message" 
                className="flex-1 px-3 py-2 border rounded dark:bg-slate-800" 
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendChatMessage();
                  }
                }}
              />
              <button 
                onClick={sendChatMessage} 
                disabled={sending || !chatText.trim()} 
                className="px-3 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
              >
                {sending ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for new complaint */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <form onSubmit={submitNewComplaint} className="relative bg-white dark:bg-slate-800 rounded-lg shadow-lg w-full max-w-lg mx-4 p-6 z-10">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">New Complaint</h2>
            <label className="block text-sm text-gray-700 dark:text-gray-200">Title</label>
            <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="w-full px-3 py-2 rounded border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-gray-700 dark:text-gray-200 mb-3" />
            <label className="block text-sm text-gray-700 dark:text-gray-200">Description</label>
            <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} rows={4} className="w-full px-3 py-2 rounded border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-gray-700 dark:text-gray-200 mb-3" />
            <label className="inline-flex items-center text-sm text-gray-700 dark:text-gray-200 mb-2">
              <input type="checkbox" checked={newPrivate} onChange={(e) => setNewPrivate(e.target.checked)} className="mr-2" />
              Mark as private
            </label>
            <label className="block text-sm text-gray-700 dark:text-gray-200">Address</label>
            <input value={newAddress} onChange={(e) => setNewAddress(e.target.value)} className="w-full px-3 py-2 rounded border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-gray-700 dark:text-gray-200 mb-3" />

            <div className="flex items-center justify-end space-x-2 mt-4">
              <button type="button" onClick={() => setShowModal(false)} className="px-3 py-1 rounded-md bg-white dark:bg-slate-700 text-sm text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700">Cancel</button>
              <button type="submit" className="px-4 py-1 rounded-md bg-indigo-600 text-white text-sm">Submit</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
