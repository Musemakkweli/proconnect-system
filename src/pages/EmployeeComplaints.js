import React, { useState, useEffect, useMemo, useRef } from 'react';
import BASE_URL from '../config';

export default function EmployeeComplaints({ toast }) {
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [activeComplaint, setActiveComplaint] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('in_progress');
  const [messagesMap, setMessagesMap] = useState({});
  const [chatText, setChatText] = useState('');
  const [sending, setSending] = useState(false);
  const [onlineMap, setOnlineMap] = useState({});
  const [employeeUserId, setEmployeeUserId] = useState(null);
  const wsRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setIsLoading(true);
      try {
        let empId = null;
        let empUserId = null;
        try {
          const u = JSON.parse(localStorage.getItem('user') || 'null');
          empId = u?.employee_id || u?.emp_id || u?.employeeId || null;
          empUserId = u?.id || u?.user_id || null;
        } catch (e) { empId = null; empUserId = null; }

        if (!empId) {
          if (toast && toast.error) toast.error('Employee id not found');
          setIsLoading(false);
          return;
        }

        setEmployeeUserId(empUserId);

        const res = await fetch(`https://arlande-api.mababa.app/complaints/employee/${empId}`);
        if (!res.ok) throw new Error(`Failed to load (${res.status})`);
        const data = await res.json();
        const arr = Array.isArray(data) ? data : (data.results || (data ? [data] : []));
        const mapped = arr.map(item => ({
          id: item.id,
          title: item.title,
          user_id: item.user_id || item.userId || null,
          user_fullname: item.user_fullname || '',
          complaint_type: item.complaint_type,
          address: item.address,
          status: item.status || '',
          assigned_to: item.assigned_to || null,
          created: item.created_at ? new Date(item.created_at).toLocaleString() : ''
        }));
        if (mounted) setComplaints(mapped);
      } catch (err) {
        console.error('Failed to fetch employee complaints', err);
        if (toast && toast.error) toast.error('Failed to load assigned complaints');
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return complaints;
    return complaints.filter(c => {
      return String(c.id).toLowerCase().includes(q)
        || (c.title || '').toLowerCase().includes(q)
        || (c.user_fullname || '').toLowerCase().includes(q)
        || (c.status || '').toLowerCase().includes(q)
        || (c.address || '').toLowerCase().includes(q);
    });
  }, [complaints, query]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));

  useEffect(() => { setPage(1); }, [query, rowsPerPage]);

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

  function openChatSocketForUser(customerUserId, complaintId) {
    // close existing
    if (wsRef.current) {
      try { wsRef.current.close(); } catch (e) { /* ignore */ }
      wsRef.current = null;
    }

    if (!customerUserId || !employeeUserId) return;
    
    // Connect employee to their own websocket endpoint
    const url = `wss://chat.mababa.app/ws/${employeeUserId}`;
    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        // Mark customer as online when employee connects (they can now chat)
        setOnlineMap(m => ({ ...m, [customerUserId]: true }));
        console.log(`Employee ${employeeUserId} connected to chat with customer ${customerUserId}`);
      };

      ws.onmessage = (ev) => {
        try {
          console.log('Raw message received:', ev.data);
          
          // Handle messages from FastAPI backend
          let messageData;
          
          try {
            // Try to parse as JSON first (direct customer messages)
            messageData = JSON.parse(ev.data);
            console.log('Parsed JSON message:', messageData);
            
            if (messageData.message) {
              // Direct message from customer: {"message": "content"}
              const newMessage = {
                content: messageData.message,
                timestamp: new Date().toISOString(),
                received: true,
                fromCustomer: true
              };
              console.log('Adding customer message to chat:', newMessage);
              setMessagesMap(m => ({ ...m, [complaintId]: [ ...(m[complaintId] || []), newMessage ] }));
              return;
            }
          } catch (jsonError) {
            // Not JSON, handle as text
            const messageText = ev.data;
            console.log('Processing text message:', messageText);
            
            if (messageText.includes(' is typing...')) {
              // Typing indicator from customer
              console.log('Customer typing:', messageText);
              // Could show typing indicator in UI
              return;
            } else if (messageText.includes(': ')) {
              // Regular message from customer: "sender: content"
              const [sender, ...contentParts] = messageText.split(': ');
              const content = contentParts.join(': ');
              console.log(`Message from ${sender}:`, content);
              
              // Only show messages from the customer we're chatting with
              if (sender === customerUserId || messageText.startsWith(customerUserId)) {
                const newMessage = {
                  sender: sender,
                  content,
                  timestamp: new Date().toISOString(),
                  received: true,
                  fromCustomer: true
                };
                console.log('Adding formatted customer message to chat:', newMessage);
                setMessagesMap(m => ({ ...m, [complaintId]: [ ...(m[complaintId] || []), newMessage ] }));
              }
            } else {
              // Any other text message
              console.log('Unformatted message received:', messageText);
              const newMessage = {
                content: messageText,
                timestamp: new Date().toISOString(),
                received: true,
                fromCustomer: true
              };
              setMessagesMap(m => ({ ...m, [complaintId]: [ ...(m[complaintId] || []), newMessage ] }));
            }
          }
        } catch (e) {
          console.warn('ws message parse failed', e, ev.data);
        }
      };

      ws.onclose = () => {
        // mark customer offline when employee disconnects
        setOnlineMap(m => ({ ...m, [customerUserId]: false }));
        wsRef.current = null;
        console.log(`Employee disconnected from chat with customer ${customerUserId}`);
      };

      ws.onerror = (e) => {
        console.warn('ws error', e);
        setOnlineMap(m => ({ ...m, [customerUserId]: false }));
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

  async function submitFeedback() {
    if (!activeComplaint) return;
    const id = activeComplaint.id;
    
    // Get employee ID from localStorage
    let empId = null;
    try {
      const u = JSON.parse(localStorage.getItem('user') || 'null');
      empId = u?.employee_id || u?.emp_id || u?.employeeId || null;
    } catch (e) { empId = null; }

    if (!empId) {
      if (toast && toast.error) toast.error('Employee ID not found');
      return;
    }

    const payload = {
      complaint_id: id,
      employee_id: empId,
      status: selectedStatus,
      notes: feedbackText
    };
    
    setSending(true);
    try {
      // Try PATCH first, then PUT, then POST as fallbacks
      let res, jr;
      const methods = ['PATCH', 'PUT', 'POST'];
      
      for (const method of methods) {
        try {
          res = await fetch('https://arlande-api.mababa.app/complaints/update-status', {
            method: method, 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(payload)
          });
          
          if (res.status !== 405) {
            // If it's not a method not allowed error, break and handle response
            break;
          }
        } catch (methodError) {
          console.warn(`Failed with ${method}:`, methodError);
          if (method === methods[methods.length - 1]) {
            throw methodError; // If it's the last method, throw the error
          }
        }
      }
      
      jr = await res.json().catch(() => ({}));
      if (res.ok) {
        if (toast && toast.success) toast.success(jr.message || 'Complaint updated successfully');
        setShowFeedbackModal(false);
        setFeedbackText('');
        // Refresh the complaints list to show updated status
        window.location.reload();
      } else {
        console.error(`Update failed with status ${res.status}:`, jr);
        if (toast && toast.error) {
          toast.error(jr.message || jr.detail || `Failed to update complaint (${res.status})`);
        }
      }
    } catch (err) {
      console.error('Failed to submit feedback', err);
      if (toast && toast.error) toast.error(err.message || 'Network error');
    } finally { setSending(false); }
  }

  async function sendChatMessage() {
    if (!activeComplaint || !chatText.trim() || !employeeUserId) return;
    const id = activeComplaint.id;
    const customerUserId = activeComplaint.user_id;
    
    setSending(true);
    try {
      // Get current employee info for sender
      let employeeName = 'Employee';
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        employeeName = user.name || user.fullname || user.employee_id || 'Employee';
      } catch (e) { /* ignore */ }

      // Send via websocket if available
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        // Try the Message format first (sender/receiver/content)
        const message = {
          sender: employeeUserId,  // Employee's user_id as sender
          receiver: customerUserId, // Customer's user_id as receiver
          content: chatText
        };
        
        console.log(`Employee ${employeeUserId} sending message to customer ${customerUserId}:`, message);
        wsRef.current.send(JSON.stringify(message));
        
        // Add to local messages immediately
        const localMessage = {
          sender: employeeName,
          content: chatText,
          timestamp: new Date().toISOString(),
          sent: true,
          fromEmployee: true,
          messageId: Date.now() // Add unique ID for tracking
        };
        setMessagesMap(m => ({ ...m, [id]: [ ...(m[id] || []), localMessage ] }));
        setChatText('');
        
        if (toast && toast.success) {
          toast.success(`Message sent to ${activeComplaint.user_fullname || 'customer'}`);
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

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 pb-28">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Assigned Complaints</h1>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="text-sm text-gray-600 dark:text-gray-300">{isLoading ? 'Loading...' : `${total} complaints`}</div>

            <div className="flex items-center space-x-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search "
                className="w-full md:w-64 px-3 py-2 rounded border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-gray-700 dark:text-gray-200"
              />

              <select value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))} className="px-2 py-2 rounded border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-gray-700 dark:text-gray-200">
                <option value={5}>5 rows</option>
                <option value={10}>10 rows</option>
                <option value={25}>25 rows</option>
                <option value={50}>50 rows</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-50 dark:bg-slate-700">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider border-b border-gray-200 dark:border-slate-600">ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider border-b border-gray-200 dark:border-slate-600">Title</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider border-b border-gray-200 dark:border-slate-600">From</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider border-b border-gray-200 dark:border-slate-600">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider border-b border-gray-200 dark:border-slate-600">Created</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider border-b border-gray-200 dark:border-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-100 dark:divide-slate-700">
                {paginated.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                    <td className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-slate-700">{c.id}</td>
                    <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-slate-700">{c.title}</td>
                    <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-slate-700">{c.user_fullname}</td>
                    <td className="px-4 py-2 text-sm border-b border-gray-100 dark:border-slate-700">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        (c.status || '').toLowerCase() === 'resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                        (c.status || '').toLowerCase() === 'pending' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300' :
                        (c.status || '').toLowerCase() === 'in_progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' :
                        (c.status || '').toLowerCase() === 'blocked' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' :
                        (c.status || '').toLowerCase() === 'on_hold' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
                      }`}>{(c.status || '').toString().replace('_', ' ')}</span>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-slate-700">{c.created}</td>
                    <td className="px-4 py-2 text-sm text-right border-b border-gray-100 dark:border-slate-700">
                      <div className="flex items-center justify-end space-x-2">
                        <button onClick={() => { setActiveComplaint(c); setFeedbackText(''); setSelectedStatus('in_progress'); setShowFeedbackModal(true); }} className="px-3 py-1 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors">Update Status</button>
                        <button onClick={async () => { setActiveComplaint(c); setShowChatModal(true); await loadMessagesForComplaint(c.id); openChatSocketForUser(c.user_id, c.id); }} className="px-3 py-1 rounded-md bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors">Chat</button>
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
              Showing <span className="font-medium">{total === 0 ? 0 : ((page - 1) * rowsPerPage) + 1}</span> to <span className="font-medium">{Math.min(page * rowsPerPage, total)}</span> of <span className="font-medium">{total}</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className={`px-3 py-1 rounded-md text-sm ${page === 1 ? 'opacity-50 cursor-not-allowed' : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700'}`}>
                Prev
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const p = i + 1;
                return (
                  <button key={p} onClick={() => setPage(p)} className={`px-3 py-1 rounded-md text-sm ${p === page ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700'}`}>
                    {p}
                  </button>
                );
              })}

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={`px-3 py-1 rounded-md text-sm ${page === totalPages ? 'opacity-50 cursor-not-allowed' : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700'}`}>
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && activeComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowFeedbackModal(false)} />
          <div className="relative bg-white dark:bg-slate-800 rounded-lg shadow-lg w-full max-w-lg p-6 z-10">
            <h3 className="text-lg font-semibold mb-4">Update Complaint Status</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Complaint: {activeComplaint.title}</p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Status</label>
              <select 
                value={selectedStatus} 
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="blocked">Blocked</option>
                <option value="on_hold">On Hold</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Notes</label>
              <textarea 
                value={feedbackText} 
                onChange={(e) => setFeedbackText(e.target.value)} 
                rows={4} 
                placeholder="Add your notes about the status update..."
                className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" 
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowFeedbackModal(false)} 
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={submitFeedback} 
                disabled={sending || !feedbackText.trim()} 
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {sending ? 'Updating...' : `Update to ${selectedStatus.replace('_', ' ')}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {showChatModal && activeComplaint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => { setShowChatModal(false); closeChatSocket(); }} />
          <div className="relative bg-white dark:bg-slate-800 rounded-lg shadow-lg w-full max-w-2xl p-4 z-10">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold">Chat with: {activeComplaint.user_fullname || 'Customer'}</h3>
                {activeComplaint.user_id && (
                  <div className="flex items-center mt-1">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      onlineMap[activeComplaint.user_id] ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {onlineMap[activeComplaint.user_id] ? 'Online' : 'Offline'}
                    </span>
                  </div>
                )}
               
               
              </div>
              <button onClick={() => { setShowChatModal(false); closeChatSocket(); }} className="text-sm text-gray-600">Close</button>
            </div>
            <div className="h-64 overflow-y-auto p-3 border rounded bg-gray-50 dark:bg-slate-900" id={`chat-${activeComplaint.id}`}>
              {(messagesMap[activeComplaint.id] || []).map((m, i) => {
                const isFromEmployee = m.sent || m.fromEmployee;
                const isFromCustomer = m.fromCustomer || (!isFromEmployee && m.received);
                
                return (
                  <div key={i} className={`mb-3 ${m.local ? 'opacity-80' : ''} ${
                    isFromEmployee ? 'text-right' : 'text-left'
                  }`}>
                    <div className={`inline-block max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                      isFromEmployee 
                        ? 'bg-blue-500 text-white shadow-md' 
                        : 'bg-green-100 dark:bg-green-900 text-gray-700 dark:text-gray-200 border shadow-sm'
                    }`}>
                      {isFromCustomer && (
                        <div className="text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">
                          {activeComplaint.user_fullname || 'Customer'}
                        </div>
                      )}
                      {isFromEmployee && (
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
                      {isFromCustomer && (
                        <div className="text-xs mt-1 opacity-75 text-green-600 dark:text-green-400">
                          📨 Received
                        </div>
                      )}
                    </div>
                    <div className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${
                      isFromEmployee ? 'text-right' : 'text-left'
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
              <input value={chatText} onChange={(e) => setChatText(e.target.value)} placeholder="Type a message" className="flex-1 px-3 py-2 border rounded dark:bg-slate-800" />
              <button onClick={sendChatMessage} disabled={sending || !chatText.trim()} className="px-3 py-2 rounded bg-green-600 text-white">{sending ? 'Sending...' : 'Send'}</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
