// AuthenticatedRoutes.js

import React from "react";
import "livekit-react/dist/index.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { Navbar, Sidebar } from "./components";
import { RoomPage } from "./pages/RoomPage";
import { PreJoinPage } from "./pages/PreJoinPage";

import {
  Projects,
  Portfolio,
  Thread,
  Bar,
  Line,
  Kanban,
  Calendar,
  Area,
  UpdateProfilePicture,
  ResetPassword,
} from "./pages";
import { useStateContext } from "./contexts/ContextProvider";
import "./App.css";

const AuthenticatedRoutes = () => {
  const isThreadPage = window.location.pathname === "/thread";
  const isRoomPage = location.pathname.includes("/room");

  const { activeMenu, currentColor, themeSettings, setThemeSettings } =
    useStateContext();

  return (
    <div
      className={
        !isRoomPage &&
        `flex relative ${activeMenu ? "dark:bg-main-dark-bg" : ""}`
      }
    >
      {!isThreadPage && !isRoomPage && activeMenu && (
        <div className="w-64 xl:w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white ">
          <Sidebar />
        </div>
      )}
      <div
        className={
          !isThreadPage && !isRoomPage
            ? "dark:bg-main-dark-bg bg-main-bg min-h-screen lg:ml-48 xl:ml-72 w-full"
            : ""
        }
      >
        {!isRoomPage && (
          <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ">
            <Navbar isThreadPage={isThreadPage} />
          </div>
        )}
        <div>
          <Routes>
            {/* <Route path="/reset-password/:token" element={<ResetPassword />} /> */}
            <Route path="/update-picture" element={<UpdateProfilePicture />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/" element={<Projects />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/kanban/:projectId" element={<Kanban />} />
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="/thread" element={<Thread />} />
            <Route path="/prejoin" element={<PreJoinPage />} />
            <Route path="/room" element={<RoomPage />} />
            <Route path="/status" element={<Bar />} />
            <Route path="/weekly progress" element={<Line />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/performance" element={<Area />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AuthenticatedRoutes;
