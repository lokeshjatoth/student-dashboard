import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// Ensure axios is configured
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const Dashboard = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/profile`, 
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setUserProfile(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch profile');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-violet-50 flex items-center justify-center">
        <div className="text-violet-800">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-violet-50 flex items-center justify-center">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-violet-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-violet-800">Student Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition duration-300 cursor-pointer"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-violet-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-violet-800 mb-4">Personal Information</h2>
            <p><strong className="text-violet-700">Name:</strong> {userProfile.name}</p>
            <p><strong className="text-violet-700">Email:</strong> {userProfile.email}</p>
          </div>

          <div className="bg-violet-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-violet-800 mb-4">Academic Details</h2>
            <p><strong className="text-violet-700">Department:</strong> {userProfile.profile.department}</p>
            <p><strong className="text-violet-700">Semester:</strong> {userProfile.profile.semester}</p>
          </div>
        </div>

        <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-violet-800 mb-4">Upcoming Applications</h2>
          <p className="text-violet-700">No current applications.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
