import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNotifications } from '../../context/NotificationContext.jsx';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../../services/authService.js';

export default function LoginForm() {
  const { login } = useAuth();
  const { notify } = useNotifications();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  async function onSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      await login(email, password, role);
      notify('success', 'Logged in successfully');
      
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

  async function handleForgotPassword() {
    try {
      setLoading(true);
      await authService.forgotPassword(email);
      setOtpSent(true);
      notify('success', 'OTP sent to your email');
    } catch (error) {
      notify('error', error?.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOTP() {
    try {
      setLoading(true);
      await authService.verifyOTP(email, otp);
      setOtpVerified(true);
      notify('success', 'OTP verified successfully');
    } catch (error) {
      notify('error', error?.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword() {
    if (newPassword !== confirmPassword) {
      notify('error', 'Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await authService.resetPassword(email, otp, newPassword);
      notify('success', 'Password reset successfully');
      setShowForgotPassword(false);
      setOtpSent(false);
      setOtpVerified(false);
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      notify('error', error?.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  }

  if (showForgotPassword) {
    return (
      <div className="card" style={{ maxWidth: 420 }}>
        <h3>Reset Password</h3>
        
        {!otpSent ? (
          <div>
            <p>Enter your email to receive an OTP</p>
            <label>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <button 
              className="btn" 
              onClick={handleForgotPassword} 
              disabled={loading || !email}
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </div>
        ) : !otpVerified ? (
          <div>
            <p>Enter the OTP sent to your email</p>
            <label>OTP</label>
            <input 
              type="text" 
              value={otp} 
              onChange={(e) => setOtp(e.target.value)} 
              placeholder="6-digit OTP"
              maxLength={6}
              required 
            />
            <button 
              className="btn" 
              onClick={handleVerifyOTP} 
              disabled={loading || !otp}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        ) : (
          <div>
            <p>Enter your new password</p>
            <label>New Password</label>
            <input 
              type="password" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              required 
            />
            <label>Confirm Password</label>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
            />
            <button 
              className="btn" 
              onClick={handleResetPassword} 
              disabled={loading || !newPassword || !confirmPassword}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        )}
        
        <button 
          className="btn btn-secondary" 
          onClick={() => setShowForgotPassword(false)}
          style={{ marginTop: '10px' }}
        >
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card" style={{ maxWidth: 420 }}>
      <h3>Login</h3>
      
      <label>Email</label>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        required 
      />
      
      <label>Password</label>
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        required 
      />
      
      <label>Role</label>
      <select 
        value={role} 
        onChange={(e) => setRole(e.target.value)}
        required
      >
        <option value="customer">Customer</option>
        <option value="admin">Admin</option>
      </select>
      
      <button className="btn" type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      
      <button 
        type="button" 
        className="btn btn-link" 
        onClick={() => setShowForgotPassword(true)}
        style={{ marginTop: '10px' }}
      >
        Forgot Password?
      </button>
    </form>
  );
}


