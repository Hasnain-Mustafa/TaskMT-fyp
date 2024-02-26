import HeroImg from '../../data/Hero1.svg';
import SignUpModal from './SignUpModal';
import { useState } from 'react';

const Hero = () => {
  const [isSignUpOpen, setisSignUpOpen] = useState(false);

  const openSignUp = () => {
    setisSignUpOpen(true);
  };

  const closeSignUp = () => {
    setisSignUpOpen(false);
  };
  return (
  
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
    );
};
export default Hero;
