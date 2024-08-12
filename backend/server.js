const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('./ServiceAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://empfolio.firebaseio.com'
});

const db = admin.firestore();
const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // or your frontend URL
  methods: 'GET,POST,PUT,DELETE',
  credentials: true
}));

app.use(bodyParser.json());

// Create a user (only if they don't already exist)
app.post('/api/users', async (req, res) => {
  try {
    const { uid, name, email, picture } = req.body;
    const userRef = db.collection('users').doc(uid);

    const doc = await userRef.get();
    if (doc.exists) {
      return res.status(400).send('User already exists');
    }

    await userRef.set({ name, email, picture });
    res.status(201).send('User created');
  } catch (error) {
    console.error('Error creating user: ', error);
    res.status(500).send('Internal Server Error');
  }
});

// Get user by UID
app.get('/api/users/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const userRef = db.collection('users').doc(uid);
    const doc = await userRef.get();

    if (!doc.exists) {
      return res.status(404).send('User not found');
    }

    res.status(200).json(doc.data());
  } catch (error) {
    console.error('Error fetching user: ', error);
    res.status(500).send('Internal Server Error');
  }
});

// Update user details based on user type
app.post('/api/users/:uid/userdetails', async (req, res) => {
  const { uid } = req.params;
  console.log('Received UID:', uid);
  const userDetails = req.body;

  try {
      // Reference the Firestore document for the user
      const userDocRef = db.collection('users').doc(uid);

      // Retrieve the current document data
      const doc = await userDocRef.get();
      let existingData = [];
      
      // Check if the document exists and has existing data
      if (doc.exists) {
          existingData = doc.data().userDetails || [];
      }

      // Append the new userDetails to the existing data array
      existingData.push(userDetails);

      // Save the updated array back to the document
      await userDocRef.set({ userDetails: existingData }, { merge: true });

      res.status(200).send('User details saved successfully');
  } catch (error) {
      console.error('Error saving user details:', error);
      res.status(500).send('Internal Server Error');
  }
});


// Update user (general update if needed)
app.put('/api/users/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const { name, email, picture } = req.body;
    const userRef = db.collection('users').doc(uid);

    const doc = await userRef.get();
    if (!doc.exists) {
      return res.status(404).send('User not found');
    }

    await userRef.update({ name, email, picture });
    res.status(200).send('User updated');
  } catch (error) {
    console.error('Error updating user: ', error);
    res.status(500).send('Internal Server Error');
  }
});

// Delete user
app.delete('/api/users/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const userRef = db.collection('users').doc(uid);

    await userRef.delete();
    res.status(200).send('User deleted');
  } catch (error) {
    console.error('Error deleting user: ', error);
    res.status(500).send('Internal Server Error');
  }
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.get();

    if (snapshot.empty) {
      return res.status(404).send('No users found');
    }

    const users = [];
    snapshot.forEach(doc => users.push({ id: doc.id, ...doc.data() }));

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users: ', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/users/:uid/userdetails', async (req, res) => {
  try {
    const { uid } = req.params;
    console.log('Received UID:', uid);
    const userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = userDoc.data();
    if (userData.userDetails && userData.userDetails.length > 0) {
      // Assuming the last entry in the userDetails array is the most recent one
      const userDetails = userData.userDetails[userData.userDetails.length - 1];
      return res.status(200).json(userDetails);
    } else {
      return res.status(404).json({ message: 'User details not found' });
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/jobs', async (req, res) => {
  try {
    const { uid, title, skills, description, location } = req.body;

    // Add the job to the jobs collection
    const jobRef = await db.collection('jobs').add({
      title,
      skills,
      description,
      location,
      postedBy: uid,
      postedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Associate the job ID with the user
    const userRef = db.collection('users').doc(uid);
    await userRef.update({
      jobs: admin.firestore.FieldValue.arrayUnion(jobRef.id)
    });

    res.status(201).send('Job posted successfully');
  } catch (error) {
    console.error('Error posting job:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Fetch all jobs
app.get('/api/jobs', async (req, res) => {
  try {
    const jobsRef = db.collection('jobs');
    const snapshot = await jobsRef.get();
    
    if (snapshot.empty) {
      return res.status(404).send('No jobs found');
    }
    
    const jobs = [];
    snapshot.forEach(doc => jobs.push({ id: doc.id, ...doc.data() }));
    
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Fetch job by ID
app.get('/api/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const jobRef = db.collection('jobs').doc(id);
    const doc = await jobRef.get();
    
    if (!doc.exists) {
      return res.status(404).send('Job not found');
    }
    
    res.status(200).json(doc.data());
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/applications', async (req, res) => {
  try {
    const { userId, jobId, applicantName, appliedAt, email, qualification, resume } = req.body;

    // Add the application to the applications collection
    const applicationRef = await db.collection('applications').add({
      userId,
      jobId,
      applicantName,
      appliedAt,
      email,
      qualification,
      resume
    });

    res.status(201).send('Application submitted successfully');
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Fetch all applications
app.get('/api/applications', async (req, res) => {
  try {
    const applicationsRef = db.collection('applications');
    const snapshot = await applicationsRef.get();
    
    if (snapshot.empty) {
      return res.status(404).send('No applications found');
    }
    
    const applications = [];
    snapshot.forEach(doc => applications.push({ id: doc.id, ...doc.data() }));
    
    res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Fetch application by ID
app.get('/api/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const applicationRef = db.collection('applications').doc(id);
    const doc = await applicationRef.get();
    
    if (!doc.exists) {
      return res.status(404).send('Application not found');
    }
    
    res.status(200).json(doc.data());
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Fetch applications for a specific user
app.get('/api/users/:uid/applications', async (req, res) => {
  try {
    const { uid } = req.params;
    const applicationsRef = db.collection('applications').where('userId', '==', uid);
    const snapshot = await applicationsRef.get();
    
    if (snapshot.empty) {
      return res.status(404).send('No applications found for this user');
    }
    
    const applications = [];
    snapshot.forEach(doc => applications.push({ id: doc.id, ...doc.data() }));
    
    res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching user applications:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/jobs/:jobId/applications', async (req, res) => {
  try {
      const { jobId } = req.params;
      // Fetch applications from the database
      const applications = await db.collection('applications').where('jobId', '==', jobId).get();
      
      if (applications.empty) {
          return res.status(404).json({ message: 'No applications found' });
      }
      
      const applicationList = applications.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(applicationList); // Return JSON data
  } catch (error) {
      console.error('Error fetching job applications:', error);
      res.status(500).json({ message: 'Internal Server Error' }); // Return JSON error message
  }
});


// Fetch applications for a specific user
app.get('/api/users/:uid/applications', async (req, res) => {
  try {
    const { uid } = req.params;
    const applicationsRef = db.collection('applications').where('userId', '==', uid);
    const snapshot = await applicationsRef.get();
    
    if (snapshot.empty) {
      return res.status(404).send('No applications found for this user');
    }
    
    const applications = [];
    snapshot.forEach(doc => applications.push({ id: doc.id, ...doc.data() }));
    
    res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching user applications:', error);
    res.status(500).send('Internal Server Error');
  }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
