import React from "react";
import { motion } from "framer-motion";
import { gql } from "@apollo/client";
import client from "../ApolloClient";
import Backdrop from "../components/Backdrop";
import { framerdropIn } from "../components/framer";
import { toast } from "react-toastify";
import { MdCancel } from "react-icons/md";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const ResetPasswordModal = ({ closeResetPasswordFn, token }) => {
  const PasswordSchema = z
    .object({
      password: z.string().min(8).max(20),
      confirmPassword: z.string().min(8).max(20),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(PasswordSchema),
  });

  const handlePasswordReset = async (data) => {
    try {
      const response = await client.mutate({
        mutation: gql`
          mutation ResetPassword($token: String!, $newPassword: String!) {
            resetPassword(token: $token, newPassword: $newPassword)
          }
        `,
        variables: { token, newPassword: data.password },
      });

      toast.success("Password has been reset");
      closeResetPasswordFn();
    } catch (error) {
      toast.error("Failed to reset password");
      console.error("Password reset error", error);
    }
  };

  return (
    <Backdrop onClick={closeResetPasswordFn}>
      <motion.form
        variants={framerdropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
        onSubmit={handleSubmit(handlePasswordReset)}
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
          onClick={closeResetPasswordFn}
        >
          <MdCancel size={24} />
        </motion.button>
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="font-semibold tracking-tight text-2xl text-center">
            Reset Password
          </h3>
          <p className="text-sm text-muted-foreground text-center">
            Enter new password and secure it for future use.
          </p>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              New Password
            </label>
            <input
              type="password"
              placeholder="New Password"
              {...register("password")}
              className="flex h-10 min-w-full rounded-md border border-input bg-background outline outline-2 outline-gray-500 px-3 py-2 text-sm"
            />
            {errors.password && (
              <p className="text-red-600 text-sm">{errors.password.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Confirm New Password
            </label>
            <input
              type="password"
              placeholder="Confirm New Password"
              {...register("confirmPassword")}
              className="flex h-10 min-w-full rounded-md border border-input bg-background outline outline-2 outline-gray-500 px-3 py-2 text-sm"
            />
            {errors.confirmPassword && (
              <p className="text-red-600 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>
        <div className="items-center p-6 flex flex-col space-y-4">
          <motion.button
            variants={framerdropIn}
            whileTap="whileTap"
            whileHover="whileHover"
            className="rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-Hover h-10 px-4 py-2 w-full"
            type="submit"
          >
            Reset Password
          </motion.button>
        </div>
      </motion.form>
    </Backdrop>
  );
};

export default ResetPasswordModal;
