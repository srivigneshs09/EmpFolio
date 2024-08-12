import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, TextField, Button, Grid, Box, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { addApplicationToCollection, addApplicationToUser, addApplicationToJob } from '../utils/firestore';

const SearchJob = () => {
    const { user } = useAuth0(); // Access user information
    const [jobs, setJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('');
    const [open, setOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [applicantName, setApplicantName] = useState('');
    const [email, setEmail] = useState('');
    const [qualification, setQualification] = useState('');
    const [resume, setResume] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/jobs'); // Adjust API endpoint as needed
                setJobs(response.data);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            }
        };
        fetchJobs();
    }, []);

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              job.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter ? job.skills.includes(filter) : true;
        return matchesSearch && matchesFilter;
    });

    const handleApply = (job) => {
        setSelectedJob(job);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedJob(null);
        setApplicantName('');
        setEmail('');
        setQualification('');
        setResume(null);
        setError('');
    };

    const handleResumeChange = (e) => {
        setResume(e.target.files[0]);
    };

    const handleSubmitApplication = async () => {
        if (!applicantName || !email || !qualification || !resume) {
            setError('Please fill out all fields and upload your resume.');
            return;
        }
        setError('');
        setLoading(true);

        try {
            // FormData to handle file upload
            const formData = new FormData();
            formData.append('name', applicantName);
            formData.append('email', email);
            formData.append('qualification', qualification);
            formData.append('resume', resume);
            formData.append('jobId', selectedJob.id);

            // Save the application data to the applications collection
            const applicationData = {
                applicantName,
                email,
                qualification,
                resume: resume.name, // Just store the resume name or URL if you have an upload endpoint
                jobId: selectedJob.id,
                userId: user.sub, // Store the UID of the applicant
                appliedAt: new Date() // Add a timestamp
            };
            const applicationId = await addApplicationToCollection(applicationData);

            // Add the application ID to the user's document
            await addApplicationToUser(user.sub, applicationId);

            // Add the application ID to the job's document
            await addApplicationToJob(selectedJob.id, applicationId);

            alert('Application submitted successfully');
            handleClose();
        } catch (error) {
            console.error('Error submitting application:', error);
            setError('Failed to submit application');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box p={3}>
            <Typography variant="h4" mb={2} mt={5}>Job Listings</Typography>
            <TextField
                label="Search Jobs"
                variant="outlined"
                margin="normal"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <Grid container spacing={2} mt={2}>
                {filteredJobs.map((job) => (
                    <Grid item xs={12} sm={6} md={4} key={job.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{job.title}</Typography>
                                <Typography color="textSecondary">{job.skills.join(', ')}</Typography>
                                <Typography>{job.description}</Typography>
                                <Typography color="textSecondary">Location: {job.location}</Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={() => handleApply(job)}
                                    style={{ marginTop: '16px' }}
                                >
                                    Apply
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            
            {/* Application Modal */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Applicant Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        required
                    />
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        label="Qualification"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={qualification}
                        onChange={(e) => setQualification(e.target.value)}
                        required
                    />
                    <Button
                        variant="contained"
                        component="label"
                        fullWidth
                        margin="normal"
                        style={{ marginTop: '16px' }}
                    >
                        Upload Resume
                        <input
                            type="file"
                            hidden
                            accept=".pdf,.doc,.docx"
                            onChange={handleResumeChange}
                            required
                        />
                    </Button>
                    {resume && <Typography variant="body2" color="textSecondary">{resume.name}</Typography>}
                    {error && <Typography color="error">{error}</Typography>}
                    {loading && <CircularProgress />}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmitApplication} color="primary" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SearchJob;
