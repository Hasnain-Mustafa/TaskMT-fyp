import React from "react";
import { motion } from "framer-motion";
import { MdCancel } from "react-icons/md";
import Backdrop from "./Backdrop";

const SimpleModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const handleModalClick = (e) => {
    e.stopPropagation(); // Prevents the modal close action when clicking inside the modal
  };

  return (
    <Backdrop onClick={onClose}>
      <motion.form
        onClick={handleModalClick}
        className="rounded-lg border bg-card text-card-foreground shadow-sm max-w-md mx-auto bg-white relative"
        initial="hidden"
        animate="visible"
        exit="exit"
        style={{
          maxHeight: "90vh",
          overflowY: "auto",
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%", // Responsive width
          maxWidth: "600px", // Maximum width
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)", // Enhanced shadow
          borderRadius: "16px", // Softened edges
        }}
      >
        <motion.button
          whileTap={{
            scale: 0.75,
            transition: { duration: 0.1, ease: "linear" },
          }}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 p-2"
          onClick={onClose}
          type="button"
          aria-label="Close"
        >
          <MdCancel size={24} />
        </motion.button>
        <div className="p-6 space-y-6">{children}</div>
      </motion.form>
    </Backdrop>
  );
};

export default SimpleModal;
