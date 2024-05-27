import React from "react";
import { useStateContext } from "../contexts/ContextProvider";
import { motion } from "framer-motion";
import { framerButtonVariants } from "./framer";

const Button = ({
  icon,
  bgColor,
  color,
  bgHoverColor,
  size,
  text,
  borderRadius,
  width,
  onClick,
}) => {
  // Extract setIsClicked from context if needed
  const { setIsClicked, initialState } = useStateContext();

  const handleClick = () => {
    onClick();
    setIsClicked(initialState);
  };

  return (
    <motion.button
      {...framerButtonVariants}
      type="button"
      onClick={handleClick}
      style={{ backgroundColor: bgColor, color, borderRadius }}
      // Use template literals for dynamic class names
      className={`text-${size} p-3 w-${width} hover:drop-shadow-xl bg-${bgHoverColor}`}
    >
      {icon} {text}
    </motion.button>
  );
};

export default Button;
