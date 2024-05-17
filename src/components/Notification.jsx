import React, { useEffect } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { Button } from ".";
import { useStateContext } from "../contexts/ContextProvider";
import { setNotifications } from "../features/auth/authSlice";
import { useGetNotificationsQuery } from "../app/services/auth/authService";
import pastDue from "../data/pastDue.png";
import assignment from "../data/assignment.png";
import tomorrow from "../data/tomorrow.png";
import { deleteNotifications } from "../features/auth/authActions";
const Notification = () => {
  const { userInfo, notifications } = useSelector((state) => state.auth);
  const { currentColor, setIsClicked } = useStateContext();
  const dispatch = useDispatch();
  const handleCloseModal = () => {
    if (notifications.length > 0) {
      dispatch(deleteNotifications({ userId: userInfo.id }));
    }
    setIsClicked(false);
  };
  const { data, isFetching } = useGetNotificationsQuery(
    { userId: userInfo.id },
    {
      refetchOnMountOrArgChange: true,
      skip: false,
      selectFromResult: (data) => data,
    }
  );

  useEffect(() => {
    if (data) {
      dispatch(setNotifications(data?.getNotifications));
    }
  }, [data, dispatch]);

  return (
    <div className="nav-item absolute right-5 md:right-40 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg w-96">
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <p className="font-semibold text-lg dark:text-gray-200">
            Notifications
          </p>
          <button
            type="button"
            className="text-white text-xs rounded p-1 px-2 bg-orange-theme"
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
          onClick={handleCloseModal}
        />
      </div>
      <div className="mt-5">
        {notifications?.map((item, index) => (
          <div
            key={index}
            className="flex items-center leading-8 gap-5 border-b-1 border-color p-3"
          >
            <img
              className="rounded-full h-10 w-10"
              src={
                item.desc ===
                "Please update or complete the task as soon as possible."
                  ? pastDue
                  : item.desc ===
                    "Check the project details and start working on your tasks."
                  ? assignment
                  : item.desc === "Let’s nail it!"
                  ? tomorrow
                  : item.image
              }
              alt={item.message}
            />
            <div>
              <p className="font-semibold dark:text-gray-200">{item.message}</p>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                {item.desc}
              </p>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                {item.time}
              </p>
            </div>
          </div>
        ))}
        <div className="mt-5">
          <Button
            color="white"
            bgColor={currentColor}
            text="See all notifications"
            borderRadius="10px"
            width="full"
          />
        </div>
      </div>
    </div>
  );
};

export default Notification;
