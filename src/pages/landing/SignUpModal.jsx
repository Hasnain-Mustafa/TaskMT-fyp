import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdCancel } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Backdrop from "../../components/Backdrop";
import { motion } from "framer-motion";
import {
  registerUser,
  registerWithOAuth,
} from "../../features/auth/authActions";
import {
  auth,
  githubProvider,
  googleProvider,
} from "../../utils/firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import { toast } from "react-toastify";

const SignUpModal = ({ closeSignUpFn }) => {
  const {
    loading,
    userInfo,
    error: err,
    success,
  } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const signUpSchema = z
    .object({
      email: z.string().email(),
      name: z.string(),
      password: z
        .string({ required_error: "Password is required" })
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(20, {
          message: "Password cannot be more than 20 characters long",
        }),
      confirmPassword: z
        .string()
        .min(8, {
          message:
            "Confirmation Password must also be at least 8 characters long",
        })
        .max(20, {
          message: "Confrim Password cannot be more than 20 characters long",
        }),
    })
    .refine((values) => values.password === values.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });
  const [isProjectManager, setIsProjectManager] = useState(false);

  const OAuthSignup = (email, displayName, photoURL) => {
    const res = dispatch(
      registerWithOAuth({
        email,
        name: displayName,
        isManager: isProjectManager,
        photoURL,
      })
    );
    res.then((result) => {
      if (result && result.meta.requestStatus) {
        if (result.meta.requestStatus === "rejected") {
          toast.error(result.payload);
        } else if (result.meta.requestStatus === "fulfilled") {
          toast.success("SignUp Successful!");
          closeSignUpFn();
        }
      }
    });
  };

  const handleGoogleSignUp = async () => {
    try {
      reset();
      const result = await signInWithPopup(auth, googleProvider);
      const { email, displayName, photoURL } = result.user;
      OAuthSignup(email, displayName, photoURL);
      closeSignUpFn();
    } catch (error) {
      toast.error("Google Login Failed");
      console.error("Google sign-up error:", error);
    }
  };

  const handleGithubSignUp = async () => {
    try {
      reset();
      const result = await signInWithPopup(auth, githubProvider);
      const { email, displayName, photoURL } = result.user;
      console.log(result.user);
      OAuthSignup(email, displayName, photoURL);
      closeSignUpFn();
      // Redirect after successful sign-up
    } catch (error) {
      console.error("GitHub sign-up error:", error);
      // Handle sign-up error
    }
  };

  const submitformData = async (formData) => {
    try {
      const res = dispatch(
        registerUser({
          email: formData.email,
          name: formData.name,
          password: formData.password,
          isManager: isProjectManager,
          photoURL: "",
        })
      );
      res.then((result) => {
        if (result && result.meta.requestStatus) {
          if (result.meta.requestStatus === "rejected") {
            toast.error(result.payload);
          } else if (result.meta.requestStatus === "fulfilled") {
            toast.success("SignUp Successful!");
            closeSignUpFn();
          }
        }
      });
    } catch (error) {
      console.error("Error signing up:", error);
      // Handle error (show error message, allow user to retry, etc.)
    }
  };

  const dropIn = {
    hidden: {
      y: "-100vh",
      opacity: 0,
    },
    visible: {
      y: "0",
      opacity: 1,
      transition: {
        duration: 0.1,
        type: "spring",
        damping: 25,
        stiffness: 500,
      },
    },
    exit: {
      y: "100vh",
      opacity: 0,
    },
  };

  const buttonVariants = {
    whileHover: {
      scale: 1.05,
      transition: { duration: 0.1, ease: "linear" },
    },
    whileTap: {
      scale: 0.75,
      transition: { duration: 0.1, ease: "linear" },
    },
  };

  return (
    <Backdrop onClick={closeSignUpFn}>
      <motion.form
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
        onSubmit={handleSubmit(submitformData)}
        onClick={(e) => e.stopPropagation()}
        className="rounded-lg border bg-card text-card-foreground shadow-sm max-w-md mx-auto bg-white relative"
      >
        <motion.button
          type="button"
          whileTap={{
            scale: 0.75,
            transition: { duration: 0.1, ease: "linear" },
          }}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          onClick={closeSignUpFn}
        >
          <MdCancel size={24} />
        </motion.button>
        <div className="flex flex-col space-y-1.5 p-4">
          <h3 className="font-semibold tracking-tight text-2xl text-center">
            Sign Up
          </h3>
          <p className="text-sm text-muted-foreground text-center">
            Please enter your information to create an account.
          </p>
        </div>
        <div className="p-4 space-y-2">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium leading-none">
              Email
            </label>
            <input
              {...register("email")}
              id="email"
              className="flex h-10 min-w-full rounded-md border border-input bg-background outline outline-2 outline-gray-500 px-3 py-2 text-sm"
              placeholder="Enter your email"
              type="text"
            />
            {errors.email && (
              <span className="tex-red-500 text-md">
                {errors.email.message}
              </span>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium leading-none">
              Name
            </label>
            <input
              {...register("name")}
              id="name"
              className="flex h-10 min-w-full rounded-md border border-input bg-background outline outline-2 outline-gray-500 px-3 py-2 text-sm"
              placeholder="Enter your name"
              type="text"
            />
            {errors.name && (
              <span className="tex-red-500 text-md">{errors.name.message}</span>
            )}
          </div>
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium leading-none"
            >
              Password
            </label>
            <input
              {...register("password")}
              id="password"
              className="flex h-10 min-w-full rounded-md border border-input bg-background outline outline-2 outline-gray-500 px-3 py-2 text-sm"
              placeholder="Password"
              type="password"
            />
            {errors.password && (
              <span className="text-red-500 ">{errors.password.message}</span>
            )}
          </div>
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium leading-none"
            >
              Confirm Password
            </label>
            <input
              {...register("confirmPassword")}
              id="confirm-password"
              className="flex h-10 min-w-full rounded-md border border-input bg-background outline outline-2 outline-gray-500 px-3 py-2 text-sm"
              placeholder="Confirm Password"
              type="password"
            />
            {errors.confirmPassword && (
              <span className="text-red-500 text-md">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isProjectManager}
                onChange={(e) => setIsProjectManager(e.target.checked)}
                className="h-5 w-5 text-black border-black rounded focus:ring-black"
              />
              <span className="ml-2 text-sm font-medium">
                Sign up as Project Manager
              </span>
            </label>
          </div>
        </div>
        <div className="items-center p-6 flex flex-col space-y-4">
          <div className="flex flex-col space-y-2">
            <motion.button
              variants={buttonVariants}
              whileTap="whileTap"
              whileHover="whileHover"
              className="rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-Hover h-10 px-4 py-2 w-full"
              type="submit"
            >
              Sign Up
            </motion.button>
            <motion.button
              type="button"
              variants={buttonVariants}
              whileTap="whileTap"
              whileHover="whileHover"
              onClick={handleGithubSignUp}
              className="rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-[#444] h-10 px-4 py-2 w-full flex items-center justify-center bg-[#333] text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 mr-2"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                <path d="M9 18c-4.51 2-5-2-7-2"></path>
              </svg>
              SignUp with GitHub
            </motion.button>
            <motion.button
              type="button"
              variants={buttonVariants}
              whileTap="whileTap"
              whileHover="whileHover"
              onClick={handleGoogleSignUp}
              className="rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-[#ff2a4d]/60 h-10 px-4 py-2 w-full flex items-center justify-center bg-[#ff2a4d] text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                type="button"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 mr-2"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="4"></circle>
                <line x1="21.17" x2="12" y1="8" y2="8"></line>
                <line x1="3.95" x2="8.54" y1="6.06" y2="14"></line>
                <line x1="10.88" x2="15.46" y1="21.94" y2="14"></line>
              </svg>
              SignUp with Google
            </motion.button>
          </div>
        </div>
      </motion.form>
    </Backdrop>
  );
};

export default SignUpModal;
