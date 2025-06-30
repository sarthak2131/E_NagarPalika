import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { endpoints } from '../config/api';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    axios.get(endpoints.auth.me, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setUser(res.data))
      .catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-lg text-gray-600 dark:text-gray-300">Loading profile...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-lg text-red-600 dark:text-red-400">{error}</span>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="backdrop-blur-lg bg-white/60 dark:bg-gray-900/70 border border-white/40 dark:border-gray-700 rounded-2xl shadow-xl p-8 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 via-blue-300 to-blue-700 dark:from-blue-800 dark:via-blue-600 dark:to-blue-400 flex items-center justify-center mb-6 shadow-lg">
          <span className="text-4xl font-bold text-white select-none">
            {user.employeeName ? user.employeeName.charAt(0).toUpperCase() : '?'}
          </span>
        </div>
        <h1 className="text-3xl font-bold mb-6 dark:text-white tracking-tight">Profile</h1>
        <div className="w-full grid grid-cols-1 gap-4">
          <ProfileField label="User ID" value={user.userId || user.username} />
          <ProfileField label="Name" value={user.employeeName} />
          <ProfileField label="Employee Code" value={user.employeeCode} />
          <ProfileField label="Designation" value={user.designation} />
          <ProfileField label="Mobile" value={user.mobile} />
          <ProfileField label="Email" value={user.email} />
          <ProfileField label="ULB Code" value={user.ulbCode} />
          <ProfileField label="Section" value={user.section} />
          <ProfileField label="Role" value={user.role} />
        </div>
        <button className="rounded-full px-6 py-3 bg-blue-400/60 dark:bg-blue-700/60 text-white font-semibold shadow mt-8 w-full cursor-not-allowed opacity-60" disabled>Edit Profile</button>
      </div>
    </div>
  );
};

const ProfileField = ({ label, value }) => (
  <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 py-2">
    <span className="font-medium text-gray-600 dark:text-gray-300">{label}</span>
    <span className="text-gray-900 dark:text-white">{value || '-'}</span>
  </div>
);

export default Profile; 