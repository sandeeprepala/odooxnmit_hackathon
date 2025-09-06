import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNotifications } from '../../context/NotificationContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function RegisterForm() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { notify } = useNotifications();
  
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    phone: '',
    role: 'customer'
  });
  
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  function onChange(e) { 
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function validatePassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regex.test(password)) {
      return "Password must be at least 8 characters, include 1 uppercase, 1 lowercase, 1 number, and 1 special character.";
    }
    return '';
  }

  async function onSubmit(e) {
    e.preventDefault();

    // Validate password before sending
    const error = validatePassword(form.password);
    if (error) {
      setPasswordError(error);
      return;
    }
    setPasswordError('');

    try {
      setLoading(true);
      await register(form);
      notify('success', 'Registered and logged in successfully');
      navigate('/dashboard');
    } catch (e2) {
      notify('error', e2?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 style={{textAlign: 'center', marginBottom: '20px', fontSize: '2rem', fontWeight: 'bold' }}>Register Page</h1>
      <form onSubmit={onSubmit} className="card" style={{ maxWidth: 420 }}>
        <label>Name</label>
        <input 
          name="name" 
          value={form.name} 
          onChange={onChange} 
          required 
        />
        
        <label>Email</label>
        <input 
          type="email" 
          name="email" 
          value={form.email} 
          onChange={onChange} 
          required 
        />
        
        <label>Phone</label>
        <input 
          type="tel" 
          name="phone" 
          value={form.phone} 
          onChange={onChange} 
          placeholder="Enter phone number"
        />
        
        <label>Role</label>
        <select 
          name="role" 
          value={form.role} 
          onChange={onChange}
          required
        >
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>
        
        <label>Password</label>
        <input 
          type="password" 
          name="password" 
          value={form.password} 
          onChange={onChange} 
          required 
        />
        {passwordError && (
          <p style={{color: 'red', fontSize: '0.9rem'}}>{passwordError}</p>
        )}
        
        <button className="btn" type="submit" disabled={loading} style={{margin: '15px'}}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
}
