import React from 'react';

const RecruiterForm = () => {
    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recruiter Information</h2>
            <form>
                <div className="mb-4">
                    <label className="block text-gray-700">Company Name</label>
                    <input type="text" className="w-full p-2 border rounded" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Contact Person</label>
                    <input type="text" className="w-full p-2 border rounded" />
                </div>
                {/* Add more fields as needed */}
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
            </form>
        </div>
    );
};

export default RecruiterForm;
