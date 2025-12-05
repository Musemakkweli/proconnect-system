import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, Springfield, USA',
    city: 'Springfield',
    country: 'USA',
    about: 'Customer since 2023. Likes concise reports and quick responses.'
  });

  // avatar can be a URL or data URL preview
  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=7c3aed&color=fff&size=512`;
  const [avatar, setAvatar] = useState(defaultAvatar);
  const fileRef = useRef(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profile);
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  function openFile() {
    fileRef.current?.click();
  }

  function onFile(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(reader.result);
    };
    reader.readAsDataURL(f);
  }

  function startEdit() {
    setForm(profile);
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
    setForm(profile);
  }

  function saveEdit(e) {
    e.preventDefault();
    setProfile(form);
    setEditing(false);
    setSuccessMsg('Profile updated');
    setTimeout(() => setSuccessMsg(''), 2500);
  }

  function handleLogout() {
    // clear local/session storage and redirect to home/login
    try { localStorage.clear(); sessionStorage.clear(); } catch (e) {}
    setSuccessMsg('Logged out');
    setTimeout(() => navigate('/'), 250);
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 pb-28">
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
            <div className="flex-shrink-0 mb-6 md:mb-0">
              <div className="relative w-40 h-40 md:w-44 md:h-44">
                <img src={avatar} alt="avatar" className="w-full h-full object-cover rounded-full border-4 border-white dark:border-slate-800 shadow" />
                <button type="button" onClick={openFile} className="absolute right-0 bottom-0 -mb-1 -mr-1 bg-indigo-600 hover:bg-indigo-700 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-800">
                  <span className="text-xl">+</span>
                </button>
                <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{profile.name}</h2>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Member</div>
                </div>
                <div>
                  {!editing ? (
                    <div className="flex items-center space-x-2">
                      <button onClick={startEdit} className="px-3 py-1 rounded bg-indigo-600 text-white text-sm">Edit Profile</button>
                      <button onClick={handleLogout} className="px-3 py-1 rounded bg-red-600 text-white text-sm">Logout</button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <button onClick={cancelEdit} className="px-3 py-1 rounded bg-white dark:bg-slate-700 text-sm text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700">Cancel</button>
                      <button onClick={saveEdit} className="px-3 py-1 rounded bg-indigo-600 text-white text-sm">Save</button>
                      <button onClick={handleLogout} className="px-3 py-1 rounded bg-red-600 text-white text-sm">Logout</button>
                    </div>
                  )}
                </div>
              </div>

              {successMsg && <div className="mt-3 text-sm text-green-700 dark:text-green-300">{successMsg}</div>}

              {!editing ? (
                <>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Email</div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{profile.email}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Phone</div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{profile.phone}</div>
                    </div>

                    <div className="md:col-span-2">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Address</div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{profile.address}</div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">City</div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{profile.city}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Country</div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{profile.country}</div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="text-xs text-gray-500 dark:text-gray-400">About</div>
                    <div className="mt-1 text-gray-800 dark:text-gray-200">{profile.about}</div>
                  </div>
                </>
              ) : (
                <form onSubmit={saveEdit} className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400">Name</label>
                      <input value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} className="w-full px-3 py-2 rounded border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-gray-700 dark:text-gray-200" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400">Email</label>
                      <input value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} className="w-full px-3 py-2 rounded border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-gray-700 dark:text-gray-200" />
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400">Phone</label>
                      <input value={form.phone} onChange={(e)=>setForm({...form, phone: e.target.value})} className="w-full px-3 py-2 rounded border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-gray-700 dark:text-gray-200" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400">City</label>
                      <input value={form.city} onChange={(e)=>setForm({...form, city: e.target.value})} className="w-full px-3 py-2 rounded border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-gray-700 dark:text-gray-200" />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-xs text-gray-500 dark:text-gray-400">Address</label>
                      <input value={form.address} onChange={(e)=>setForm({...form, address: e.target.value})} className="w-full px-3 py-2 rounded border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-gray-700 dark:text-gray-200" />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-xs text-gray-500 dark:text-gray-400">About</label>
                      <textarea value={form.about} onChange={(e)=>setForm({...form, about: e.target.value})} rows={3} className="w-full px-3 py-2 rounded border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-gray-700 dark:text-gray-200" />
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom navigation removed — left sidebar handles navigation */}
    </div>
  );
}
