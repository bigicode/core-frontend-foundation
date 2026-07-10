import { useEffect, useState } from 'react';
import apiClient from '../services/apiClient';
import useAuth from '../hooks/useAuth';

function ProfilePage() {
  const { token, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

 
  useEffect(() => {
    if (!token || authLoading) return;

    const fetchProfile = async () => {
      try {
        const response = await apiClient.get('/users/profile');
        setProfile(response.data.data);
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token, authLoading]);

 
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setUploadMessage('');
  };

 
  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadMessage('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', selectedFile);

    setUploading(true);
    setUploadMessage('');

    try {
      const response = await apiClient.put('/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadMessage('Avatar updated successfully!');

      setProfile((prev) => ({
        ...prev,
        avatar: response.data.data.avatar,
      }));
      setSelectedFile(null);
     
      document.getElementById('avatarInput').value = '';
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Upload failed';
      setUploadMessage(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="auth-card">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="auth-card">
        <p className="message error">{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="auth-card">
        <p>Please log in</p>
      </div>
    );
  }

 
  const avatarUrl = profile.avatar
    ? `http://localhost:5000${profile.avatar}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.email)}&background=915f6d&color=fff&size=100`;

  return (
    <div className="auth-card">
      <h1 className="auth-title">Profile</h1>

      {/* Avatar Display */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <img
          src={avatarUrl}
          alt="Avatar"
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '3px solid #915f6d',
          }}
        />
        <p style={{ marginTop: '0.5rem', color: '#6b6a7b' }}>{profile.email}</p>
        <p style={{ color: '#6b6a7b' }}>Role: {profile.role || 'user'}</p>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <div className="form-group">
          <label>Change Avatar</label>
          <input
            id="avatarInput"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'block', marginBottom: '0.5rem' }}
          />
          <button
            onClick={handleUpload}
            className="btn-primary"
            style={{ marginTop: '0.5rem' }}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload Avatar'}
          </button>
        </div>
        {uploadMessage && (
          <p
            className={`message ${uploadMessage.includes('successfully') ? 'success' : 'error'}`}
          >
            {uploadMessage}
          </p>
        )}
      </div>

      
      <div style={{ borderTop: '1px solid #d1d5db', paddingTop: '1rem' }}>
        <p>
          <strong>Email:</strong> {profile.email}
        </p>
        <p>
          <strong>Role:</strong> {profile.role || 'user'}
        </p>
        <p>
          <strong>User ID:</strong> {profile.id}
        </p>
        {profile.avatar && (
          <p>
            <strong>Avatar URL:</strong> {profile.avatar}
          </p>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;