import 'livekit-react/dist/index.css'
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { Navbar, Sidebar, ThemeSettings, TabbedMenu, Button } from './components';
import {RoomPage} from './pages/RoomPage'
import {PreJoinPage} from './pages/PreJoinPage'
import { Projects, Ecommerce, Orders, AuthPage, Employees, Thread, Line, Area, Bar, Pie, Financial, ColorMapping, Pyramid, Stacked, Editor, Portfolio } from './pages';
import './App.css';
import Landing from './pages/landing/Landing';
import { useStateContext } from './contexts/ContextProvider';
import { ApolloProvider} from "@apollo/client";
import client from './ApolloClient'

const AuthenticatedRoutes = ({user}) => {
  const isThreadPage = window.location.pathname === "/thread";
  const isPreJoinPage= window.location.pathname==="/prejoin";
  // Destructuring activeMenu and themeSettings
  const { setCurrentColor, setCurrentMode, currentMode, activeMenu, currentColor, themeSettings, setThemeSettings } = useStateContext();

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
        {!isThreadPage  && activeMenu &&
          <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white ">
            <Sidebar />
          </div>
        }
        <div
          className={
            !isThreadPage  && activeMenu
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
              <Route path="/ecommerce" element={<Ecommerce />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/menu-tab" element={<TabbedMenu />} />
              <Route path="/editor" element={<Editor />} />
              <Route
                path="/thread"
                element={<Thread user={user} isThreadPage={isThreadPage} />}
              />
                <Route path="/prejoin" element={<PreJoinPage user={user} isPreJoinPage={isPreJoinPage}/>}/>
            
               <Route path="/room" element={<RoomPage />}/>
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

const App = () => {
  const { setCurrentColor, setCurrentMode, currentMode, activeMenu, currentColor, themeSettings, setThemeSettings } = useStateContext();
  const [user, setUser] = useState();


  
  useEffect(() => {
    const currentThemeColor = localStorage.getItem('colorMode');
    const currentThemeMode = localStorage.getItem('themeMode');
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
  
  }, []);
  



  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <div className={currentMode === 'Dark' ? 'dark' : ''}>
          <Routes>
            {user ? (
              <Route path="/*" element={<AuthenticatedRoutes user={user} />} />
            ) : (
              <Route path="/" element={<Landing  onAuth={(user) => setUser(user)}/>} />
            )}
          </Routes>
        </div>
      </BrowserRouter>
    </ApolloProvider>
  );
};

export default App;
