import React from "react";
import { MdOutlineCancel } from "react-icons/md";
import { useNavigate, Link } from "react-router-dom";
import { Button } from ".";
import { userProfileData } from "../data/dummy";
import { useStateContext } from "../contexts/ContextProvider";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { motion } from "framer-motion";
import { FaUser } from "react-icons/fa";
import { framerNavbarCards, mobileFramerNavbarCards } from "./framer";
const UserProfile = ({ screenWidth }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { currentColor, setIsClicked } = useStateContext();
  const handleCloseModal = () => {
    // Call setIsClicked to close the modal
    setIsClicked(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  return (
    <motion.div
      {...(screenWidth <= 425 ? mobileFramerNavbarCards : framerNavbarCards)}
      className="nav-item absolute right-1 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg shadow-2xl w-70 md:w-96"
    >
      <div className="flex justify-between items-center">
        <p className="font-semibold text-lg dark:text-gray-200">User Profile</p>
        <Button
          icon={<MdOutlineCancel />}
          color="rgb(153, 171, 180)"
          bgHoverColor="light-gray"
          size="2xl"
          borderRadius="50%"
          onClick={handleCloseModal}
        />
      </div>
      <div className="flex gap-5 items-center mt-6 border-color border-b-1 pb-6">
        {userInfo.photoURL != "" ? (
          <img
            className="rounded-full w-12 h-12 md:h-24 md:w-24"
            src={userInfo.photoURL}
            alt="user-profile"
          />
        ) : (
          <FaUser className="rounded-full w-12 h-12 md:h-24 md:w-24" />
        )}
        <div>
          <p className="font-semibold text-sm md:text-xl dark:text-gray-200">
            {userInfo?.name ? userInfo?.name : "User"}
          </p>
          <p className="text-gray-500 text-sm dark:text-gray-400">
            {userInfo?.isManager === "true" ? "Project Manager" : "Developer"}
          </p>
          <p className="text-gray-500 text-sm font-semibold dark:text-gray-400">
            {userInfo?.email && userInfo?.email}
          </p>
        </div>
      </div>
      <div>
        {userProfileData.map((item, index) => (
          <div
            key={index}
            className="flex gap-5 border-b-1 border-color p-4 hover:bg-light-gray cursor-pointer  dark:hover:bg-[#42464D]"
          >
            {item.title === "My Profile" ? (
              <Link
                to="/update-picture"
                type="button"
                style={{ color: item.iconColor, backgroundColor: item.iconBg }}
                className=" text-sm md:text-xl rounded-lg p-3 hover:bg-light-gray"
                onClick={() => setIsClicked(false)}
              >
                {item.icon}
              </Link>
            ) : (
              <Link
                to="/thread"
                type="button"
                style={{ color: item.iconColor, backgroundColor: item.iconBg }}
                className=" text-sm md:text-xl rounded-lg p-3 hover:bg-light-gray"
                onClick={() => setIsClicked(false)}
              >
                {item.icon}
              </Link>
            )}

            <div>
              <p className="font-semibold text-sm md:text-md dark:text-gray-200 ">
                {item.title}
              </p>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5">
        <Button
          color="white"
          bgColor={currentColor}
          text="Logout"
          borderRadius="9999px"
          width="full"
          onClick={handleLogout}
        />
      </div>
    </motion.div>
  );
};

export default UserProfile;
