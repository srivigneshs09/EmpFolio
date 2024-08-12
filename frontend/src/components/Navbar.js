import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import logo from '../images/logo.png';

const Navbar = ({ userDetailsCollected, userType }) => {
  const { isAuthenticated } = useAuth0();
  console.log('Navbar Type:',userType);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <nav className="bg-slate-100 text-gray-900 px-4 md:px-8 flex justify-between items-center fixed top-0 left-0 h-14 w-full shadow-md z-50">
      <div className="flex items-center">
        <img src={logo} alt="Company Logo" className="h-12 w-12 md:h-16 md:w-16 lg:h-20 lg:w-20" />
      </div>
      <div className="hidden md:flex items-center space-x-4 md:space-x-6">
        {!isAuthenticated ? (
          <LoginButton />
        ) : (
          <>
            <Link to="/profile" className="bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg text-sm md:text-base">
              Profile
            </Link>
            {!userDetailsCollected && (
              <button className="bg-green-600 text-white px-3 py-1 rounded-full hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg text-sm md:text-base">
                User Registration
              </button>
            )}
            {userType === 'jobSeeker' && (
              <Link to="/searchjob" className="bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg text-sm md:text-base">
                Search Job
              </Link>
            )}
            {userType === 'recruiter' && (
              <Link to="/postjob" className="bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg text-sm md:text-base">
                Post Job
              </Link>
            )}
            <LogoutButton />
          </>
        )}
      </div>
      <button onClick={toggleSidebar} className="md:hidden flex items-center p-2 text-gray-900 hover:text-gray-700 focus:outline-none">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
        </svg>
      </button>

      {/* Sidebar for mobile view */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-slate-100 shadow-lg z-40 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <img src={logo} alt="Company Logo" className="h-12 w-12" />
            <button onClick={toggleSidebar} className="text-gray-900 hover:text-gray-700 focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div className="mt-8 space-y-4">
            {!isAuthenticated ? (
              <LoginButton />
            ) : (
              <>
                <Link onClick={toggleSidebar} to="/profile" className="block bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
                  Profile
                </Link>
                {!userDetailsCollected && (
                  <button onClick={toggleSidebar} className="block bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
                    User Registration
                  </button>
                )}
                {userType === 'jobSeeker' && (
                  <Link onClick={toggleSidebar} to="/searchjob" className="block bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
                    Search Job
                  </Link>
                )}
                {userType === 'recruiter' && (
                  <Link onClick={toggleSidebar} to="/postjob" className="block bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
                    Post Job
                  </Link>
                )}
                <LogoutButton />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Overlay for sidebar */}
      {isSidebarOpen && (
        <div onClick={toggleSidebar} className="fixed inset-0 bg-black opacity-50 z-30"></div>
      )}
    </nav>
  );
};

export default Navbar;
