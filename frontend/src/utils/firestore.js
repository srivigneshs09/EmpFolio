// src/utils/firestore.js
import { collection, addDoc, doc, updateDoc, arrayUnion, getDoc, query, where, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../components/firebase'; 

export const getUserDetails = async (uid) => {
  try {
    const userDoc = doc(db, 'users', uid);
    const docSnap = await getDoc(userDoc);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error("Error fetching user details: ", error);
    return null;
  }
};

export const addJobToCollection = async (jobData) => {
  const jobRef = await addDoc(collection(db, 'jobs'), jobData);
  return jobRef.id;
};

export const addJobToUser = async (uid, jobId) => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
      jobs: arrayUnion(jobId)
  });
};

export const getJobsByUser = async (uid) => {
  const q = query(collection(db, 'jobs'), where('postedBy', '==', uid));
  const querySnapshot = await getDocs(q);
  const jobs = [];
  querySnapshot.forEach((doc) => {
    jobs.push({ id: doc.id, ...doc.data() });
  });
  return jobs;
};

export const addApplicationToCollection = async (applicationData) => {
  try {
    const applicationRef = await addDoc(collection(db, 'applications'), applicationData);
    return applicationRef.id;
  } catch (error) {
    console.error("Error adding application to collection: ", error);
    return null;
  }
};

export const addApplicationToUser = async (uid, applicationId) => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      applications: arrayUnion(applicationId)
    });
  } catch (error) {
    console.error("Error adding application to user: ", error);
  }
};

export const addApplicationToJob = async (jobId, applicationId) => {
  try {
    const jobRef = doc(db, 'jobs', jobId);
    await updateDoc(jobRef, {
      applications: arrayUnion(applicationId)
    });
  } catch (error) {
    console.error("Error adding application to job: ", error);
  }
};

export const getApplicationsByUser = async (uid) => {
  try {
    const q = query(collection(db, 'applications'), where('userId', '==', uid));
    const querySnapshot = await getDocs(q);
    const applications = [];
    querySnapshot.forEach((doc) => {
      applications.push({ id: doc.id, ...doc.data() });
    });
    return applications;
  } catch (error) {
    console.error("Error fetching applications by user: ", error);
    return [];
  }
};


export const getApplicationsByJob = async (jobId) => {
  try {
      const applicationsRef = db.collection('applications').where('jobId', '==', jobId);
      const snapshot = await applicationsRef.get();
      const applications = [];

      snapshot.forEach((doc) => {
          const applicationData = doc.data();
          applications.push({
              id: doc.id,
              qualification: applicationData.qualification,
              resume: applicationData.resume,
              email: applicationData.email,
              appliedAt: applicationData.appliedAt,
          });
      });

      return applications;
  } catch (error) {
      console.error('Error fetching applications by job:', error);
      throw new Error('Failed to fetch applications');
  }
};

export const saveFilePathToFirestore = async (userId, fileUrl) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      throw new Error('User document does not exist.');
    }
    const userData = userDoc.data();
    const userDetails = userData.userDetails || [];
    const updatedUserDetails = userDetails.map(detail => ({
      ...detail,
      resume: fileUrl
    }));
    await setDoc(userRef, { userDetails: updatedUserDetails }, { merge: true });

    console.log('File path saved successfully to Firestore.');
  } catch (error) {
    console.error('Error saving file path to Firestore:', error);
    throw error;
  }
};
