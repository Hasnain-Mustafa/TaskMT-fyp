import { AnimatePresence, delay, motion } from "framer-motion";
import React, { useState } from "react";
import SignUpModal from "../../SignUpModal";
import LoginModal from "../../LoginModal";

export const CallToAction = ({
  openLogin,
  openSignUp,
  isLoginOpen,
  isSignUpOpen,
  closeLoginFn,
  closeSignUpFn,
}) => {
  const buttonVariants = {
    hidden: { scale: 0.7 },
    visible: {
      scale: 1,
      transition: {
        delay: 0.01,
        duration: 0.5,
        type: "spring",
        damping: 25,
        stiffness: 500,
      },
    },
    whileHover: {
      scale: 1.1,
      transition: { duration: 0.01, delay: 0.01 },
    },
    whileTap: {
      scale: 0.8,
      transition: { duration: 0.01, delay: 0.01 },
    },
  };

  return (
    <>
      <section className="container h-[50vh] mx-auto space-y-10 bg-no-repeat bg-contain bg-bg-footer-squiggle">
        <h2 className="text-3xl font-bold text-center">
          Sign Up or Log In to Get Started
        </h2>
        <div className="flex justify-center gap-4">
          <motion.button
            variants={buttonVariants}
            initial="hidden"
            whileInView="visible"
            whileHover="whileHover"
            whileTap="whileTap"
            viewport={{
              once: true,
            }}
            className="bg-primary hover:bg-primaryHover text-white text-sm font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out"
            onClick={openSignUp}
          >
            Sign Up
          </motion.button>
          <motion.button
            variants={buttonVariants}
            initial="hidden"
            whileInView="visible"
            whileHover="whileHover"
            whileTap="whileTap"
            viewport={{
              once: true,
            }}
            className="bg-primary hover:bg-primaryHover text-white text-sm font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out"
            onClick={openLogin}
          >
            Log In
          </motion.button>
        </div>
      </section>
      <AnimatePresence initial={false}>
        {isSignUpOpen && <SignUpModal closeSignUpFn={closeSignUpFn} />}
        {isLoginOpen && <LoginModal closeLoginFn={closeLoginFn} />}
      </AnimatePresence>
    </>
  );
};
