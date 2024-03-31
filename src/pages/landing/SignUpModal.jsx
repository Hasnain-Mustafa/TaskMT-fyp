import React, { useState , useEffect} from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux'
import Error from '../../components/Error'
import Spinner from '../../components/Spinner'
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useNavigate } from 'react-router-dom'

import { registerUser } from '../../features/auth/authActions'
const SignUpModal = ({closeSignUpFn}) => {
  const { loading, userInfo, error: err, success } = useSelector(
    (state) => state.auth
  )
  const dispatch = useDispatch()
  const signUpSchema = z
    .object({
      email: z.string().email(),
      name: z.string(),
      password: z
        .string({ required_error: 'Password is required' })
        .min(8, { message: 'Password must be at least 8 characters long' })
        .max(20, { message: 'Password cannot be more than 20 characters long' }),
      confirmPassword: z
        .string()
        .min(8, { message: 'Confirmation Password must also be at least 8 characters long' })
        .max(20, { message: 'Confrim Password cannot be more than 20 characters long' }),
    })
    .refine((values) => values.password === values.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(signUpSchema)
  });

  const [isProjectManager, setIsProjectManager] = useState(false);

  
  const navigate = useNavigate()

  useEffect(() => {
    // redirect user to login page if registration was successful
    if (success) navigate('/login')
    // redirect authenticated user to profile screen
    if (userInfo) navigate('/')
  }, [navigate, userInfo, success])
    
  const submitData = async (data) => {
    try {
     
      dispatch(registerUser({
        email: data.email,
        name: data.name,
        password: data.password,
        isManager: isProjectManager
      }))
     

    // Handle success (redirect, show success message, etc.)
  } catch (error) {
    console.error('Error signing up:', error);
    // Handle error (show error message, allow user to retry, etc.)
  }
}


  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-80 flex items-center justify-center">
      <form
        onSubmit={handleSubmit(submitData)}
        className="rounded-lg border bg-card text-card-foreground shadow-sm max-w-md mx-auto bg-white relative"
      >
          {err && <Error>{err}</Error>}
          <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          onClick={closeSignUpFn}
        >
          <MdCancel size={24} />
        </button>
        <div className="flex flex-col space-y-1.5 p-4">
          <h3 className="font-semibold tracking-tight text-2xl text-center">Sign Up</h3>
          <p className="text-sm text-muted-foreground text-center">Please enter your information to create an account.</p>
        </div>
        <div className="p-4 space-y-2">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium leading-none">Email</label>
            <input
              {...register('email')}
              id="email"
              className="flex h-10 w-full rounded-md border border-input bg-background outline outline-2 outline-gray-500 px-3 py-2 text-sm"
              placeholder="Enter your email"
              type="text"
            />
            {errors.email && (
              <span className="tex-red-500 text-md">{errors.email.message}</span>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium leading-none">Name</label>
            <input
              {...register('name')}
              id="name"
              className="flex h-10 w-full rounded-md border border-input bg-background outline outline-2 outline-gray-500 px-3 py-2 text-sm"
              placeholder="Enter your name"
              type="text"
            />
            {errors.name && (
              <span className="tex-red-500 text-md">{errors.name.message}</span>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium leading-none">Password</label>
            <input
              {...register('password')}
              id="password"
              className="flex h-10 w-full rounded-md border border-input bg-background outline outline-2 outline-gray-500 px-3 py-2 text-sm"
              placeholder="Password"
              type="password"
            />
            {errors.password && (
              <span className="text-red-500 ">{errors.password.message}</span>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium leading-none">Confirm Password</label>
            <input
              {...register('confirmPassword')}
              id="confirm-password"
              className="flex h-10 w-full rounded-md border border-input bg-background outline outline-2 outline-gray-500 px-3 py-2 text-sm"
              placeholder="Confirm Password"
              type="password"
            />
            {errors.confirmPassword && (
              <span className="text-red-500 text-md">{errors.confirmPassword.message}</span>
            )}
          </div>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isProjectManager}
                onChange={(e) => setIsProjectManager(e.target.checked)}
                className="h-5 w-5 text-primary border-primary rounded focus:ring-primary"
              />
              <span className="ml-2 text-sm font-medium">Sign up as Project Manager</span>
            </label>
          </div>
        </div>
        <div className="items-center p-4 flex flex-col space-y-4">
          <button
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-white hover:bg-primaryHover h-10 px-4 py-2 w-full"
            type="submit"
            disabled={loading}
          >
            
            {loading ? <Spinner /> : 'Sign Up'}
          </button>
          <div className="flex flex-col space-y-2">
            <button className="rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-[#444] h-10 px-4 py-2 w-full flex items-center justify-center bg-[#333] text-white">
              Sign Up with GitHub
            </button>
            <button className="rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-[#5693f4] h-10 px-4 py-2 w-full flex items-center justify-center bg-[#4285F4] text-white">
              Sign Up with Google
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignUpModal; 