import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, TextField, Button, Typography, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

const API_URL = 'http://localhost:5000/api';

const UserForm = ({ userType, uid ,onFormSubmit}) => {
    const [resume, setResume] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        email: '',
        age: '',
        gender: '',
        degree: '',
        companyName: '',
        profession: ''
    });
    const [errors, setErrors] = useState({});

    // Debugging: Log uid
    useEffect(() => {
        console.log("UID:", uid);
    }, [uid]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setResume(file);
        }
    };

    const validateForm = () => {
        let valid = true;
        let tempErrors = {};

        // Validation logic...

        setErrors(tempErrors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const dataToSend = { ...formData, userType }; // Include userType in the data
    
        try {
            const response = await axios.post(
                `http://localhost:5000/api/users/${encodeURIComponent(uid)}/userdetails`,
                dataToSend,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            
            console.log('Form submitted', response.data);
            alert('User details submitted successfully!');

            // Call the onFormSubmit prop function to close the form
            onFormSubmit();
        } catch (error) {
            console.error('Error submitting form', error.response.data);
        }
    };
    

    return (
        <Card>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Name"
                        name="name"
                        fullWidth
                        margin="normal"
                        value={formData.name}
                        onChange={handleInputChange}
                        error={!!errors.name}
                        helperText={errors.name}
                        required
                    />
                    <TextField
                        label="Email"
                        name="email"
                        fullWidth
                        margin="normal"
                        value={formData.email}
                        onChange={handleInputChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        required
                    />
                    {userType === 'jobSeeker' && (
                        <>
                            <TextField
                                label="Phone Number"
                                name="phoneNumber"
                                fullWidth
                                margin="normal"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                error={!!errors.phoneNumber}
                                helperText={errors.phoneNumber}
                                required
                            />
                            <TextField
                                label="Age"
                                name="age"
                                fullWidth
                                margin="normal"
                                value={formData.age}
                                onChange={handleInputChange}
                                error={!!errors.age}
                                helperText={errors.age}
                                required
                            />
                            <TextField
                                label="Gender"
                                name="gender"
                                fullWidth
                                margin="normal"
                                value={formData.gender}
                                onChange={handleInputChange}
                                error={!!errors.gender}
                                helperText={errors.gender}
                                required
                            />
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Degree</InputLabel>
                                <Select
                                    name="degree"
                                    value={formData.degree}
                                    onChange={handleInputChange}
                                    label="Degree"
                                    error={!!errors.degree}
                                    required
                                >
                                    <MenuItem value="High School">High School</MenuItem>
                                    <MenuItem value="Associate's Degree">Associate's Degree</MenuItem>
                                    <MenuItem value="Bachelor's Degree">Bachelor's Degree</MenuItem>
                                    <MenuItem value="Master's Degree">Master's Degree</MenuItem>
                                    <MenuItem value="Doctorate">Doctorate</MenuItem>
                                </Select>
                                {errors.degree && <Typography color="error">{errors.degree}</Typography>}
                            </FormControl>
                        </>
                    )}
                    {userType === 'recruiter' && (
                        <>
                            <TextField
                                label="Company Name"
                                name="companyName"
                                fullWidth
                                margin="normal"
                                value={formData.companyName}
                                onChange={handleInputChange}
                                error={!!errors.companyName}
                                helperText={errors.companyName}
                                required
                            />
                            <TextField
                                label="Profession"
                                name="profession"
                                fullWidth
                                margin="normal"
                                value={formData.profession}
                                onChange={handleInputChange}
                                error={!!errors.profession}
                                helperText={errors.profession}
                                required
                            />
                        </>
                    )}
                    <Button variant="contained" color="primary" type="submit" style={{ marginTop: 16 }}>
                        Submit
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default UserForm;
