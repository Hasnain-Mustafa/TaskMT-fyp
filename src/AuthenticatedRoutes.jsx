import React from 'react';
import { Route } from 'react-router-dom';
import { Projects, Ecommerce, Orders,  Employees, Thread, Line, Area, Bar, Pie, Financial, ColorMapping, Pyramid, Stacked, Editor, Portfolio } from './pages';
import { Navbar, Sidebar, ThemeSettings, TabbedMenu } from './components';

const AuthenticatedRoutes = () => {
    const isThreadPage = window.location.pathname === "/thread";
  
    return (
      <div>
        <Route path="/projects" element={<Projects />} />
        <Route path="/ecommerce" element={<Ecommerce />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/menu-tab" element={<TabbedMenu />} />
        <Route path="/editor" element={<Editor />} />
        <Route
          path="/thread"
          element={<Thread isThreadPage={isThreadPage} />} // Removed user prop
        />
        <Route path="/line" element={<Line />} />
        <Route path="/area" element={<Area />} />
        <Route path="/bar" element={<Bar />} />
        <Route path="/pie" element={<Pie />} />
        <Route path="/financial" element={<Financial />} />
        <Route path="/color-mapping" element={<ColorMapping />} />
        <Route path="/pyramid" element={<Pyramid />} />
        <Route path="/stacked" element={<Stacked />} />
      </div>
    );
  };
  
  export default AuthenticatedRoutes;