import Logo from 'assets/CoLab-Logo.png';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import LoginModal from './LoginModal';

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <nav className="flex justify-between items-center">
      <img src={Logo} alt="" />
      <div className="flex gap-4">
        <button
          className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primaryhover"
          onClick={openModal}
        >
          Log In
        </button>
        {isModalOpen && <LoginModal closeModalFn={closeModal} />};
      </div>
    </nav>
  );
};
export default Navbar;
