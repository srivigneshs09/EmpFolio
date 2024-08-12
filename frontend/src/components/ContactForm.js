import React from 'react';

const ContactForm = () => {
    return (
        <div className="bg-white shadow-lg rounded-lg p-8 m-8 w-11/12 lg:w-3/4">
            <h2 className="text-3xl font-semibold mb-4">Contact Us</h2>
            <form action="https://api.web3forms.com/submit" method="POST" className="flex flex-col gap-4">
                <input type="hidden" name="access_key" value="ce622e32-b059-4faf-a996-f018ba191e47" />
                <input
                    type="text"
                    name="Name"
                    placeholder="Your Name"
                    required
                    className="p-3 border border-gray-300 rounded-lg"
                />
                <input
                    type="email"
                    name="Email"
                    placeholder="Your Email"
                    required
                    className="p-3 border border-gray-300 rounded-lg"
                />
                <textarea
                    name="Message"
                    rows="6"
                    placeholder="Your Message"
                    className="p-3 border border-gray-300 rounded-lg"
                ></textarea>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default ContactForm;
