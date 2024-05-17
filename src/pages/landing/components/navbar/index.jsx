import Logo from "./nav-logo.png";
import { AnimatePresence, motion } from "framer-motion";
import LoginModal from "../../LoginModal";
import SignUpModal from "../../SignUpModal";

export const Navbar = ({
  openLoginFn,
  openSignUpFn,
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
    <nav className=" absolute top-0 left-0 right-0 flex justify-between p-5 m-auto md:justify-start lg:justify-between ">
      <img
        src={Logo}
        alt="TasMT Logo"
        className="w-[180px] h-[55px] mdmt-[-8px]"
      />
      <div className="flex gap-4">
        <motion.button
          type="button"
          variants={buttonVariants}
          initial="hidden"
          whileInView="visible"
          whileHover="whileHover"
          whileTap="whileTap"
          viewport={{
            once: true,
          }}
          className="bg-black hover:bg-Hover text-white text-sm font-bold py-2 px-4 h-[2.813rem] w-[6.25rem] rounded-full transition duration-300 ease-in-out"
          onClick={openSignUpFn}
        >
          Sign Up
        </motion.button>
        <motion.button
          type="button"
          variants={buttonVariants}
          initial="hidden"
          whileInView="visible"
          whileHover="whileHover"
          whileTap="whileTap"
          viewport={{
            once: true,
          }}
          className="bg-black hover:bg-Hover text-white text-sm font-bold py-2 px-4 h-[2.813rem] w-[6.25rem] rounded-full transition duration-300 ease-in-out"
          onClick={openLoginFn}
        >
          Log In
        </motion.button>
      </div>
      <AnimatePresence initial={false}>
        {isSignUpOpen && <SignUpModal closeSignUpFn={closeSignUpFn} />}
        {isLoginOpen && <LoginModal closeLoginFn={closeLoginFn} />}
      </AnimatePresence>
    </nav>
  );
};
