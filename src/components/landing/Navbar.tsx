import Logo from 'assets/CoLab-Logo.png';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center">
      <img src={Logo} alt="" />
      <div className="flex gap-4">
        {/* <button className="px-4 py-2 bg-primary text-white font-medium rounded-lg ">
          Sign Up
        </button> */}
        {/* <Link to="/login"> */}
        <button className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primaryhover">
          Log In
        </button>
        {/* </Link> */}
      </div>
    </nav>
  );
};
export default Navbar;
