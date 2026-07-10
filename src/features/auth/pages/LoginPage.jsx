import { useState } from "react";
import apiClient from "../../../services/apiClient";

function LoginPage(){
    const [ formData, setFormData ] = useState({
        email: '',
        password: '',
    });

    const [ message, setMessage ] = useState ( '' );
    const [ isSuccess, setIsSuccess ] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData, [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            const response = await apiClient.post('/users/login', formData);
            const token = response.data.data.token;
            localStorage.setItem('authToken', token);


            setMessage('Login successful!');
            setIsSuccess (true);

        }catch (error){
            const errorMsg = error.response?.data?.message || 'Login failed';
            setMessage(errorMsg);
            setIsSuccess(false);
        }
    };
  return (
    <div className="auth-card">
      <h1 className="auth-title">MP Platform</h1>
      <p className="auth-subtitle">Welcome back</p>
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
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" className="btn-primary">Login</button>
      </form>
      {message && (
        <div className={`message ${isSuccess ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
      <p className="footer-text">
        Don't have an account? <a href="#">Register</a>
      </p>
    </div>
  );
}

export default LoginPage;