import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { authService } from '../services/authService.js';
import { useNotifications } from '../context/NotificationContext.jsx';

export default function ProfilePage() {
  const { user, token, setUser } = useAuth();
  const { notify } = useNotifications();
  const [form, setForm] = useState({ name: '', phone: '' });

  useEffect(() => {
    if (user) setForm({ name: user.name || '', phone: user.phone || '' });
  }, [user]);

  function onChange(e) { setForm((f) => ({ ...f, [e.target.name]: e.target.value })); }

  async function submit() {
    try {
      const res = await authService.updateProfile(form, token);
      setUser(res.user);
      notify('success', 'Updated profile');
    } catch (e) {
      notify('error', e?.response?.data?.message || 'Failed');
    }
  }

  if (!user) return null;
  return (
    <div className="card">
      <h2>Profile</h2>
      <label>Name</label>
      <input name="name" value={form.name} onChange={onChange} />
      <label>Phone</label>
      <input name="phone" value={form.phone} onChange={onChange} />
      <button className="btn" onClick={submit}>Save</button>
    </div>
  );
}


