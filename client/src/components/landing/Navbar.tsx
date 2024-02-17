import Logo from 'assets/CoLab-Logo.png';
import { useState } from 'react';
import LoginModal from './LoginModal';

const Navbar = () => {
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);

  const openLogin = () => {
    setIsLoginOpen(true);
  };

  const closeLogin = () => {
    setIsLoginOpen(false);
  };
  return (
    <nav className="flex justify-between items-center">
      <img src={Logo} alt="" />
      <div className="flex gap-4">
        <button
          className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primaryhover"
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
