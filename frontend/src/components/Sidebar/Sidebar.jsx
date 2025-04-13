import { useLocation, Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { SidebarData } from "./SidebarData";
import {
  ArrowLeftOnRectangleIcon as ArrowLeftOnRectangleIconOutline,
} from '@heroicons/react/24/outline';
import {
  ArrowLeftOnRectangleIcon as ArrowLeftOnRectangleIconSolid,
} from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { XMarkIcon } from "@heroicons/react/16/solid";
import { Bars3BottomLeftIcon } from "@heroicons/react/20/solid";

export default function Sidebar() {
  const { pathname } = useLocation();
  const { logoutUser } = useContext(AuthContext);

  const isActive = (path) => (path === "/" ? pathname === path : pathname.startsWith(path));

  const linkClasses = (active) =>
    `flex items-center p-2 rounded transition ${active ? "bg-orange-100 text-orange-500" : "text-black hover:text-orange-500"
    }`;
  const [isMobileActive, setIsMobileActive] = useState(false);

  const toggleSidebar = () => {
    setIsMobileActive(!isMobileActive);
  };

  return (
    <>
      <div className={`md:bg-slate-100 h-screen md:w-56 lg:w-56 xl:w-56 md:border-r-2 md:py-3 md:px-5 sticky top-0`}>
        <div className="p-2 flex items-center justify-between gap-5">
          <h1 className='text-2xl font-bold text-orange-500 md:flex hidden'>RentDex</h1>
          <button onClick={toggleSidebar} className="md:hidden"> <Bars3BottomLeftIcon className="md-hidden w-6 text-orange-500 sticky top-0" /></button>
        </div>
        <hr className={`hidden md:mt-1 md:mb-5 md:text-slate-200`} />
        <nav className={`hidden md:flex-col md:p-2 md:gap-4 md:flex`}>
          {SidebarData.map(({ id, title, path, iconOutline, iconSolid }) => (
            <Link key={id} to={path} className={`${linkClasses(isActive(path))}`}>
              {isActive(path) ? iconSolid : iconOutline}
              <span className="text-sm">{title}</span>
            </Link>
          ))}
          <button className={`hidden md:flex ${linkClasses(isActive("/sign-out"))}}`} onClick={logoutUser}>
            {isActive("/sign-out") ? (
              <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
            ) : (
              <ArrowLeftOnRectangleIconOutline className="h-5 w-5 mr-2" />
            )}
            <span className="text-sm">Sign out</span>
          </button>
        </nav>
      </div>
      {isMobileActive ?
        (<div>
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3 }}
            className="absolute top-0 left-0 w-64 h-screen bg-slate-100 border-r-4 border-slate-300 p-5 z-50"
          >
            <div className="flex items-center justify-between gap-5 mb-5">
              <h1 className='text-2xl font-bold text-orange-500'>RentDex</h1>
              <button onClick={toggleSidebar}> <XMarkIcon className="w-7 h-7 text-orange-500" /></button>
            </div>
            <hr className={`mt-1 mb-5 text-slate-200`} />
            <nav className={`flex-col p-2 gap-4 flex`}>
              {SidebarData.map(({ id, title, path, iconOutline, iconSolid }) => (
                <Link key={id} to={path} className={`${linkClasses(isActive(path))}`}>
                  {isActive(path) ? iconSolid : iconOutline}
                  <span className="text-sm">{title}</span>
                </Link>
              ))}
              <button className={`${linkClasses(isActive("/sign-out"))}}`} onClick={logoutUser}>
                {isActive("/sign-out") ? (
                  <ArrowLeftOnRectangleIconSolid className="h-5 w-5 mr-2" />
                ) : (
                  <ArrowLeftOnRectangleIconOutline className="h-5 w-5 mr-2" />
                )}
                <span className="text-sm">Sign out</span>
              </button>
            </nav>
          </motion.div>
          <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={toggleSidebar}></div>
        </div>) : null}
    </>);
}
