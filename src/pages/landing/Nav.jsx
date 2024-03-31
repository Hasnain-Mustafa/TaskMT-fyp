import React, { useState, useEffect } from 'react';
import Logo from '../../data/CoLab-Logo.png';
import LoginModal from './LoginModal';
import { setCredentials  } from '../../features/auth/authSlice'
import {  useGetCurrentLoggedInUserQuery } from "../../app/services/auth/authService"
import { useDispatch } from 'react-redux'
const Nav = () => {
  const dispatch = useDispatch()
  const { data, isFetching} = useGetCurrentLoggedInUserQuery('GetCurrentLoggedInUser', {
    pollingInterval: 900000, 
  });

  useEffect(() => {
    console.log(data)
    if (data) dispatch(setCredentials(data?.getCurrentLoggedInUser))
  }, [data, dispatch])

  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const openLogin = () => {
    setIsLoginOpen(true);
  };

  const closeLogin = () => {
    setIsLoginOpen(false);
  };

  return (
    <nav className="">
      
    </nav>
  );
};

export default Nav;