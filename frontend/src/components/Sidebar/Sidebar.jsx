import { useLocation, Link } from 'react-router-dom';
import {
  HomeIcon as HomeIconOutline,
  BookmarkIcon as BookmarkIconOutline,
  Cog6ToothIcon as Cog6ToothIconOutline,
  SparklesIcon as SparklesIconOutline,
  ArrowLeftOnRectangleIcon as ArrowLeftOnRectangleIconOutline,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  BookmarkIcon as BookmarkIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
  SparklesIcon as SparklesIconSolid,
  ArrowLeftOnRectangleIcon as ArrowLeftOnRectangleIconSolid,
} from '@heroicons/react/24/solid';
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
export default function Sidebar() {
  const currentLocation  = useLocation(); 
  const getActiveLink = () => {
    const path = currentLocation .pathname;
    if (path === '/') return 'Home';
    if (path.includes('/reply-bot')) return 'Reply bot';
    if (path.includes('/bookmarks')) return 'Bookmarks';
    if (path.includes('/settings/account-information')) return 'Settings';
    if (path.includes('/settings/change-password')) return 'Settings';
    if (path.includes('/sign-out')) return 'Sign out';
    return ''; 
  };
  const activeLink = getActiveLink(); 
  const linkClasses = (link) =>
    activeLink === link
      ? 'flex items-center bg-orange-500 text-white p-1 rounded'
      : 'flex items-center text-black hover:text-orange-500 p-1 rounded';

  const renderIcon = (link, IconOutline, IconSolid) => {
    return activeLink === link ? (
      <IconSolid className="h-5 w-5 mr-2" />
    ) : (
      <IconOutline className="h-6 w-6 mr-2" />
    );
  };
    const { logoutUser } = useContext(AuthContext);

  return (
    <div className="w-72 bg-slate-100 h-screen border-r-2 p-5">
      <div className="flex flex-col justify-center h-16">
        <h1 className="text-3xl font-bold text-orange-500 p-2">FLICDex</h1>
      </div>
      <div className="flex flex-col p-2 gap-4">
        <Link to="/" className={linkClasses('Home')}>
          {renderIcon('Home', HomeIconOutline, HomeIconSolid)}
          <span className="text-base">Home</span>
        </Link>
        <Link to="/reply-bot" className={linkClasses('Reply bot')}>
          {renderIcon('Reply bot', SparklesIconOutline, SparklesIconSolid)}
          <span className="text-base">Reply bot</span>
        </Link>
        <Link to="/bookmarks" className={linkClasses('Bookmarks')}>
          {renderIcon('Bookmarks', BookmarkIconOutline, BookmarkIconSolid)}
          <span className="text-base">Bookmarks</span>
        </Link>
        <Link to= "/settings/account-information" className={linkClasses('Settings')}>
          {renderIcon('Settings', Cog6ToothIconOutline, Cog6ToothIconSolid)}
          <span className="text-base">Settings</span>
        </Link>
        <button className={linkClasses('Sign out')} onClick={logoutUser}>
          {renderIcon('Sign out', ArrowLeftOnRectangleIconOutline, ArrowLeftOnRectangleIconSolid)}
          <span className="text-base">Sign out</span>
        </button>
      </div>
    </div>
  );
}
