import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import { addJobToCollection, addJobToUser } from '../utils/firestore';
import { Navigate, useNavigate } from 'react-router-dom';

const PostJob = () => {
    const { user } = useAuth0();
    const [title, setTitle] = useState('');
    const [skills, setSkills] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !skills || !description || !location) {
            setError('All fields are required');
            return;
        }
        setError('');

        const jobData = {
            title,
            skills: skills.split(',').map(skill => skill.trim()), // Convert comma-separated string to array
            description,
            location,
            postedBy: user.sub, // Add the UID of the user who posted the job
            postedAt: new Date() // Add a timestamp
        };

        try {
            // Store the job in the jobs collection
            const jobId = await addJobToCollection(jobData);
            
            // Add the job to the user's document under an array named "jobs"
            await addJobToUser(user.sub, jobId);

            // Reset form fields
            setTitle('');
            setSkills('');
            setDescription('');
            setLocation('');

            alert('Job posted successfully');
            navigate('/');
        } catch (error) {
            console.error('Error posting job:', error);
            setError('Failed to post job');
        }
    };

    return (
        <Box p={3}>
            <Typography variant="h4" mb={2} mt={5}>Post a Job</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Job Title"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <TextField
                    label="Skillset (comma separated)"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                />
                <TextField
                    label="Job Description"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <TextField
                    label="Location"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
                {error && <Typography color="error">{error}</Typography>}
                <Button variant="contained" color="primary" type="submit" fullWidth>
                    Submit
                </Button>
            </form>
        </Box>
    );
};

export default PostJob;
