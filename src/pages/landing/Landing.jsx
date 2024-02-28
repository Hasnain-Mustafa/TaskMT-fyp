import React, { useState } from 'react';
import Logo from '../../data/CoLab-Logo.png';
import HeroImg from '../../data/Hero1.svg';
import Hero from './Hero'; // Import your Hero component
import Navbar from './Navbar'; // Import your Navbar component
import SignUpModal from './SignUpModal'; // Import your SignUpModal component
import LoginModal from './LoginModal'; // Import your LoginModal component

function Landing({onAuth}) {

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setisSignUpOpen] = useState(false);

  const openLogin = () => {
    setIsLoginOpen(true);
  };

  const closeLogin = () => {
    setIsLoginOpen(false);
  };
  
  const openSignUp = () => {
    setisSignUpOpen(true);
  };

  const closeSignUp = () => {
    setisSignUpOpen(false);
  };


  return (
    
    <div className=" mx-auto"> {/* Centering the main div */}
     
        <header className="mt-8 ">
        <nav className="flex justify-between items-center mx-40">
      <img src={Logo} alt="" />
      <div className="flex gap-4">
        <button
          className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primaryhover"
          onClick={openLogin}
        >
          Log In
        </button>
        {isLoginOpen && <LoginModal onAuth={onAuth} closeModalFn={closeLogin} />}
      </div>
    </nav>
    <section className="mt-[3.4rem] flex justify-center">
        <div className="flex flex-col gap-40 md:items-center justify-between md:flex-row">
          <div className="flex flex-col items-start "> {/* Adjusted space-y */}
            <h1 className="text-4xl font-semibold mb-4">
              Task Management <br /> & Collaboration <br /> Made Easy
            </h1>
            <p className="text-md mb-8">
              Organize your work, boost productivity,
              <br /> and stay on top of your tasks.
            </p>
            <button
              className="mt-5 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primaryhover"
              onClick={openSignUp}
            >
              Get Started
            </button>
            {isSignUpOpen && <SignUpModal closeSignUpFn={closeSignUp} />}
          </div>
          <img className="h-[27rem] w-[27rem] ml-4" src={HeroImg} alt="" /> {/* Adjusted margin */}
        </div>
      </section>
    
        </header>
     
    </div>
  );
}

export default Landing;