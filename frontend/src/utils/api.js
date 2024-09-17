import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const userExists = async (uid) => {
  try {
    const response = await axios.get(`${API_URL}/users/${encodeURIComponent(uid)}`);
    return response.status === 200; 
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return false; 
    }
    console.error('Error checking user existence: ', error);
    throw error;
  }
};

export const saveUserToBackend = async (user) => {
  try {
    const userExistsInDb = await userExists(user.sub);
    if (userExistsInDb) {
      console.log('User already exists');
      return;
    }
    
    await axios.post(`${API_URL}/users`, {
      uid: user.sub,
      name: user.name,
      email: user.email,
      picture: user.picture
    });
    console.log('User saved successfully');
  } catch (error) {
    console.error('Error saving user: ', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const saveUserDetails = async (uid, userType, details) => {
  try {
    await axios.post(`${API_URL}/users/${encodeURIComponent(uid)}/userdetails`, {
      userType,
      details
    });
    console.log('User details saved successfully');
  } catch (error) {
    console.error('Error saving user details: ', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getUser = async (uid) => {
  try {
    const response = await axios.get(`${API_URL}/users/${encodeURIComponent(uid)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user: ', error);
    throw error;
  }
};

export const getUserDetails = async (uid) => {
  console.log('Fetching details for UID:', uid);
  try {
    const response = await axios.get(`${API_URL}/users/${encodeURIComponent(uid)}/userdetails`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user details:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getUserResume = async (uid) => {
  console.log('Fetching details for UID:', uid);
  try {
    const response = await axios.get(`${API_URL}/users/${encodeURIComponent(uid)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user details:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getApplicationsByJob = async (jobId) => {
  const response = await fetch(`/api/jobs/${jobId}/applications`);
  if (!response.ok) {
      throw new Error('Failed to fetch applications');
  }
  return response.json();
};

export const getApplicationsByUser = async (userId) => {
  const response = await fetch(`/api/users/${userId}/applications`);
  if (!response.ok) {
      throw new Error('Failed to fetch applications');
  }
  return response.json();
};
