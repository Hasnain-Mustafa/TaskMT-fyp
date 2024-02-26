import React, { useState } from 'react';
import Hero from './Hero'; // Import your Hero component
import Navbar from './Navbar'; // Import your Navbar component
import SignUpModal from './SignUpModal'; // Import your SignUpModal component
import LoginModal from './LoginModal'; // Import your LoginModal component

function Landing({ onAuth }) {
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openSignUpModal = () => {
    setIsSignUpModalOpen(true);
  };

  const closeSignUpModal = () => {
    setIsSignUpModalOpen(false);
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };
// Function to handle login
const handleLogin = (token) => {
  console.log('Received token:', token); // Log the received token
  // Store the JWT token in local storage
  localStorage.setItem('token', token);

  // Call the onAuth function passed from App component
  // You can replace setUser with onAuth depending on your setup
  onAuth(token);

  // Close the login modal
  closeLoginModal();
};

  return (
    
    <div className=" xs:mx-8 sm:mx-24 md:mx-21 lg:mx-24"> {/* Centering the main div */}
      <div className="xs:mx-8 sm:mx-24 md:mx-21 lg:mx-24">
        <header className="mt-8 ">
          <Navbar />
          <Hero />
        </header>
        {isSignUpModalOpen && <SignUpModal closeSignUpFn={closeSignUpModal} />}
        {isLoginModalOpen && <LoginModal onLogin={handleLogin} closeModalFn={closeLoginModal} />}
        </div>
    </div>
  );
}

export default Landing;