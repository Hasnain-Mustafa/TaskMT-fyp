import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  AiFillCheckSquare,
  AiOutlineEdit,
  AiOutlineClose,
} from "react-icons/ai";
import Button from "./Button";
import {
  deleteGoals,
  addGoals,
  updateGoals,
} from "../features/auth/authActions";
import { MdOutlineCancel, MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import { setGoals } from "../features/auth/authSlice";
import { useGetGoalsQuery } from "../app/services/auth/authService";
import { motion } from "framer-motion";
import { framerButtonVariants } from "./framer";

const MonthlyGoalsCard = () => {
  const dispatch = useDispatch();
  const { userInfo, goals } = useSelector((state) => state.auth);

  const { data, loading } = useGetGoalsQuery(
    { userId: userInfo.id },
    {
      refetchOnMountOrArgChange: true,
      skip: false,
      selectFromResult: (data) => data,
    }
  );

  const [isEditing, setIsEditing] = useState(false);
  const [currentGoal, setCurrentGoal] = useState(null);
  const modalRef = useRef();
  const handleAddGoal = () => {
    if (currentGoal && currentGoal.text.trim() !== "") {
      dispatch(
        addGoals({
          userId: userInfo.id,
          goal: [
            {
              text: currentGoal.text,
              isCompleted: false, // Assuming new goals are not completed by default
            },
          ],
        })
      );
      setCurrentGoal(null); // Clear the current goal after adding
      setIsEditing(false);
    }
  };
  const handleDeleteGoal = (goalId) => {
    dispatch(deleteGoals({ goalId }));
  };
  const toggleGoal = (goalId) => {
    const goal = goals.find((g) => g.id === goalId);
    if (goal) {
      // Optimistically update the UI
      const updatedGoals = goals.map((g) =>
        g.id === goalId ? { ...g, isCompleted: !g.isCompleted } : g
      );
      dispatch(setGoals(updatedGoals));

      // Dispatch the update action
      dispatch(
        updateGoals({
          goalId: goal.id,
          isCompleted: !goal.isCompleted,
        })
      ).catch((error) => {
        // Revert on error
        console.error("Failed to update goal:", error);
        dispatch(setGoals(goals)); // Revert to original goals on failure
      });
    }
  };

  const toggleModal = () => {
    setIsEditing(!isEditing);
    setCurrentGoal(null);
  };
  useEffect(() => {
    if (data && !loading) {
      dispatch(setGoals(data.getGoals));
    }
  }, [data, loading]);
  // Click outside to close modal
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        toggleModal();
      }
    }
    if (isEditing) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing]);

  return (
    <div className="bg-black p-5 rounded-xl shadow-md w-[20rem] h-[13rem] relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-white">Monthly Goals:</h2>
        <AiOutlineEdit
          className="ml-2 cursor-pointer text-white"
          onClick={toggleModal}
        />
      </div>
      <div
        style={{ maxHeight: "139px", overflowY: "scroll", paddingTop: "10px" }}
      >
        {goals.map((goal) => (
          <div key={goal.id} className="flex items-center justify-between">
            <div className="flex items-center">
              <div onClick={() => toggleGoal(goal.id)}>
                {goal.isCompleted ? (
                  <AiFillCheckSquare className="text-lg text-red-500" />
                ) : (
                  <MdOutlineCheckBoxOutlineBlank className="text-lg text-white" />
                )}
              </div>
              <span
                className={`ml-2 text-white ${
                  goal.isCompleted ? "line-through" : ""
                }`}
                style={{ flexGrow: 1 }}
                onClick={() => toggleGoal(goal.id)}
              >
                {goal.text}
              </span>
            </div>
            <AiOutlineClose
              className="text-red-500 cursor-pointer"
              onClick={() => handleDeleteGoal(goal.id)}
            />
          </div>
        ))}
      </div>
      {isEditing && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 rounded-xl flex items-center justify-center p-4">
          <div
            className="bg-white p-4 rounded-lg shadow-lg max-w-xs w-full"
            ref={modalRef}
          >
            <div className="flex items-center mb-4 justify-between">
              <h3 className="text-lg font-semibold">
                {currentGoal?.id ? "Edit Goal" : "Add New Goal"}
              </h3>
              <Button
                icon={<MdOutlineCancel />}
                color="rgb(153, 171, 180)"
                bgHoverColor="light-gray"
                size="2xl"
                borderRadius="50%"
                onClick={toggleModal}
              />
            </div>
            <input
              type="text"
              value={currentGoal ? currentGoal.text : ""}
              onChange={(e) =>
                setCurrentGoal({ ...currentGoal, text: e.target.value })
              }
              className="border p-2 w-full mb-4"
              placeholder="Enter goal"
            />

            <motion.button
              {...framerButtonVariants}
              className="bg-black hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-full w-full"
              onClick={handleAddGoal}
            >
              Save
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyGoalsCard;
