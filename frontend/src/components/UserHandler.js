import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { saveUserToBackend } from '../utils/api';

const UserHandler = () => {
    const { user, isAuthenticated } = useAuth0();

    useEffect(() => {
        const saveUser = async () => {
            try {
                if (isAuthenticated && user) {
                    await saveUserToBackend(user);
                }
            } catch (error) {
                console.error('Error saving user to backend:', error);
                // Optionally, you can add more user feedback here (e.g., toast notifications)
            }
        };

        saveUser();
    }, [isAuthenticated, user]);

    return null;
};

export default UserHandler;
