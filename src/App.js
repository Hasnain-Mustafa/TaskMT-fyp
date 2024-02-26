// import React, { useEffect, useState } from 'react';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { FiSettings } from 'react-icons/fi';
// import { TooltipComponent } from '@syncfusion/ej2-react-popups';
// import { Navbar, Sidebar, ThemeSettings, TabbedMenu } from './components';
// import { Projects, Ecommerce, Orders, AuthPage, Employees, Thread, Line, Area, Bar, Pie, Financial, ColorMapping, Pyramid, Stacked, Editor, Portfolio } from './pages';
// import './App.css';
// import Landing from './pages/landing/Landing';
// import { useStateContext } from './contexts/ContextProvider';
// // import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, from } from "@apollo/client";
// // import { onError } from "@apollo/client/link/error";

// // const errorLink = onError(({ graphqlErrors, networkError }) => {
// //   if (graphqlErrors) {
// //     graphqlErrors.map(({ message, location, path }) => {
// //       alert(`Graphql error ${message}`);
// //     });
// //   }
// // });

// // const link = from([
// //   errorLink,
// //   new HttpLink({ uri: "http://localhost:3000/graphql" }),
// // ]);

// // const client = new ApolloClient({
// //   cache: new InMemoryCache(),
// //   link: link,
// // });

// const App = () => {
//   const { setCurrentColor, setCurrentMode, currentMode, activeMenu, currentColor, themeSettings, setThemeSettings, setActiveMenu } = useStateContext();
//   const [user, setUser] = useState();

//   useEffect(() => {
//     const currentThemeColor = localStorage.getItem('colorMode');
//     const currentThemeMode = localStorage.getItem('themeMode');
//     if (currentThemeColor && currentThemeMode) {
//       setCurrentColor(currentThemeColor);
//       setCurrentMode(currentThemeMode);
//     }
//   }, []);
//   if (!user) {
//     return <AuthPage onAuth={(user) => setUser(user)} />;
//   } else {
//   return (
//     // <ApolloProvider client={client}>
//       <BrowserRouter>
//         <div className={currentMode === 'Dark' ? 'dark' : ''}>
//           <div className={`flex relative ${activeMenu ? 'dark:bg-main-dark-bg' : ''}`}>
//             <div className="fixed right-4 bottom-4" style={{ zIndex: '1000' }}>
//               <TooltipComponent
//                 content="Settings"
//                 position="Top"
//               >
//                 <button
//                   type="button"
//                   onClick={() => setThemeSettings(true)}
//                   style={{ background: currentColor, borderRadius: '50%' }}
//                   className="text-3xl text-white p-3 hover:drop-shadow-xl hover:bg-light-gray"
//                 >
//                   <FiSettings />
//                 </button>
//               </TooltipComponent>
//             </div>
//             <Routes>
//               <Route path="/" element={<Landing onAuth={(user) => setUser(user)} />} />
//               <Route path="/*" element={<AuthenticatedRoutes />} />
//             </Routes>
//           </div>
//         </div>
//       </BrowserRouter>
//     // </ApolloProvider>
//   );
// }};


//   const isThreadPage = window.location.pathname === "/thread";

//   return (
//     <div className={`flex relative ${activeMenu ? 'dark:bg-main-dark-bg' : ''}`}>
//       {!isThreadPage && activeMenu &&
//         <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white ">
//           <Sidebar/>
//         </div>
//       }
//       <div
//         className={
//           !isThreadPage && activeMenu 
//             && 'dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-72 w-full  '
//         }
//       >
//         <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ">
//           <Navbar isThreadPage={isThreadPage} user={user} />
//         </div>
//         <div>
//           {themeSettings && (<ThemeSettings />)}

//           <Routes>
//             <Route path="/projects" element={<Projects />} />
//             <Route path="/" element={<Ecommerce />} />
//             <Route path="/ecommerce" element={<Ecommerce />} />
//             <Route path="/orders" element={<Orders />} />
//             <Route path="/employees" element={<Employees />} />
//             <Route path="/portfolio" element={<Portfolio />} />
//             <Route path="/menu-tab" element={<TabbedMenu />} />
//             <Route path="/editor" element={<Editor />} />
//             <Route
//               path="/thread"
//               element={<Thread user={user} isThreadPage={isThreadPage} />}
//             />
//             <Route path="/line" element={<Line />} />
//             <Route path="/area" element={<Area />} />
//             <Route path="/bar" element={<Bar />} />
//             <Route path="/pie" element={<Pie />} />
//             <Route path="/financial" element={<Financial />} />
//             <Route path="/color-mapping" element={<ColorMapping />} />
//             <Route path="/pyramid" element={<Pyramid />} />
//             <Route path="/stacked" element={<Stacked />} />
//           </Routes>
//         </div>
//       </div>
//     </div>
//   );


// export default App;
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { Navbar, Footer, Sidebar, ThemeSettings, TabbedMenu } from './components';
import { Portfolio,Projects, Ecommerce, Orders, Calendar, AuthPage, Employees, Stacked, Pyramid, Customers, Kanban, Line, Area, Bar, Pie, Financial, Thread, ColorMapping, Editor } from './pages';
import './App.css';

import { useStateContext } from './contexts/ContextProvider';
const App = () => {
  const { setCurrentColor, setCurrentMode, currentMode, activeMenu, currentColor, themeSettings,setThemeSettings } = useStateContext();
  const [user, setUser] = useState();
  const isThreadPage = window.location.pathname === "/thread";

  useEffect(() => {
    const currentThemeColor = localStorage.getItem('colorMode');
    const currentThemeMode = localStorage.getItem('themeMode');
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
  }, []);

  if (!user) {
    return <AuthPage onAuth={(user) => setUser(user)} />;
  } else {
    return (
      <BrowserRouter>
        <div className={currentMode === 'Dark' ? 'dark' : ''}>
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
            <div className={!isThreadPage && activeMenu && 'dark:bg-main-dark-bg bg-main-bg min-h-screen md:ml-72 w-full'}>
              <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ">
                <Navbar isThreadPage={isThreadPage} user={user} />
              </div>
              <div>
                {themeSettings && (<ThemeSettings />)}
                <Routes>
                  {/* dashboard  */}
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/" element={<Ecommerce />} />
                  <Route path="/ecommerce" element={<Ecommerce />} />
                  {/* pages  */}
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/employees" element={<Employees />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  {/* apps  */}
                  <Route path="/menu-tab" element={<TabbedMenu />} />
                  <Route path="/editor" element={<Editor />} />
                  <Route path="/thread" element={<Thread user={user} isThreadPage={isThreadPage} />} />
                  {/* charts  */}
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
        </div>
      </BrowserRouter>
    );
  }
};

export default App;