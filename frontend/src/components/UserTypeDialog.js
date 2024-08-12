import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import UserForm from './JobSeekerForm'; // Ensure this is the correct path to your UserForm component

const UserTypeDialog = ({ open, onClose, uid, setUserTypeInNavbar }) => {
    const [userType, setUserType] = useState('');
    const [formVisible, setFormVisible] = useState(false);

    useEffect(() => {
        if (userType === 'jobSeeker' || userType === 'recruiter') {
            setFormVisible(true);
        } else {
            setFormVisible(false);
        }
    }, [userType]);

    const handleTypeChange = (event) => {
        setUserType(event.target.value);
    };

    const handleFormClose = () => {
        setFormVisible(false);
        onClose(); // Close the dialog
    };

    const handleFormSubmit = () => {
        setUserTypeInNavbar(userType); // Pass the userType back to the Navbar component
        handleFormClose(); // Close the dialog after the form is submitted
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Select User Type</DialogTitle>
            <DialogContent>
                <RadioGroup value={userType} onChange={handleTypeChange}>
                    <FormControlLabel value="jobSeeker" control={<Radio />} label="Job Seeker" />
                    <FormControlLabel value="recruiter" control={<Radio />} label="Recruiter" />
                </RadioGroup>
                {formVisible && <UserForm userType={userType} uid={uid} onFormSubmit={handleFormSubmit} />}
            </DialogContent>
        </Dialog>
    );
};

export default UserTypeDialog;
