import React, { useEffect, useState } from 'react';
import { AiOutlineMenu, AiOutlineArrowLeft } from 'react-icons/ai';
import { FiShoppingCart } from 'react-icons/fi';
import { BsChatLeft } from 'react-icons/bs';
import { RiNotification3Line } from 'react-icons/ri';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { useStateContext } from '../contexts/ContextProvider';
import { useLazyQuery } from "@apollo/client";
import { GET_CURRENT_USER } from '../GraphQL/Queries';
import { Cart, Chat, Notification, UserProfile } from '.';
import avatar from '../data/avatar.jpg';
import { MdOutlineMissedVideoCall } from "react-icons/md";
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
  <TooltipComponent content={title} position="BottomCenter">
    <button
      type="button"
      onClick={customFunc}
      style={{ color }}
      className="relative text-xl rounded-full p-3 hover:bg-light-gray"
    >
      <span
        style={{ background: dotColor }}
        className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
      />
      {icon}
    </button>
  </TooltipComponent>
);

const Navbar = (props) => {
  const { currentColor, activeMenu, setActiveMenu, handleClick, isClicked, setScreenSize, screenSize } = useStateContext();
  const { isThreadPage } = props;
  const [current, setCurrent] = useState(null);

  const [displayBackButton, setDisplayBackButton] = useState(isThreadPage);

  const [
    getCurrentUser,
    { data : userData, loading, error }
  ] = useLazyQuery(GET_CURRENT_USER);

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setActiveMenu(screenSize > 900);
    getCurrentUser();
    if(userData && userData.getCurrentLoggedInUser){
      const res = userData.getCurrentLoggedInUser;
      setCurrent(res);
      console.log(res);
    }
  }, [screenSize, userData]);

  useEffect(() => {
    setDisplayBackButton(isThreadPage);
  }, [isThreadPage]);

  const handleActiveMenu = () => setActiveMenu(!activeMenu);

  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleBackButtonClick = () => {
    window.history.back();
    setDisplayBackButton(false);
  };

  // Define the handleClick function to handle the click event for the video icon
  const handleVideoClick = () => {
    navigate('/prejoin'); // Redirect the user to the URL '/prejoin'
  };

  return (
    <div className="flex justify-between p-2 md:ml-6 md:mr-6 relative">
      {displayBackButton ? (
        <NavButton title="Back" customFunc={handleBackButtonClick} color={currentColor} icon={<AiOutlineArrowLeft />} />
      ) : (
        <NavButton title="Menu" customFunc={handleActiveMenu} color={currentColor} icon={<AiOutlineMenu />} />
      )}

      <div className="flex">
        <NavButton title="Video-Call" customFunc={handleVideoClick} color={currentColor} icon={<MdOutlineMissedVideoCall />} />
       
        <NavButton title="Cart" customFunc={() => handleClick('cart')} color={currentColor} icon={<FiShoppingCart />} />
        <NavButton title="Chat" dotColor="#03C9D7" customFunc={() => handleClick('chat')} color={currentColor} icon={<BsChatLeft />} />
        <NavButton title="Notification" dotColor="rgb(254, 201, 15)" customFunc={() => handleClick('notification')} color={currentColor} icon={<RiNotification3Line />} />
        <TooltipComponent content="Profile" position="BottomCenter">
          <div className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg" onClick={() => handleClick('userProfile')}>
            <img className="rounded-full w-8 h-8" src={avatar} alt="user-profile" />
            <p>
              <span className="text-gray-400 text-14">Hi,</span>
              <span className="text-gray-400 font-bold ml-1 text-14">{current?.name ? current.name : 'User'}</span>
            </p>
            <MdKeyboardArrowDown className="text-gray-400 text-14" />
          </div>
        </TooltipComponent>

        {isClicked.cart && (<Cart />)}
        {isClicked.chat && (<Chat  />)}
        {isClicked.notification && (<Notification  />)}
       
        {isClicked.userProfile && (<UserProfile user={current}/>)}
      </div>
    </div>
  );
};

export default Navbar;
