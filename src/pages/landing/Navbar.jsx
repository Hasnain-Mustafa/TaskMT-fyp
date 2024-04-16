import React, { useState } from 'react';
import Logo from '../../data/CoLab-Logo.png';
import LoginModal from './LoginModal';

const Navbar = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const openLogin = () => {
    setIsLoginOpen(true);
  };

  const closeLogin = () => {
    setIsLoginOpen(false);
  };

  return (
    <nav className="flex justify-between items-center mx-40">
      <img src={Logo} alt="" />
      <div className="flex gap-4">
        <button
          className="px-4 py-2 bg-black text-white font-medium rounded-lg hover:bg-Hover"
          onClick={openLogin}
        >
          Log In
        </button>
        {isLoginOpen && <LoginModal closeModalFn={closeLogin} />}
      </div>
    </nav>
  );
};

export default Navbar;