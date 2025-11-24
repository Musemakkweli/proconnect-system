import React, { useState, useMemo, useEffect } from 'react';
import BottomNav from '../components/BottomNav';
import BASE_URL from '../config';

export default function CustomerComplaints({ toast }) {
  const [complaints, setComplaints] = useState([
    { id: 1, title: 'Complaint #1', status: 'Pending', created: '2025-11-10', private: true },
    { id: 2, title: 'Complaint #2', status: 'Resolved', created: '2025-11-08', private: false },
    { id: 3, title: 'Complaint #3', status: 'Pending', created: '2025-11-12', private: false },
    { id: 4, title: 'Complaint #4', status: 'In Progress', created: '2025-11-09', private: true },
  ]);
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

  const paginated = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

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
      user_id = u?.id || u?.user_id || null;
    } catch (e) {
      user_id = null;
    }
    user_id = user_id || '3158a951-d07f-4806-9b87-07e3936b114b';
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
            <button
              onClick={() => setTab('all')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${tab === 'all' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700'}`}>
              All <span className="ml-2 text-xs opacity-80">{counts.all}</span>
            </button>
            <button
              onClick={() => setTab('private')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${tab === 'private' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700'}`}>
              Private <span className="ml-2 text-xs opacity-80">{counts.private}</span>
            </button>
            <button
              onClick={() => setTab('common')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${tab === 'common' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700'}`}>
              Common <span className="ml-2 text-xs opacity-80">{counts.common}</span>
            </button>
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
            <table className="min-w-full table-auto">
              <thead className="bg-gray-50 dark:bg-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase">Created</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase">Private</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-200 uppercase">Actions</th>
                </tr>
              </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-100 dark:divide-slate-700">
                  {paginated.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{c.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{c.title}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded text-xs ${
                          c.status === 'Resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                          c.status === 'Pending' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300' :
                          'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                        }`}>{c.status}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{c.created}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{c.private ? 'Yes' : 'No'}</td>
                      <td className="px-4 py-3 text-sm text-right relative">
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

      <BottomNav active="complaints" />
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
