import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { MdOutlineCancel } from "react-icons/md";
import { FiShoppingBag } from "react-icons/fi";
import { RiContactsLine } from "react-icons/ri";
import {
  AiOutlineCalendar,
  AiOutlineAreaChart,
  AiOutlineBarChart,
  AiOutlineStock,
} from "react-icons/ai";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import Button from "../components/Button";
import { useStateContext } from "../contexts/ContextProvider";
import Logo from "../data/taskmt-logo.png";
import { framerSidebarPanel } from "./framer";
import { motion } from "framer-motion";
import useMediaQuery from "@mui/material/useMediaQuery";

const Sidebar = () => {
  const { currentColor, activeMenu, setActiveMenu, screenSize } =
    useStateContext();
  const location = useLocation();
  const [isAnyLinkActive, setIsAnyLinkActive] = useState(false);
  const isSmallDevice = useMediaQuery("(max-width:900px)");

  const links = [
    {
      title: "Dashboard",
      links: [
        {
          name: "projects",
          icon: <FiShoppingBag />,
        },
      ],
    },

    {
      title: "Pages",
      links: [
        {
          name: "portfolio",
          icon: <RiContactsLine />,
        },
      ],
    },
    {
      title: "Apps",
      links: [
        {
          name: "calendar",
          icon: <AiOutlineCalendar />,
        },
      ],
    },
    {
      title: "Analytics",
      links: [
        {
          name: "status",
          icon: <AiOutlineBarChart />,
        },
        {
          name: "weekly progress",
          icon: <AiOutlineStock />,
        },
        {
          name: "performance",
          icon: <AiOutlineAreaChart />,
        },
      ],
    },
  ];

  useEffect(() => {
    // Check if the current path matches any link other than 'projects'
    const pathIsActive = links.some((section) =>
      section.links.some((link) => {
        const linkPath = `/${link.name.toLowerCase()}`;
        const currentPath = decodeURIComponent(location.pathname.toLowerCase());
        return (
          currentPath === linkPath && link.name.toLowerCase() !== "projects"
        );
      })
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

  const getLinkStyle = (linkName, isActive) => {
    const isProjectsLink = linkName.toLowerCase() === "projects";
    if (isActive) return { backgroundColor: currentColor };
    if (isProjectsLink && !isAnyLinkActive)
      return { backgroundColor: currentColor };
    return {};
  };

  return (
    <motion.div
      {...framerSidebarPanel}
      className="ml-3 h-screen md:overflow-hidden overflow-auto pb-10"
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
            {isSmallDevice && (
              <TooltipComponent content="Menu" position="BottomCenter">
                <Button
                  icon={<MdOutlineCancel />}
                  color="rgb(153, 171, 180)"
                  bgHoverColor="light-gray"
                  size="2xl"
                  borderRadius="50%"
                  onClick={handleCloseSideBar}
                />
              </TooltipComponent>
            )}
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
                    style={({ isActive }) => getLinkStyle(link.name, isActive)}
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
