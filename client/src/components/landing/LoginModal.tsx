import React from 'react';
import { z, ZodType } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

interface LoginModalProps {
  closeModalFn: () => void;
}

type LoginFormData = {
  email: string;
  password: string;
};

const LoginModal: React.FC<LoginModalProps> = ({ closeModalFn }) => {
  const LoginSchema: ZodType<LoginFormData> = z.object({
    email: z.string().email(),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, { message: 'Password must be at least 8 characters long' })
      .max(20, { message: 'Password cannot be more than 20 characters long' }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  const submitData = (data: LoginFormData) => {
    console.log('Form Submitted', data);
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-80 flex items-center justify-center">
      <form
        onSubmit={handleSubmit(submitData)}
        className="rounded-lg border bg-card text-card-foreground shadow-sm max-w-md mx-auto bg-white"
      >
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
            <label className="text-sm font-medium leading-none">Email</label>
            <input
              {...register('email')}
              id="email"
              className="flex h-10 w-full rounded-md border border-input bg-background outline outline-2 outline-gray-500 px-3 py-2 text-sm "
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
              {...register('password')}
              id="password"
              className="flex h-10 w-full rounded-md border border-input bg-background outline outline-2 outline-gray-500 px-3 py-2 text-sm "
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
          <button
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-white hover:bg-primaryHover h-10 px-4 py-2 w-full"
            type="submit"
          >
            Sign in
          </button>
          {/* Social login buttons */}
          <div className="flex flex-col space-y-2">
            {/* GitHub Login */}
            <button className="rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-[#444] h-10 px-4 py-2 w-full flex items-center justify-center bg-[#333] text-white">
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
                {/* GitHub SVG Path */}
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                <path d="M9 18c-4.51 2-5-2-7-2"></path>
              </svg>
              Sign in with GitHub
            </button>
            {/* Google Login */}
            <button className="rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-[#5693f4] h-10 px-4 py-2 w-full flex items-center justify-center bg-[#4285F4] text-white">
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
                {/* Google SVG Path */}
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="4"></circle>
                <line x1="21.17" x2="12" y1="8" y2="8"></line>
                <line x1="3.95" x2="8.54" y1="6.06" y2="14"></line>
                <line x1="10.88" x2="15.46" y1="21.94" y2="14"></line>
              </svg>
              Sign in with Google
            </button>
          </div>
        </div>
        <button
          className="absolute top-9 right-10 md:right-52 text-white bg-primary hover:bg-primaryHover rounded-lg py-2 px-5"
          onClick={closeModalFn}
        >
          Close
        </button>
      </form>
    </div>
  );
};

export default LoginModal;
