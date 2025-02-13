import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// Ensure axios is configured
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      console.log('Attempting login with:', { email, password });
      
      const response = await axios.post(
        'http://localhost:3000/api/auth/login', 
        { email, password }
      );
      
      console.log('Login response:', response.data);
      login(response.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', {
        response: err.response,
        request: err.request,
        message: err.message,
        config: err.config
      });
      
      setError(
        err.response?.data?.message || 
        err.message || 
        'Login failed'
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-violet-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-violet-800 text-center">Student Login</h2>
        {error && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-violet-700 mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-violet-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-violet-700 mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-violet-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-violet-600 text-white py-2 rounded-md hover:bg-violet-700 transition duration-300 cursor-pointer"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-violet-700">
            Don't have an account?{' '}
            <a 
              href="/register" 
              className="text-yellow-600 hover:underline cursor-pointer"
            >
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
