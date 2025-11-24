import React, { useState, useMemo, useEffect } from 'react';
import DonutChart from '../components/DonutChart';
import BarChart from '../components/BarChart';
import AdminBottomNav from '../components/AdminBottomNav';
import ThemeToggle from '../components/ThemeToggle';
import BASE_URL from '../config';

const sampleComplaints = [
  { id:1, title:'Login issue', type:'Private', status:'Open', customer:'Cecilia' },
  { id:2, title:'Payment failed', type:'Common', status:'Resolved', customer:'Bob' },
  { id:3, title:'Feature request', type:'Common', status:'Investigating', customer:'Alice' },
  { id:4, title:'Data sync', type:'Private', status:'Open', customer:'Daniel' },
];

export default function AdminComplaints({ toast }){
  const [filter, setFilter] = useState('all');
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [isEmployeesLoading, setIsEmployeesLoading] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [activeComplaint, setActiveComplaint] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);

  // fetch complaints from API
  useEffect(()=>{
    let mounted = true;
    (async ()=>{
      setIsLoading(true);
      try{
        const res = await fetch(`${BASE_URL}/complaints`);
        if(!res.ok) throw new Error('Failed to fetch complaints');
        const data = await res.json();
        if(mounted) setComplaints(Array.isArray(data) ? data : (data.results || []));
      }catch(err){
        console.error('Failed to load complaints', err);
        if(mounted) setComplaints(sampleComplaints);
      }finally{
        if(mounted) setIsLoading(false);
      }
    })();
    return ()=> mounted = false;
  }, []);

  // fetch employees for assignment dropdown
  useEffect(()=>{
    let mounted = true;
    (async ()=>{
      setIsEmployeesLoading(true);
      try{
        const r = await fetch(`${BASE_URL}/employees`);
        if(!r.ok) throw new Error('Failed to fetch employees');
        const d = await r.json();
        if(mounted) setEmployees(Array.isArray(d) ? d : (d.results || d.data || []));
      }catch(err){
        console.error('Failed to load employees', err);
        if(mounted) setEmployees([]);
      }finally{
        if(mounted) setIsEmployeesLoading(false);
      }
    })();
    return ()=> mounted = false;
  }, []);

  const filtered = useMemo(()=> complaints.filter(c=> filter==='all' ? true : (c.complaint_type || c.type || '').toString().toLowerCase()===filter), [complaints, filter]);

  return (
    <div className="min-h-screen p-6 bg-slate-50 dark:bg-slate-900 pb-28">
      <div className="max-w-6xl mx-auto">
        

        <section className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Complaints</h4>
              <div className="text-sm text-slate-500 dark:text-slate-300">{complaints.length} total</div>
            </div>
            <div className="space-x-2">
              <button onClick={()=>setFilter('all')} className={`px-3 py-1 rounded ${filter==='all' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'}`}>All</button>
              <button onClick={()=>setFilter('private')} className={`px-3 py-1 rounded ${filter==='private' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'}`}>Private</button>
              <button onClick={()=>setFilter('common')} className={`px-3 py-1 rounded ${filter==='common' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'}`}>Common</button>
              <ThemeToggle />
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="w-full flex items-center justify-center p-8">
                <div className="flex items-center space-x-3 text-slate-500">
                  <div className="w-8 h-8 rounded-full border-4 border-t-transparent border-slate-300 animate-spin" />
                  <div>Loading complaints...</div>
                </div>
              </div>
            ) : (
            <table className="w-full text-left">
              <thead className="text-slate-600 dark:text-slate-300 text-sm">
                <tr>
                  <th className="py-2">Title</th>
                  <th className="py-2">User ID</th>
                  <th className="py-2">Type</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Created</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="text-slate-700 dark:text-slate-200">
                {filtered.map(c=> (
                  <tr key={c.id} className="border-t border-slate-100 dark:border-slate-700">
                    <td className="py-3">{c.title}</td>
                    <td className="py-3 text-sm text-slate-500 dark:text-slate-300">{c.user_id}</td>
                    <td className="py-3"><span className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700">{(c.complaint_type || c.type || '').toString().replace(/^./, s => s.toUpperCase())}</span></td>
                    <td className="py-3">{(c.status || '').toString().replace(/^./, s => s.toUpperCase())}</td>
                    <td className="py-3 text-sm text-slate-500 dark:text-slate-300">{new Date(c.created_at || c.created).toLocaleString()}</td>
                    <td className="py-3 relative">
                      <div className="inline-block text-left">
                        <button onClick={() => setMenuOpenId(menuOpenId === c.id ? null : c.id)} className="px-2 py-1 rounded text-gray-600 dark:text-gray-200 bg-transparent hover:bg-gray-100 dark:hover:bg-slate-700">
                          <span className="text-xl">⋯</span>
                        </button>

                        {menuOpenId === c.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded shadow-lg z-20">
                            <div className="py-1">
                              <button onClick={() => { setActiveComplaint(c); setAssignModalOpen(true); setMenuOpenId(null); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700">Assign</button>
                              <button onClick={() => { setActiveComplaint(c); setRejectModalOpen(true); setMenuOpenId(null); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700">Reject</button>
                              <button onClick={() => { if (toast && toast.success) toast.success('Resolve not implemented'); else console.log('Resolve'); setMenuOpenId(null); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700">Resolve</button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            )}
          </div>
        </section>
      </div>
      <AdminBottomNav />

      {/* Assign modal */}
      {assignModalOpen && activeComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setAssignModalOpen(false)} />
          <div className="relative bg-white dark:bg-slate-800 rounded-lg shadow-lg w-full max-w-md mx-4 p-6 z-10">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3">Assign Complaint</h3>
            <div className="text-sm text-slate-600 dark:text-slate-300 mb-3">{activeComplaint.title}</div>
            <label className="block text-sm text-slate-700 dark:text-slate-200 mb-2">Employee</label>
            <select value={selectedEmployeeId} onChange={(e) => setSelectedEmployeeId(e.target.value)} className="w-full px-3 py-2 rounded border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-gray-700 dark:text-gray-200 mb-4">
              <option value="">Select employee...</option>
              {employees.map(emp => (
                // prefer human employee_id (like "01014") if present, otherwise fall back to internal uuid id
                <option key={emp.id} value={emp.employee_id || emp.id}>{emp.name}{emp.employee_id ? ` (${emp.employee_id})` : ''}</option>
              ))}
            </select>
            <div className="flex items-center justify-end space-x-2">
              <button onClick={() => setAssignModalOpen(false)} className="px-3 py-1 rounded-md bg-white dark:bg-slate-700 text-sm text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700">Cancel</button>
              <button disabled={assignLoading} onClick={async () => {
                if (!selectedEmployeeId) { if (toast && toast.error) toast.error('Select an employee'); return; }
                setAssignLoading(true);
                try {
                  let finalOk = false;
                  let finalRes = null;
                  let finalJr = null;

                  // Attempt 1: PUT /complaints/:id/assign { employee_id }
                  try {
                    const url1 = `${BASE_URL}/complaints/${activeComplaint.id}/assign`;
                    let res1 = await fetch(url1, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ employee_id: selectedEmployeeId }) });
                    let jr1 = await res1.json().catch(()=>({}));
                    if (res1.ok) { finalOk = true; finalRes = res1; finalJr = jr1; }
                    else { finalRes = res1; finalJr = jr1; }
                  } catch (e) {
                    // ignore, continue to next attempt
                  }

                  // Attempt 2: POST /complaints/assign { complaint_id, employee_id }
                  if (!finalOk) {
                    try {
                      const url2 = `${BASE_URL}/complaints/assign`;
                      let res2 = await fetch(url2, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ complaint_id: activeComplaint.id, employee_id: selectedEmployeeId }) });
                      let jr2 = await res2.json().catch(()=>({}));
                      if (res2.ok) { finalOk = true; finalRes = res2; finalJr = jr2; }
                      else { finalRes = res2; finalJr = jr2; }
                    } catch (e) {}
                  }

                  // Attempt 3: POST /assignments { complaint_id, employee_id }
                  if (!finalOk) {
                    try {
                      const url3 = `${BASE_URL}/assignments`;
                      let res3 = await fetch(url3, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ complaint_id: activeComplaint.id, employee_id: selectedEmployeeId }) });
                      let jr3 = await res3.json().catch(()=>({}));
                      if (res3.ok) { finalOk = true; finalRes = res3; finalJr = jr3; }
                      else { finalRes = res3; finalJr = jr3; }
                    } catch (e) {}
                  }

                  // Attempt 4: PATCH /complaints/:id { assigned_employee_id }
                  if (!finalOk) {
                    try {
                      const url4 = `${BASE_URL}/complaints/${activeComplaint.id}`;
                      let res4 = await fetch(url4, { method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ assigned_employee_id: selectedEmployeeId }) });
                      let jr4 = await res4.json().catch(()=>({}));
                      if (res4.ok) { finalOk = true; finalRes = res4; finalJr = jr4; }
                      else { finalRes = res4; finalJr = jr4; }
                    } catch (e) {}
                  }

                  if (finalOk) {
                    if (toast && toast.success) toast.success(finalJr?.message || 'Assigned successfully');
                    // record assigned employee id (human-readable employee_id) in the UI
                    setComplaints(prev => prev.map(x => x.id === activeComplaint.id ? ({ ...x, assigned_employee_id: selectedEmployeeId, status: 'assigned' }) : x));
                    setAssignModalOpen(false);
                    setSelectedEmployeeId('');
                    setActiveComplaint(null);
                  } else {
                    // show diagnostic info
                    const status = finalRes ? finalRes.status : 'network';
                    const bodyText = finalJr ? (finalJr.message || JSON.stringify(finalJr)) : 'no-response-body';
                    if (toast && toast.error) toast.error(`${status}: ${bodyText}`);
                    else console.error('Assign failed', status, bodyText);
                  }
                } catch (err) {
                  if (toast && toast.error) toast.error(err.message || 'Network error');
                } finally {
                  setAssignLoading(false);
                }
              }} className={`px-4 py-1 rounded-md bg-indigo-600 text-white text-sm ${assignLoading ? 'opacity-60 cursor-not-allowed' : ''}`}>
                {assignLoading ? (
                  <span className="inline-flex items-center">
                    <span className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Assigning...
                  </span>
                ) : 'Assign'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject modal */}
      {rejectModalOpen && activeComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setRejectModalOpen(false)} />
          <div className="relative bg-white dark:bg-slate-800 rounded-lg shadow-lg w-full max-w-md mx-4 p-6 z-10">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3">Reject Complaint</h3>
            <div className="text-sm text-slate-600 dark:text-slate-300 mb-3">{activeComplaint.title}</div>
            <label className="block text-sm text-slate-700 dark:text-slate-200 mb-2">Reason</label>
            <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={4} className="w-full px-3 py-2 rounded border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-gray-700 dark:text-gray-200 mb-4" />
            <div className="flex items-center justify-end space-x-2">
              <button onClick={() => setRejectModalOpen(false)} className="px-3 py-1 rounded-md bg-white dark:bg-slate-700 text-sm text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700">Cancel</button>
              <button onClick={async () => {
                if (!rejectReason.trim()) { if (toast && toast.error) toast.error('Enter rejection reason'); return; }
                try {
                  const url = `${BASE_URL}/complaints/${activeComplaint.id}/reject`;
                  let res = await fetch(url, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ reason: rejectReason }) });
                  let jr = await res.json().catch(()=>({}));
                  if (!res.ok) {
                    // fallback: patch complaint with status and reason
                    const url2 = `${BASE_URL}/complaints/${activeComplaint.id}`;
                    res = await fetch(url2, { method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ status: 'rejected', rejection_reason: rejectReason }) });
                    jr = await res.json().catch(()=>({}));
                  }
                  if (res.ok) {
                    if (toast && toast.success) toast.success(jr?.message || 'Complaint rejected');
                    setComplaints(prev => prev.map(x => x.id === activeComplaint.id ? ({ ...x, status: 'rejected', rejection_reason: rejectReason }) : x));
                    setRejectModalOpen(false);
                    setRejectReason('');
                    setActiveComplaint(null);
                  } else {
                    if (toast && toast.error) toast.error(jr?.message || 'Failed to reject complaint');
                  }
                } catch (err) {
                  if (toast && toast.error) toast.error(err.message || 'Network error');
                }
              }} className="px-4 py-1 rounded-md bg-red-600 text-white text-sm">Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
