// AuthenticatedRoutes.js

import React,{useEffect,useState} from 'react';
import 'livekit-react/dist/index.css'
import { Routes, Route,  Navigate } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { Navbar, Sidebar, ThemeSettings, TabbedMenu } from './components';
import { RoomPage } from './pages/RoomPage';
import { PreJoinPage } from './pages/PreJoinPage';
import Editor from './pages/Editor';
import { Projects,Portfolio, Ecommerce, Orders, Employees, Thread, Line, Area, Bar, Pie, Financial, ColorMapping, Pyramid, Stacked} from './pages';
import { useStateContext } from './contexts/ContextProvider';
import './App.css';



const AuthenticatedRoutes = () => {
  const isThreadPage = window.location.pathname === "/thread";

  const { activeMenu, currentColor, themeSettings, setThemeSettings } = useStateContext();

  return (
    <div className={`flex relative ${activeMenu ? 'dark:bg-main-dark-bg' : ''}`}>
      <div className="fixed right-4 bottom-4" style={{ zIndex: '1000' }}>
        <TooltipComponent content="Settings" position="Top">
          <button
            type="button"
            onClick={() => setThemeSettings(true)}
            style={{ background: currentColor, borderRadius: '50%' }}
            className="text-3xl text-white p-3 hover:drop-shadow-xl hover:bg-light-gray"
          >
            <FiSettings />
          </button>
        </TooltipComponent>
      </div>
      {!isThreadPage && activeMenu &&
        <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white ">
          <Sidebar />
        </div>
      }
      <div
        className={
          !isThreadPage && activeMenu
            ? 'dark:bg-main-dark-bg bg-main-bg min-h-screen md:ml-72 w-full'
            : ''
        }
      >
        <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ">
          <Navbar isThreadPage={isThreadPage}  />
        </div>
        <div>
          {themeSettings && (<ThemeSettings />)}
      
          <Routes>
            <Route path="/projects" element={<Projects />} />
            <Route path="/" element={<Ecommerce />} /> 
            <Route path="/dashboard" element={<Ecommerce />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/menu-tab" element={<TabbedMenu />} />
            <Route path="/editor" element={<Editor />} />
            <Route path='*' element={<Navigate to='/' replace />} />
            <Route
              path="/thread"
              element={<Thread />}
            />
            <Route path="/prejoin" element={<PreJoinPage />} />
            <Route path="/room" element={<RoomPage />} />
            <Route path="/line" element={<Line />} />
            <Route path="/area" element={<Area />} />
            <Route path="/bar" element={<Bar />} />
            <Route path="/pie" element={<Pie />} />
            <Route path="/financial" element={<Financial />} />
            <Route path="/color-mapping" element={<ColorMapping />} />
            <Route path="/pyramid" element={<Pyramid />} />
            <Route path="/stacked" element={<Stacked />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AuthenticatedRoutes;