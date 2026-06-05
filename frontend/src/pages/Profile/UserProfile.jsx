import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import './UserProfile.css';

const UserProfile = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || 'Sarah Connor',
    email: user?.email || 'admin@enterprise.com',
    role: user?.role || 'Chief HR Officer',
    bio: 'Overseeing corporate talent acquisition, biometric integrations, and AI analytics metrics for Enterprise HR Core.',
    phone: '+1 (555) 019-2834',
    location: 'San Francisco, CA'
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');

    // Simulate saving profile details
    setTimeout(() => {
      setSuccessMsg('Biographical profile updated successfully!');
      setLoading(false);
    }, 800);
  };

  return (
    <div className="user-profile-page-root animate-fade-in">
      {successMsg && <Alert type="success" message={successMsg} onClose={() => setSuccessMsg('')} />}

      <div className="user-profile-grid">
        {/* Left Side: Avatar Card */}
        <div className="profile-side-avatar-card glass-card">
          <div className="avatar-card-top">
            <img src={user?.avatar} alt={formData.name} className="user-master-profile-avatar" />
            <span className="profile-badge-active">ACTIVE CHRO</span>
            <h3>{formData.name}</h3>
            <p className="profile-card-role">{formData.role}</p>
            <span className="profile-card-loc">📍 {formData.location}</span>
          </div>

          <div className="profile-card-biometrics">
            <div className="biometric-tag-row">
              <span>Security Clear</span>
              <strong>LEVEL 5 (ADMIN)</strong>
            </div>
            <div className="biometric-tag-row">
              <span>Nodal Sync</span>
              <strong>REST API ON</strong>
            </div>
          </div>
        </div>

        {/* Right Side: Detailed Edit Bio Form */}
        <div className="profile-edit-bio-panel glass-card">
          <h3 className="profile-edit-title">Edit Biographical Details</h3>
          <p className="profile-edit-meta">Update your primary identity variables in the enterprise core registry.</p>

          <form onSubmit={handleProfileSave} className="profile-edit-details-form">
            <div className="form-row-2">
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Registered Role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                disabled
              />
            </div>

            <div className="form-row-2">
              <Input
                label="Corporate Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Direct Line Phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group bio-form-group">
              <label className="form-label">Professional Biography</label>
              <textarea
                name="bio"
                className="form-input bio-textarea"
                value={formData.bio}
                onChange={handleInputChange}
                rows="4"
              ></textarea>
            </div>

            <Button type="submit" variant="primary" loading={loading}>
              Save Identity Variables
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
