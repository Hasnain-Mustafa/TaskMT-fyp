import React, { useEffect, useState, useRef } from "react";
import { AiOutlineMenu, AiOutlineArrowLeft } from "react-icons/ai";

import { BsChatLeft, BsCameraVideo } from "react-icons/bs";
import { RiNotification3Line } from "react-icons/ri";
import { MdKeyboardArrowDown } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { useStateContext } from "../contexts/ContextProvider";
import { Chat, Notification, UserProfile } from ".";
import avatar from "../data/avatar.jpg";
import { MdOutlineMissedVideoCall } from "react-icons/md";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import { useSelector, useDispatch } from "react-redux";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import { AnimatePresence, motion } from "framer-motion";
import { framerButtonVariants } from "./framer";

import { FaUser } from "react-icons/fa";
import {
  setChats,
  reset,
  resetNotifications,
  setNotifications,
} from "../features/auth/authSlice";
import { useGetChatsQuery } from "../app/services/auth/authService";
import { useGetNotificationsQuery } from "../app/services/auth/authService";
const NavButton = ({
  title,
  customFunc,
  icon,
  color,
  dotColor,
  chats,
  showBadge,
  notifications,
  showDot,
}) => (
  <TooltipComponent content={title} position="BottomCenter">
    <motion.button
      {...framerButtonVariants}
      type="button"
      onClick={customFunc}
      style={{ color }}
      className="relative text-xl rounded-full p-3 hover:bg-light-gray"
    >
      {console.log(notifications)}
      {
        notifications && showDot ? (
          <NotificationBadge
            count={notifications?.length}
            effect={Effect.SCALE}
          />
        ) : (
          chats &&
          showBadge && (
            <NotificationBadge count={chats?.length} effect={Effect.SCALE} />
          )
        ) // : (
        //   <span
        //     style={{ background: dotColor }}
        //     className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
        //   />
        // )
        // Render nothing if neither chats nor notifications are present
      }

      {icon}
    </motion.button>
  </TooltipComponent>
);

const Navbar = (props) => {
  const {
    currentColor,
    activeMenu,
    setActiveMenu,
    handleClick,
    isClicked,
    setScreenSize,
    screenSize,
  } = useStateContext();
  const { isThreadPage } = props;
  const { userInfo } = useSelector((state) => state.auth);
  const prevUserInfoRef = useRef();
  const { chats, showBadge, notifications, showDot } = useSelector(
    (state) => state.auth
  );
  const [displayBackButton, setDisplayBackButton] = useState(isThreadPage);
  const dispatch = useDispatch();
  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setActiveMenu(screenSize > 900);
  }, [screenSize]);

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
    navigate("/prejoin"); // Redirect the user to the URL '/prejoin'
  };
  const handleNotificationClick = () => {
    handleClick("notification");

    dispatch(resetNotifications(false));
    // Hide badge when chat is clicked
  };

  const handleChatClick = () => {
    handleClick("chat");

    dispatch(reset(false));
    // Hide badge when chat is clicked
  };
  const { data, isFetching } = useGetChatsQuery(
    { userId: userInfo.id },
    {
      refetchOnMountOrArgChange: true,
      skip: false,
      selectFromResult: (data) => data,
    }
  );
  const { data: notificationData } = useGetNotificationsQuery(
    { userId: userInfo.id },
    {
      refetchOnMountOrArgChange: true,
      skip: false,
      selectFromResult: (data) => data,
    }
  );
  useEffect(() => {
    if (notificationData) {
      dispatch(resetNotifications(true));
      dispatch(setNotifications(notificationData?.getNotifications));
    }
  }, [notificationData, dispatch]);
  useEffect(() => {
    if (data) {
      console.log(data);
      const filteredChats = data.getChats.filter(
        (chat) => chat.sender !== userInfo.email
      );
      dispatch(reset(true));
      dispatch(setChats(filteredChats));
    }
  }, [data, dispatch, userInfo.email]);
  return (
    <div className="flex justify-between sm:mb-8 md:justify-end p-2 md:ml-2 md:mr-6 relative">
      {displayBackButton ? (
        <NavButton
          title="Back"
          customFunc={handleBackButtonClick}
          color={currentColor}
          icon={<AiOutlineArrowLeft />}
        />
      ) : (
        screenSize <= 900 && (
          <NavButton
            title="Menu"
            customFunc={handleActiveMenu}
            color={currentColor}
            icon={<AiOutlineMenu />}
          />
        )
      )}

      <div className="flex">
        <NavButton
          title="Video-Call"
          customFunc={handleVideoClick}
          color={currentColor}
          icon={<MdOutlineMissedVideoCall />}
        />

        <NavButton
          title="Chat"
          dotColor="#03C9D7"
          chats={chats}
          customFunc={handleChatClick}
          color={currentColor}
          showBadge={showBadge}
          icon={<BsChatLeft />}
        />
        <NavButton
          title="Notification"
          dotColor="rgb(254, 201, 15)"
          customFunc={handleNotificationClick}
          color={currentColor}
          notifications={notifications}
          showDot={showDot}
          icon={<RiNotification3Line />}
        />
        <TooltipComponent content="Profile" position="BottomCenter">
          <div
            className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
            onClick={() => handleClick("userProfile")}
          >
            {userInfo.photoURL != "" ? (
              <img
                className="rounded-full w-8 h-8"
                src={userInfo.photoURL}
                alt="user-profile"
              />
            ) : (
              <FaUser className="rounded-full w-8 h-8" />
            )}
            <p className="hidden md:block">
              <span className="text-gray-400 text-14">Hi,</span>
              <span className="text-gray-400 font-bold ml-1 text-14">
                {userInfo.name ? userInfo.name : "User"}
              </span>
            </p>
            <MdKeyboardArrowDown className="text-gray-400 text-14" />
          </div>
        </TooltipComponent>
        <AnimatePresence>
          {isClicked.chat && <Chat screenWidth={screenSize} />}
          {isClicked.notification && <Notification screenWidth={screenSize} />}
          {isClicked.userProfile && <UserProfile screenWidth={screenSize} />}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Navbar;
