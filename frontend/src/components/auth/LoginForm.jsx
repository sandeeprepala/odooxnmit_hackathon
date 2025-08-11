import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNotifications } from '../../context/NotificationContext.jsx';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function LoginForm() {
  const { login } = useAuth();
  const { notify } = useNotifications();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  async function onSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      await login(email, password);
      notify('success', 'Logged in');
      
      // Redirect to return URL if provided, otherwise to dashboard
      const returnUrl = searchParams.get('returnUrl');
      if (returnUrl) {
        navigate(decodeURIComponent(returnUrl));
      } else {
        navigate('/dashboard');
      }
    } catch (e2) {
      notify('error', e2?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card" style={{ maxWidth: 420 }}>
      <h3>Login</h3>
      <label>Email</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <label>Password</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button className="btn" type="submit" disabled={loading}>Login</button>
    </form>
  );
}


