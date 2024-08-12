import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { getUserDetails } from '../utils/api';
import { getJobsByUser, getApplicationsByUser, getApplicationsByJob, saveFilePathToFirestore } from '../utils/firestore';
import { uploadFileToDropbox } from '../utils/dropbox';

const Profile = () => {
    const { user, isAuthenticated } = useAuth0();
    const [userDetails, setUserDetails] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [selectedJobApplications, setSelectedJobApplications] = useState([]);
    const [showApplications, setShowApplications] = useState(false);
    const [file, setFile] = useState(null);

    const handleViewApplications = async (jobId) => {
        try {
            const applications = await getApplicationsByJob(jobId);
            setSelectedJobApplications(applications);
            setShowApplications(true);
        } catch (error) {
            console.error('Failed to fetch applications for the job:', error);
        }
    };

    const handleFileUpload = async () => {
        if (file) {
            try {
                // Upload the file to Dropbox and get the file URL
                const fileUrl = await uploadFileToDropbox(file);
                alert('Resume Uploaded Successfully');
                
                // Ensure fileUrl is a string
                if (typeof fileUrl !== 'string') {
                    throw new Error('File URL must be a string.');
                }
                
                // Save the file path/URL to Firestore under the user's document
                await saveFilePathToFirestore(user.sub, fileUrl);
                
                // Retrieve the updated user details from Firestore
                const updatedDetails = await getUserDetails(user.sub);
                
                // Update the local state with the retrieved user details
                setUserDetails(updatedDetails);
            } catch (error) {
                console.error('File upload failed:', error);
            }
        } else {
            console.error('No file selected for upload.');
        }
    };

    useEffect(() => {
        if (user && isAuthenticated) {
            const fetchUserDetails = async () => {
                try {
                    const details = await getUserDetails(user.sub);
                    setUserDetails(details);

                    if (details.userType === 'recruiter') {
                        const fetchedJobs = await getJobsByUser(user.sub);
                        setJobs(fetchedJobs);
                    } else if (details.userType === 'jobSeeker') {
                        const fetchedApplications = await getApplicationsByUser(user.sub);
                        setApplications(fetchedApplications);
                    }
                } catch (error) {
                    console.error('Failed to fetch user details, jobs, or applications:', error);
                }
            };
            fetchUserDetails();
        }
    }, [user, isAuthenticated]);

    if (!isAuthenticated || !userDetails) return null;

    return (
        <article className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8 bg-gradient-to-r from-indigo-100 shadow-xl rounded-2xl mt-16">
            <div className="flex flex-col items-center text-center">
                {user?.picture && (
                    <img
                        src={user.picture}
                        alt={user?.name}
                        className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-indigo-500 mb-4 sm:mb-6"
                    />
                )}
                <h2 className="text-xl sm:text-2xl md:text-4xl font-extrabold text-gray-900 mb-2 sm:mb-4">
                    {user?.name}
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-4 sm:mb-8">
                    {user?.email}
                </p>
                {userDetails.userType === 'jobSeeker' ? (
                    <>
                        <ul className="space-y-2 sm:space-y-3 text-left">
                            <li className="text-base sm:text-lg text-gray-800">
                                <span className="font-semibold text-indigo-600">Age:</span> {userDetails.age}
                            </li>
                            <li className="text-base sm:text-lg text-gray-800">
                                <span className="font-semibold text-indigo-600">Gender:</span> {userDetails.gender}
                            </li>
                            <li className="text-base sm:text-lg text-gray-800">
                                <span className="font-semibold text-indigo-600">Degree:</span> {userDetails.degree}
                            </li>
                            <li className="text-base sm:text-lg text-gray-800">
                                <span className="font-semibold text-indigo-600">Phone Number:</span> {userDetails.phoneNumber}
                            </li>
                            {userDetails.resume && (
                                <li className="text-base sm:text-lg text-gray-800">
                                    <span className="font-semibold text-indigo-600">Resume:</span> 
                                    <a href={userDetails.resume} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Download</a>
                                </li>
                            )}
                        </ul>
                        <div className="mt-4">
                            {userDetails.resume ? (
                                <button
                                    onClick={() => alert('Edit functionality will be added here.')} // Replace with edit functionality later
                                    className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
                                >
                                    Edit Resume
                                </button>
                            ) : (
                                <>
                                    <input
                                        type="file"
                                        onChange={(e) => setFile(e.target.files[0])}
                                        className="mb-2"
                                    />
                                    <button
                                        onClick={handleFileUpload}
                                        className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
                                    >
                                        Upload Resume
                                    </button>
                                </>
                            )}
                        </div>
                        {applications.length > 0 && (
                            <div className="w-full mt-6">
                                <h3 className="text-xl sm:text-2xl font-bold mb-4">Your Applications</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                                    {applications.map(application => (
                                        <div key={application.id} className="p-4 bg-white shadow-md rounded-lg">
                                            <h4 className="text-lg sm:text-xl font-semibold text-gray-800">
                                                Job Title: {application.jobId}
                                            </h4>
                                            <p className="text-sm sm:text-base text-gray-600">Applied At: {new Date(application.appliedAt.seconds * 1000).toLocaleString()}</p>
                                            <p className="text-sm sm:text-base text-gray-600">Qualification: {application.qualification}</p>
                                            <p className="text-sm sm:text-base text-gray-600">Resume: <a href={application.resume} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Download</a></p>
                                            <p className="text-sm sm:text-base text-gray-600">Email: {application.email}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                ) : userDetails.userType === 'recruiter' ? (
                    <>
                        <div className="text-left mb-4">
                            <p className="text-base sm:text-lg text-gray-800">
                                <span className="font-semibold text-indigo-600">Name:</span> {userDetails.name}
                            </p>
                            <p className="text-base sm:text-lg text-gray-800">
                                <span className="font-semibold text-indigo-600">Profession:</span> {userDetails.profession}
                            </p>
                        </div>
                        {jobs.length > 0 && (
                            <div className="w-full mt-6">
                                <h3 className="text-xl sm:text-2xl font-bold mb-4">Posted Jobs</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                                    {jobs.map(job => (
                                        <div key={job.id} className="p-4 bg-white shadow-md rounded-lg">
                                            <h4 className="text-lg sm:text-xl font-semibold text-gray-800">
                                                {job.title}
                                            </h4>
                                            <p className="text-sm sm:text-base text-gray-600">{job.description}</p>
                                            <p className="text-sm sm:text-base text-gray-600">Location: {job.location}</p>
                                            <p className="text-sm sm:text-base text-gray-600">
                                                Skills: {job.skills.join(', ')}
                                            </p>
                                            <button
                                                onClick={() => handleViewApplications(job.id)}
                                                className="mt-4 text-indigo-600 hover:underline"
                                            >
                                                View Applications
                                            </button>
                                            {showApplications && selectedJobApplications.length > 0 && (
                                                <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-inner">
                                                    <h5 className="text-lg font-bold text-gray-700">Applications for {job.title}</h5>
                                                    <ul className="mt-2 space-y-3">
                                                        {selectedJobApplications.map(application => (
                                                            <li key={application.id} className="text-sm text-gray-600">
                                                                <p>
                                                                    <strong>Applied At:</strong> {new Date(application.appliedAt.seconds * 1000).toLocaleString()}
                                                                </p>
                                                                <p><strong>Qualification:</strong> {application.qualification}</p>
                                                                <p><strong>Email:</strong> {application.email}</p>
                                                                <p><strong>Resume:</strong> <a href={application.resume} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Download</a></p>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                ) : null}
            </div>
        </article>
    );
};

export default Profile;
