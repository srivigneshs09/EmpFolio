import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import Profile from "./components/Profile";
import SearchJob from "./components/SearchJob";
import PostJob from "./components/PostJob";
import UserTypeDialog from './components/UserTypeDialog';
import { getUserDetails } from './utils/firestore';

function App() {
  const { isLoading, error, isAuthenticated, user } = useAuth0();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userDetailsCollected, setUserDetailsCollected] = useState(false);
  const [userType, setUserType] = useState('');

  useEffect(() => {
    if (isAuthenticated && user) {
      const checkUserDetails = async () => {
        const details = await getUserDetails(user.sub);
        console.log("Fetched User Details:", details); // Debugging log

        // Check if the user details exist and if userDetails array is not empty
        if (details && details.userDetails && details.userDetails.length > 0) {
          setUserDetailsCollected(true);
          setUserType(details.userDetails[0].userType); // Access userType from the array
        } else {
          setTimeout(()=>{
            setDialogOpen(true);
          },4000);
        }
      };
      checkUserDetails();
    }
  }, [isAuthenticated, user]);

  const handleDialogClose = () => {
    setDialogOpen(false);
    setUserDetailsCollected(true);
  };
  const setUserTypeInNavbar = (type) => {
    setUserType(type);
  };

  if (isLoading) {
    return <p className="text-blue-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">Authentication Error</p>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar userDetailsCollected={userDetailsCollected} userType={userType} />
        {user && (
          <UserTypeDialog 
            open={dialogOpen} 
            onClose={handleDialogClose} 
            uid={user.sub} 
            setUserTypeInNavbar={setUserTypeInNavbar} 
          />
         )}
        <main className="flex flex-col items-center justify-center p-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={isAuthenticated ? <Profile /> : <p>Please log in</p>} />
            <Route path="/searchjob" element={userType === 'jobSeeker' ? <SearchJob /> : <p>Access Denied</p>} />
            <Route path="/postjob" element={userType === 'recruiter' ? <PostJob /> : <p>Access Denied</p>} />
          </Routes>
          
        </main>
      </div>
    </Router>
  );
}

export default App;
