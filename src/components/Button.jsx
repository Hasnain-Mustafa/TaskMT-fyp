import React from 'react';
import { useStateContext } from '../contexts/ContextProvider';
import { MdOutlineCancel } from 'react-icons/md';
const Button = ({ icon, bgColor, color, bgHoverColor, size, text, borderRadius, width, onClick }) => {
  // Extract setIsClicked from context if needed
  const { setIsClicked, initialState } = useStateContext();

  const handleClick = () => {
   
      onClick();
      setIsClicked(initialState);
    
    
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      style={{ backgroundColor: bgColor, color, borderRadius }}
      // Use template literals for dynamic class names
      className={`text-${size} p-3 w-${width} hover:drop-shadow-xl bg-${bgHoverColor}`}
    >
      {icon} {text}
    </button>
  );
};

export default Button;
