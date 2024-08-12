import React from 'react';
import collaborative from '../images/collaborative-articles.jpg';
import searchpng from '../images/job-search.png';
import ContactForm from './ContactForm';
import Footer from './Footer';

const HomePage = () => {
    return (
        <div className="bg-gray-100 text-gray-900 min-h-screen flex flex-col items-center">
            <header className=" mt-12 flex flex-col items-center">
                <h1 className="text-4xl font-bold mb-4">Welcome to Your Professional Community</h1>
            </header>

            <section className="bg-white shadow-lg rounded-lg p-8 m-8 w-11/12 lg:w-3/4 flex flex-col lg:flex-row items-center lg:items-start">
                <div className="text-content lg:w-1/2 lg:pr-8">
                    <h2 className="text-3xl font-semibold mb-4">Explore Collaborative Articles</h2>
                    <p className="text-lg mb-4">We’re unlocking community knowledge in a new way. Experts add insights directly into each article, started with the help of AI.</p>
                    <div className="flex flex-wrap gap-2">
                        {['Marketing', 'Public Administration', 'Healthcare', 'Engineering', 'IT Services', 'Sustainability', 'Business Administration', 'Telecommunications', 'HR Management'].map((item, index) => (
                            <a key={index} href="#" className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm hover:bg-blue-200">{item}</a>
                        ))}
                    </div>
                </div>
                <img src={collaborative} alt="Collaborative Articles" className="lg:w-1/2 rounded-lg shadow-lg mt-4 lg:mt-0" />
            </section>

            <section className="bg-white shadow-lg rounded-lg p-8 m-8 w-11/12 lg:w-3/4 flex flex-col lg:flex-row items-center lg:items-start">
                <img src={searchpng} alt="Job Search" className="lg:w-1/2 rounded-lg shadow-lg" />
                <div className="text-content lg:w-1/2 lg:pl-8 mt-4 lg:mt-0">
                    <h2 className="text-3xl font-semibold mb-4">Find the Right Job or Internship for You</h2>
                    <h3 className="text-xl font-medium mb-2">Suggested Searches</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {['Engineering', 'Business Development', 'Finance', 'Administrative Assistant', 'Retail Associate', 'Customer Service', 'Operations', 'Information Technology', 'Marketing', 'Human Resources'].map((item, index) => (
                            <a key={index} href="#" className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm hover:bg-blue-200">{item}</a>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-white shadow-lg rounded-lg p-8 m-8 w-11/12 lg:w-3/4">
                <h2 className="text-3xl font-semibold mb-4">Discover the Best Software Tools</h2>
                <p className="text-lg mb-4">Connect with buyers who have first-hand experience to find the best products for you.</p>
                <h3 className="text-xl font-medium mb-2">Suggested Tools</h3>
                <div className="flex flex-wrap gap-2">
                    {['E-Commerce Platforms', 'CRM Software', 'Human Resources Management Systems', 'Recruiting Software', 'Sales Intelligence Software', 'Project Management Software', 'Help Desk Software', 'Social Networking Software', 'Desktop Publishing Software'].map((item, index) => (
                        <a key={index} href="#" className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm hover:bg-blue-200">{item}</a>
                    ))}
                </div>
            </section>

            <section className="bg-white shadow-lg rounded-lg p-8 m-8 w-11/12 lg:w-3/4">
                <h2 className="text-3xl font-semibold mb-4">Keep Your Mind Sharp with Games</h2>
                <div className="flex flex-wrap gap-2">
                    {['Pinpoint', 'Queens', 'Crossclimb'].map((item, index) => (
                        <a key={index} href="#" className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm hover:bg-blue-200">{item}</a>
                    ))}
                </div>
            </section>

            <section className="bg-white shadow-lg rounded-lg p-8 m-8 w-11/12 lg:w-3/4">
                <h2 className="text-3xl font-semibold mb-4">Let the Right People Know You’re Open to Work</h2>
                <p className="text-lg">With the Open To Work feature, you can privately tell recruiters or publicly share with the EmpFolio community that you are looking for new job opportunities.</p>
            </section>

            <section className="bg-white shadow-lg rounded-lg p-8 m-8 w-11/12 lg:w-3/4">
                <h2 className="text-3xl font-semibold mb-4">Conversations Today Could Lead to Opportunity Tomorrow</h2>
                <p className="text-lg">Sending messages to people you know is a great way to strengthen relationships as you take the next step in your career.</p>
            </section>

            <section className="bg-white shadow-lg rounded-lg p-8 m-8 w-11/12 lg:w-3/4">
                <h2 className="text-3xl font-semibold mb-4">Stay Up to Date on Your Industry</h2>
                <p className="text-lg">From live videos, to stories, to newsletters and more, EmpFolio is full of ways to stay up to date on the latest discussions in your industry.</p>
            </section>

            <section className="bg-white shadow-lg rounded-lg p-8 m-8 w-11/12 lg:w-3/4">
                <h2 className="text-3xl font-semibold mb-4">Connect with People Who Can Help</h2>
                <div className="flex flex-wrap gap-2">
                    {['Find people you know', 'Learn the skills you need to succeed', 'Choose a topic to learn about'].map((item, index) => (
                        <a key={index} href="#" className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm hover:bg-blue-200">{item}</a>
                    ))}
                </div>
            </section>
            <ContactForm />
            <Footer />
        </div>
    );
};

export default HomePage;
