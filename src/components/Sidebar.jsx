import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { MdOutlineCancel } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";

import { links } from "../data/dummy";
import { useStateContext } from "../contexts/ContextProvider";
import Logo from "../data/taskmt-logo.png";
import { framerSidebarPanel } from "./framer";
import { motion } from "framer-motion";

const Sidebar = () => {
  const { currentColor, activeMenu, setActiveMenu, screenSize } =
    useStateContext();
  const location = useLocation();
  const [isAnyLinkActive, setIsAnyLinkActive] = useState(false);

  useEffect(() => {
    // Check if the current path matches any link other than 'projects'
    const pathIsActive = links.some((section) =>
      section.links.some(
        (link) =>
          `/${link.name}` === location.pathname &&
          link.name.toLowerCase() !== "projects"
      )
    );
    setIsAnyLinkActive(pathIsActive);
  }, [location]);

  const handleCloseSideBar = () => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  const activeLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-full text-white text-md m-2 hover:bg-hover dark:hover:bg-dark-hover";
  const normalLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-full text-md text-gray-700 dark:text-gray-200 dark:hover:text-black m-2";

  const getClassName = (linkName, isActive) => {
    const isProjectsLink = linkName.toLowerCase() === "projects";
    if (isActive) return activeLink;
    if (isProjectsLink && !isAnyLinkActive) return activeLink;
    return normalLink;
  };

  return (
    <motion.div
      {...framerSidebarPanel}
      className="ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10"
    >
      {activeMenu && (
        <>
          <div className="flex justify-between items-center">
            <Link
              to="/"
              onClick={handleCloseSideBar}
              className="items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900"
            >
              <img className="h-12" src={Logo} alt="Logo" />
            </Link>
            <TooltipComponent content="Menu" position="BottomCenter">
              <button
                type="button"
                onClick={handleCloseSideBar}
                style={{ color: currentColor }}
                className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
              >
                <MdOutlineCancel />
              </button>
            </TooltipComponent>
          </div>
          <div className="mt-10">
            {links.map((item) => (
              <div key={item.title}>
                <p className="text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase">
                  {item.title}
                </p>
                {item.links.map((link) => (
                  <NavLink
                    to={`/${link.name}`}
                    key={link.name}
                    onClick={handleCloseSideBar}
                    className={({ isActive }) =>
                      getClassName(link.name, isActive)
                    }
                    style={({ isActive }) => ({
                      backgroundColor:
                        isActive ||
                        (!isAnyLinkActive &&
                          link.name.toLowerCase() === "projects")
                          ? currentColor
                          : "",
                    })}
                  >
                    {link.icon}
                    <span className="capitalize">{link.name}</span>
                  </NavLink>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default Sidebar;
