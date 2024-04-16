import React, { useEffect } from 'react';
import { setCredentials  } from '../../features/auth/authSlice'
import {  useGetCurrentLoggedInUserQuery } from "../../app/services/auth/authService"
import { useDispatch } from 'react-redux'
const Nav = () => {
  const dispatch = useDispatch()
  const { data} = useGetCurrentLoggedInUserQuery('GetCurrentLoggedInUser', {
    pollingInterval: 900000, 
  });

  useEffect(() => {
    console.log(data)
    if (data) dispatch(setCredentials(data?.getCurrentLoggedInUser))
  }, [data, dispatch])

  

  return (
    <nav >
      
    </nav>
  );
};

export default Nav;