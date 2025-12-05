import React, { useState, useEffect } from 'react';
import BASE_URL from '../config';

const sampleUsers = [
  { id: '1', name: 'Alice Johnson', role: 'admin', email: 'alice@example.com' },
  { id: '2', name: 'Bob Smith', role: 'employee', email: 'bob@example.com', employee_id: 'EMP-002' },
  { id: '3', name: 'Cecilia Ray', role: 'customer', email: 'cecilia@example.com' },
  { id: '4', name: 'Daniel Kim', role: 'employee', email: 'daniel@example.com', employee_id: 'EMP-004' },
];

export default function AdminUsers({ toast }){
  const [users, setUsers] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(()=>{
    let mounted = true;
    (async ()=>{
      setIsLoading(true);
      try{
        const res = await fetch(`${BASE_URL}/users`);
        if(!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        if(mounted) setUsers(Array.isArray(data) ? data : (data.results || (data ? [data] : [])));
      }catch(err){
        console.error('AdminUsers fetch error', err);
        if(mounted) setUsers(sampleUsers);
      }finally{
        if(mounted) setIsLoading(false);
      }
    })();
    return ()=> { mounted = false };
  },[]);

  async function saveUserUpdates(updated){
    if(!updated || !updated.id) return;
    setSaving(true);
    try{
      const id = updated.id;
      const existing = users.find(u => (u.id === id) || (u.email === updated.email));
      let finalUser = existing ? { ...existing } : {};

      // If role changed -> role-only update
      if(updated.role && (!existing || (existing.role||'').toString().toLowerCase() !== updated.role.toString().toLowerCase())){
        // try PATCH -> POST -> PUT for robustness
        let jr = null;
        let tried = [];
        try{
          tried.push('PATCH');
          let r = await fetch(`${BASE_URL}/users/${id}/role`, { method: 'PATCH', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ role: updated.role }) });
          if(!r.ok){
            if(r.status === 405){ tried.push('POST'); r = await fetch(`${BASE_URL}/users/${id}/role`, { method: 'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ role: updated.role }) }); }
            if(!r.ok){ tried.push('PUT'); r = await fetch(`${BASE_URL}/users/${id}/role`, { method: 'PUT', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ role: updated.role }) }); }
          }
          if(!r.ok){ const text = await r.text().catch(()=>null); console.error('Role update failed', r.status, text, tried); throw new Error('Role update failed'); }
          jr = await r.json().catch(()=>null);
        }catch(ex){ console.error('Role update error', ex); throw ex; }

        if(jr) finalUser = { ...finalUser, ...(jr.user || jr) };
        setUsers(prev => prev.map(u => (u.id === id || u.email === updated.email) ? { ...u, ...finalUser } : u));
        toast?.success('User role updated');
        setEditUser(null);
        setSaving(false);
        return;
      }

      // If editing employee_id for an existing employee -> update employee_id only
      const isExistingEmployee = existing && ((existing.role||'').toString().toLowerCase() === 'employee');
      const empIdValue = updated.employee_id;
      if(isExistingEmployee && empIdValue !== undefined && empIdValue !== (existing.employee_id || existing.employeeId || existing.empId)){
        // Call the dedicated employee-id endpoint and surface server message in toast
        let jr2 = null;
        try{
          let r2 = await fetch(`${BASE_URL}/users/${id}/employee-id`, { method: 'PATCH', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ employee_id: empIdValue }) });
          if(!r2.ok){
            if(r2.status === 405){ r2 = await fetch(`${BASE_URL}/users/${id}/employee-id`, { method: 'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ employee_id: empIdValue }) }); }
            if(!r2.ok){ r2 = await fetch(`${BASE_URL}/users/${id}/employee-id`, { method: 'PUT', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ employee_id: empIdValue }) }); }
          }
          if(!r2.ok){ const txt = await r2.text().catch(()=>null); console.error('Employee-id update failed', r2.status, txt); throw new Error('Employee ID update failed'); }
          jr2 = await r2.json().catch(()=>null);
        }catch(ex){ console.error('Employee-id update error', ex); throw ex; }

        if(jr2) finalUser = { ...(jr2.user || jr2) };

        setUsers(prev => prev.map(u => (u.id === id || u.email === updated.email) ? { ...u, ...finalUser } : u));
        toast?.success(jr2?.message || 'Employee ID updated');
        setEditUser(null);
        setSaving(false);
        return;
      }

      // Fallback: update user resource but exclude employee_id
      const safeUpdated = { ...updated };
      delete safeUpdated.employee_id;
      const res = await fetch(`${BASE_URL}/users/${id}`, { method: 'PATCH', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(safeUpdated) });
      if(!res.ok){ const res2 = await fetch(`${BASE_URL}/users/${id}`, { method: 'PUT', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(safeUpdated) }); if(!res2.ok) throw new Error('Update failed'); const j2 = await res2.json(); finalUser = { ...(j2.user || j2) }; }
      else { const j = await res.json(); finalUser = { ...(j.user || j) }; }

      setUsers(prev => prev.map(u => (u.id === id || u.email === updated.email) ? { ...u, ...finalUser } : u));
      toast?.success('User updated');
      setEditUser(null);
    }catch(err){
      console.error('Failed to save user', err);
      toast?.error('Failed to save user changes');
    }finally{ setSaving(false); }
  }

  return (
    <div className="min-h-screen p-6 bg-slate-50 dark:bg-slate-900 pb-28">
      <div className="max-w-6xl mx-auto">
        
        <section className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 space-y-3 md:space-y-0">
            <div>
              <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-100">All Users</h4>
              <div className="text-sm text-slate-500 dark:text-slate-300">{users.length} users</div>
            </div>

            <div className="flex items-center space-x-3">
              <input value={search} onChange={(e)=>{ setSearch(e.target.value); setPage(1); }} placeholder="Search users..." className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-sm w-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              <select value={rowsPerPage} onChange={(e)=>{ setRowsPerPage(Number(e.target.value)); setPage(1); }} className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value={5}>5 / page</option>
                <option value={10}>10 / page</option>
                <option value={25}>25 / page</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoading && (
              <div className="w-full flex items-center justify-center p-8">
                <div className="flex items-center space-x-3 text-slate-500">
                  <div className="w-8 h-8 rounded-full border-4 border-t-transparent border-slate-300 animate-spin" />
                  <div>Loading users...</div>
                </div>
              </div>
            )}

            {(() => {
              if(isLoading) return null;
              const q = search.trim().toLowerCase();
              const filtered = users.filter(u=>{
                if(!q) return true;
                const fullname = (u.fullname || u.name || '').toString().toLowerCase();
                const email = (u.email || '').toString().toLowerCase();
                const role = (u.role || '').toString().toLowerCase();
                return fullname.includes(q) || email.includes(q) || role.includes(q) || (u.id || '').toString().toLowerCase().includes(q);
              });
              const total = filtered.length;
              const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));
              if(page > totalPages) setPage(1);
              const start = (page-1)*rowsPerPage;
              const pageItems = filtered.slice(start, start + rowsPerPage);

              return (
                <>
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 dark:bg-slate-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Phone</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Emp ID</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                      {pageItems.map(u=> (
                        <tr key={u.id || u.email} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                          <td className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100">{u.fullname || u.name}</td>
                          <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">{u.phone || '-'}</td>
                          <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">{u.email}</td>
                          <td className="px-4 py-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              (u.role || '').toLowerCase() === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300' :
                              (u.role || '').toLowerCase() === 'employee' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' :
                              'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                            }`}>{u.role}</span>
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">{u.employee_id || u.employeeId || u.empId || '-'}</td>
                          <td className="px-4 py-2 text-right">
                            <div className="relative inline-block" data-menu-id={u.id}>
                              <button onClick={(e)=>{ e.stopPropagation(); setOpenId(openId===u.id? null : u.id); }} aria-haspopup="true" aria-expanded={openId===u.id} className="inline-flex items-center p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600">
                                <span className="text-lg">&#x22EE;</span>
                              </button>
                              {openId===u.id && (
                                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg z-50 py-1">
                                  <button onClick={()=>{ setEditUser(u); setOpenId(null); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">Edit</button>
                                  <button onClick={()=>{ if(window.confirm('Disable user '+(u.email||u.id)+'?')){ alert('Disabled (demo)'); } setOpenId(null); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-100 dark:hover:bg-slate-700">Disable</button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-sm text-slate-500">Showing {Math.min(total, start+1)}-{Math.min(total, start + pageItems.length)} of {total}</div>
                    <div className="flex items-center space-x-2">
                      <button onClick={()=> setPage(p=> Math.max(1, p-1))} disabled={page<=1} className="px-3 py-1 rounded bg-slate-100 dark:bg-slate-700 text-sm">Prev</button>
                      {Array.from({length: totalPages}).map((_,i)=> (
                        <button key={i} onClick={()=> setPage(i+1)} className={`px-2 py-1 rounded text-sm ${page===i+1 ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'}`}>{i+1}</button>
                      ))}
                      <button onClick={()=> setPage(p=> Math.min(totalPages, p+1))} disabled={page>=totalPages} className="px-3 py-1 rounded bg-slate-100 dark:bg-slate-700 text-sm">Next</button>
                    </div>
                  </div>
                </>
              );
            })()}

          </div>
        </section>
      </div>

      {editUser && (
        <AdminUsersEditModal user={editUser} onClose={()=> setEditUser(null)} onSave={saveUserUpdates} saving={saving} />
      )}
    </div>
  );
}

// Edit modal rendered at end of file so it overlays
export function AdminUsersEditModal({ user, onClose, onSave, saving }){
  const [role, setRole] = useState(user?.role || 'customer');
  const [employeeId, setEmployeeId] = useState(user?.employee_id || user?.employeeId || user?.empId || '');

  useEffect(()=>{
    setRole(user?.role || 'customer');
    setEmployeeId(user?.employee_id || user?.employeeId || user?.empId || '');
  }, [user]);

  if(!user) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg w-full max-w-md p-4">
        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">Edit User</h3>
        <div className="mt-3 space-y-3">
          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-300">Name</label>
            <div className="mt-1 text-sm text-slate-800 dark:text-slate-200">{user.fullname || user.name}</div>
          </div>
          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-300">Email</label>
            <div className="mt-1 text-sm text-slate-800 dark:text-slate-200">{user.email}</div>
          </div>
          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-300">Role</label>
            <select value={role} onChange={(e)=> setRole(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded bg-white dark:bg-slate-700">
              <option value="customer">Customer</option>
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Show employee id input only when user is already an employee (we don't add emp id while changing role) */}
          {(user?.role || '').toString().toLowerCase() === 'employee' && (
            <div>
              <label className="block text-sm text-slate-600 dark:text-slate-300">Employee ID</label>
              <input value={employeeId} onChange={(e)=> setEmployeeId(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded bg-white dark:bg-slate-700" />
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-end space-x-2">
          <button onClick={onClose} className="px-3 py-2 rounded bg-slate-100 dark:bg-slate-700">Cancel</button>
          <button onClick={() => {
            const payload = { id: user.id };
            if(role !== (user.role || '').toString()) payload.role = role;
            const origEmp = user.employee_id || user.employeeId || user.empId || '';
            if((user.role || '').toString().toLowerCase() === 'employee' && employeeId !== origEmp) payload.employee_id = employeeId;
            onSave(payload);
          }} disabled={saving} className="px-3 py-2 rounded bg-indigo-600 text-white">{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </div>
    </div>
  );
}
