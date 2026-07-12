import { useState } from 'react';
import apiClient from '../../../services/apiClient';

function RegisterPage({onRegisterSuccess}) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user'
  });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.post('/users/register', formData);
      setMessage(response.data.message);
      setIsSuccess(true);
      setFormData({ email: '', password: '', role: 'user' });
      
      if (onRegisterSuccess){
        onRegisterSuccess();
      }

    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Registration failed';
      setMessage(errorMsg);
      setIsSuccess(false);
    }
  };

  return (
    <div className="auth-card">
      <h1 className="auth-title">MP Platform</h1>
      <p className="auth-subtitle">Create your account</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Min 8 chars, with upper, lower, special"
            required
          />
        </div>
        <div className="form-group">
          <label>Role</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit" className="btn-primary">Register</button>
      </form>
      {message && (
        <div className={`message ${isSuccess ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
      <p className="footer-text">
        Already have an account? <a href="#">Login</a>
      </p>
    </div>
  );
}

export default RegisterPage;