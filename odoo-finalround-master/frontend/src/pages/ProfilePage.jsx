import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { authService } from '../services/authService.js';
import { useNotifications } from '../context/NotificationContext.jsx';

export default function ProfilePage() {
  const { user, token, setUser } = useAuth();
  const { notify } = useNotifications();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: ''
  });

  // Load user into form
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        zipCode: user.address?.zipCode || ''
      });
    }
  }, [user]);

  function onChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function submit() {
    try {
      const payload = {
        name: form.name,
        phone: form.phone,
        address: {
          street: form.street,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode
        }
      };

      const res = await authService.updateProfile(payload, token);
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

      <label>Email</label>
      <input name="email" value={form.email} disabled />

      <label>Phone</label>
      <input name="phone" value={form.phone} onChange={onChange} />

      <h3>Address</h3>
      <label>Street</label>
      <input name="street" value={form.street} onChange={onChange} />

      <label>City</label>
      <input name="city" value={form.city} onChange={onChange} />

      <label>State</label>
      <input name="state" value={form.state} onChange={onChange} />

      <label>Zip Code</label>
      <input name="zipCode" value={form.zipCode} onChange={onChange} />

      <button className="btn" onClick={submit}>Save</button>
    </div>
  );
}
