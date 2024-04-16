import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userLogin } from "../../features/auth/authActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdCancel } from "react-icons/md";
import Backdrop from "./Backdrop";

const LoginModal = ({ closeLoginFn }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, userInfo, error, success } = useSelector(
    (state) => state.auth
  );

  const LoginSchema = z.object({
    username: z.string().min(3).max(20),
    email: z.string().email(),
    password: z.string().min(8).max(20),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  useEffect(() => {
    if (userInfo) {
      navigate("/dashboard");
    }
  }, [navigate, userInfo]);

  const submitData = async (formData) => {
    try {
      dispatch(
        userLogin({
          email: formData.email,
          password: formData.password,
        })
      );

      await generateUserToken();
      const chatEngineUser = {
        username: formData.username,
        secret: formData.password,
        // Add any additional fields as needed (e.g., first_name, last_name, custom_json)
      };
      const response = await fetch("https://api.chatengine.io/users/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "PRIVATE-KEY": "793945c6-7d22-40ee-9fe1-952221fd4598",
        },
        body: JSON.stringify(chatEngineUser),
      });

      if (!response.ok) {
        throw new Error("Failed to create user in ChatEngine");
      }

      const responseData = await response.json(); // Parse response body as JSON
      // Log the user data returned from ChatEngine
      const res = responseData;
      onAuth({ ...res, secret: formData.password });
      console.log(user);
      // Handle success (redirect, show success message, etc.)
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
    <Backdrop onClick={closeLoginFn}>
      <motion.form
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
        onSubmit={handleSubmit(submitData)}
        onClick={(e) => e.stopPropagation()}
        className="rounded-lg border bg-card text-card-foreground shadow-sm max-w-md mx-auto bg-white relative"
      >
        <motion.button
          whileTap={{
            scale: 0.75,
            transition: { duration: 0.1, ease: "linear" },
          }}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          onClick={closeLoginFn}
        >
          <MdCancel size={24} />
        </motion.button>
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="font-semibold tracking-tight text-2xl text-center">
            Login
          </h3>
          <p className="text-sm text-muted-foreground text-center">
            Please enter your credentials or use social login.
          </p>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Username</label>
            <input
              {...register("username")}
              id="username"
              className="flex h-10 min-w-full rounded-md border border-input bg-background outline outline-2 outline-gray-500 px-3 py-2 text-sm"
              placeholder="Username"
              type="text"
            />
            {errors.username && (
              <span className="text-red-600 text-md">
                {errors.username.message}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Email</label>
            <input
              {...register("email")}
              id="email"
              className="flex h-10 min-w-full rounded-md border border-input bg-background outline outline-2 outline-gray-500 px-3 py-2 text-sm "
              placeholder="Username"
              type="email"
            />
            {errors.email && (
              <span className="text-red-600 text-md">
                {errors.email.message}
              </span>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Password</label>
            <input
              {...register("password")}
              id="password"
              className="flex h-10 min-w-full rounded-md border border-input bg-background outline outline-2 outline-gray-500 px-3 py-2 text-sm "
              placeholder="Password"
              type="password"
            />
            {errors.password && (
              <span className="text-red-600 text-md">
                {errors.password.message}
              </span>
            )}
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
              Log in
            </motion.button>
            {/* GitHub Login */}
            <motion.button
              variants={buttonVariants}
              whileHover="whileHover"
              whileTap="whileTap"
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
              Login with GitHub
            </motion.button>
            {/* Google Login */}
            <motion.button
              variants={buttonVariants}
              whileHover="whileHover"
              whileTap="whileTap"
              className="rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-[#ff2a4d]/60 h-10 px-4 py-2 w-full flex items-center justify-center bg-[#ff2a4d] text-white"
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
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="4"></circle>
                <line x1="21.17" x2="12" y1="8" y2="8"></line>
                <line x1="3.95" x2="8.54" y1="6.06" y2="14"></line>
                <line x1="10.88" x2="15.46" y1="21.94" y2="14"></line>
              </svg>
              Login with Google
            </motion.button>
          </div>
        </div>
      </motion.form>
    </Backdrop>
  );
};

export default LoginModal;
