import React, { useEffect } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { Button } from ".";
import { useStateContext } from "../contexts/ContextProvider";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import { useSelector, useDispatch } from "react-redux";
import { deleteChats } from "../features/auth/authActions";
import { setChats } from "../features/auth/authSlice";
import { useGetChatsQuery } from "../app/services/auth/authService";
import { motion } from "framer-motion";
import { framerNavbarCards, mobileFramerNavbarCards } from "./framer";

const Chat = ({ screenWidth }) => {
  const { currentColor, setIsClicked } = useStateContext();
  const navigate = useNavigate(); // useNavigate hook for navigation
  const { userInfo } = useSelector((state) => state.auth);
  const { chats } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const handleSeeAllMessages = () => {
    // Redirect to /thread route
    navigate("/thread");
  };

  const handleCloseModal = () => {
    if (chats.length > 0) {
      dispatch(deleteChats({ userId: userInfo.id }));
    }
    // Call setIsClicked to close the modal
    setIsClicked(false);
  };
  const { data, isFetching } = useGetChatsQuery(
    { userId: userInfo.id },
    {
      refetchOnMountOrArgChange: true,
      skip: false,
      selectFromResult: (data) => data,
    }
  );

  useEffect(() => {
    if (data) {
      const filteredChats = data.getChats.filter(
        (chat) => chat.sender !== userInfo.email
      );
      dispatch(setChats(filteredChats));
    }
  }, [data, dispatch, userInfo.email]);
  return (
    <motion.div
      {...(screenWidth <= 425 ? mobileFramerNavbarCards : framerNavbarCards)}
      className="nav-item absolute right-0 md:right-52 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg shadow-2xl w-80 md:w-96"
    >
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <p className="font-semibold text-lg dark:text-gray-200">Messages</p>
          <button
            type="button"
            className="text-white text-xs rounded p-1 px-2 bg-orange"
          >
            5 New
          </button>
        </div>
        <Button
          icon={<MdOutlineCancel />}
          color="rgb(153, 171, 180)"
          bgHoverColor="light-gray"
          size="2xl"
          borderRadius="50%"
          onClick={handleCloseModal} // Add onClick handler here
        />
      </div>
      <div className=" mt-5 h-[10rem] overflow-y-auto">
        {chats?.map((item) => (
          <div
            key={item.id} // Assuming `item.id` is a unique identifier from your data
            className="flex items-center gap-5 border-b border-color p-3 leading-8 cursor-pointer"
          >
            <div className="relative">
              {userInfo.photoURL !== "" ? (
                <img
                  className="rounded-full h-10 w-10"
                  src={item.image}
                  alt={item.message}
                />
              ) : (
                <FaUser className="rounded-full w-10 h-10" />
              )}
              <span
                style={{ background: item.dotColor }}
                className="absolute inline-flex rounded-full h-2 w-2 right-0 -top-1"
              />
            </div>
            <div>
              <p className="font-semibold dark:text-gray-200">{item.message}</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {item.desc}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">
                {item.time}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5">
        <Button
          color="white"
          bgColor={currentColor}
          text="See all messages"
          borderRadius="9999px"
          width="full"
          onClick={handleSeeAllMessages}
        />
      </div>
    </motion.div>
  );
};

export default Chat;
