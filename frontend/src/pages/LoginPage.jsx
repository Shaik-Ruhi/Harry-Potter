import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const LoginPage = () => {
  const navigate = useNavigate();
  const { saveAuth, setError, setLoading } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', form);
      saveAuth({ name: response.data.name, email: response.data.email }, response.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} required />
        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default LoginPage;
