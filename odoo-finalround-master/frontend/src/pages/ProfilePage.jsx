import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { authService } from '../services/authService.js';
import { useNotifications } from '../context/NotificationContext.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import './ProfilePage.css';
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
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

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
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (form.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(form.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (form.street && !form.city) {
      newErrors.city = 'City is required if street is provided';
    }
    
    if (form.zipCode && !/^\d{5,6}(?:[-\s]\d{4})?$/.test(form.zipCode)) {
      newErrors.zipCode = 'Please enter a valid zip code';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function submit() {
    if (!validateForm()) {
      notify('error', 'Please fix the errors in the form');
      return;
    }
    
    try {
      setIsLoading(true);
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
      setIsEditing(false);
      notify('success', 'Profile updated successfully!');
    } catch (e) {
      notify('error', e?.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  }

  const handleCancel = () => {
    // Reset form to original user data
    setForm({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      street: user.address?.street || '',
      city: user.address?.city || '',
      state: user.address?.state || '',
      zipCode: user.address?.zipCode || ''
    });
    setErrors({});
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="profile-loading">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <h1 className="profile-title">My Profile</h1>
        <p className="profile-subtitle">Manage your account information</p>
      </div>

      <div className="profile-card">
        <div className="profile-card-header">
          <h2>Personal Information</h2>
          {!isEditing && (
            <button 
              className="btn-edit"
              onClick={() => setIsEditing(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="icon-edit" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Profile
            </button>
          )}
        </div>

        <div className="profile-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input 
                id="name"
                name="name" 
                value={form.name} 
                onChange={onChange}
                className={`form-input ${errors.name ? 'error' : ''}`}
                disabled={!isEditing}
                placeholder="Enter your full name"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input 
                id="email"
                name="email" 
                value={form.email} 
                className="form-input disabled"
                disabled
                placeholder="Your email address"
              />
              <div className="input-note">Email cannot be changed</div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">Phone Number</label>
            <input 
              id="phone"
              name="phone" 
              value={form.phone} 
              onChange={onChange}
              className={`form-input ${errors.phone ? 'error' : ''}`}
              disabled={!isEditing}
              placeholder="Enter your phone number"
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          <div className="profile-section-divider">
            <span>Address Information</span>
          </div>

          <div className="form-group">
            <label htmlFor="street" className="form-label">Street Address</label>
            <input 
              id="street"
              name="street" 
              value={form.street} 
              onChange={onChange}
              className="form-input"
              disabled={!isEditing}
              placeholder="Enter your street address"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city" className="form-label">City</label>
              <input 
                id="city"
                name="city" 
                value={form.city} 
                onChange={onChange}
                className={`form-input ${errors.city ? 'error' : ''}`}
                disabled={!isEditing}
                placeholder="Enter your city"
              />
              {errors.city && <span className="error-message">{errors.city}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="state" className="form-label">State</label>
              <input 
                id="state"
                name="state" 
                value={form.state} 
                onChange={onChange}
                className="form-input"
                disabled={!isEditing}
                placeholder="Enter your state"
              />
            </div>

            <div className="form-group">
              <label htmlFor="zipCode" className="form-label">Zip Code</label>
              <input 
                id="zipCode"
                name="zipCode" 
                value={form.zipCode} 
                onChange={onChange}
                className={`form-input ${errors.zipCode ? 'error' : ''}`}
                disabled={!isEditing}
                placeholder="Enter your zip code"
              />
              {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
            </div>
          </div>

          {isEditing && (
            <div className="form-actions">
              <button 
                className="btn-secondary"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={submit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="small" />
                    Saving...
                  </>
                ) : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}