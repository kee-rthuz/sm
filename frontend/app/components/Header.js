"use client";
import React, { useEffect, useState } from 'react';
import { Search, Bell, Menu, LogOut } from 'lucide-react';

const FixedHeader = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    // Fetch the current user data from your backend
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('http://localhost:8000/current_user', {
          method: 'GET',
          credentials: 'include', // Include cookies with the request
        });
        if (!response.ok) {
          throw new Error('User not authenticated');
        }
        const data = await response.json();
        setCurrentUser(data);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const getAvatar = (name) => {
    if (!name) return '';
    return name.charAt(0).toUpperCase();
  };

  const handleSignOut = async () => {
    try {
      const response = await fetch('http://localhost:8000/logout', {
        method: 'POST',
        credentials: 'include', // Include cookies with the request
      });
      if (!response.ok) {
        throw new Error('Failed to log out');
      }
      setCurrentUser(null); // Clear the current user state
      setIsProfileOpen(false); // Close the profile dropdown
      console.log('Logged out successfully');
      window.location.href = '/login'; // Redirect to the login page
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo or brand name can go here */}
          <div className="flex-shrink-0">
            {/* Add your logo or brand name here */}
          </div>

          {/* Right-aligned items */}
          <div className="flex items-center">
            {/* Notification bell */}
            <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Profile dropdown */}
            <div className="ml-3 relative">
              <div>
                <button
                  onClick={toggleProfile}
                  className="flex items-center focus:outline-none"
                >
                  {currentUser ? (
                    <div className="h-8 w-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-lg font-semibold">
                      {getAvatar(currentUser.username)}
                    </div>
                  ) : (
                    <img
                      className="h-8 w-8 rounded-full"
                      src="/api/placeholder/32/32"
                      alt="User avatar"
                    />
                  )}
                </button>
              </div>
              {isProfileOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <button
                    className="flex items-center px-4 py-2 text-sm text-gray-700 w-full text-left hover:bg-gray-100"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default FixedHeader;