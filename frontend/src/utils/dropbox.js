import { Dropbox } from 'dropbox';

// Example implementation of uploadFileToDropbox
export const uploadFileToDropbox = async (file) => {
    const dropboxAccessToken = 'sl.B6wBRN4PVCj8n3xVVBnswu3Hq9sU-os2fIHVykDZMjRO8v-qSzjyh6OQYDroNWAXFA5FdStM1DN1hMR00ak3BfSnV7QpmrHYV8fem1zA2dmCZaxN9Ler1PS8twqO1frgJmCTubrTDWgF';
    const dropboxUploadUrl = 'https://content.dropboxapi.com/2/files/upload';
    const dropboxFileUrl = 'https://api.dropboxapi.com/2/files/get_temporary_link';

    try {
        // Upload the file
        const uploadResponse = await fetch(dropboxUploadUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${dropboxAccessToken}`,
                'Content-Type': 'application/octet-stream',
                'Dropbox-API-Arg': JSON.stringify({
                    path: `/${file.name}`,
                    mode: 'add',
                    autorename: true,
                    mute: false
                })
            },
            body: file
        });

        if (!uploadResponse.ok) {
            throw new Error('Failed to upload file to Dropbox');
        }

        const uploadResult = await uploadResponse.json();

        // Get the temporary link to the uploaded file
        const linkResponse = await fetch(dropboxFileUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${dropboxAccessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                path: uploadResult.path_display
            })
        });

        if (!linkResponse.ok) {
            throw new Error('Failed to get file link from Dropbox');
        }

        const linkResult = await linkResponse.json();
        return linkResult.link; // Return the file URL as a string

    } catch (error) {
        console.error('Error uploading file to Dropbox:', error);
        throw error;
    }
};
