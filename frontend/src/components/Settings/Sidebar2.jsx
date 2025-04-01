import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
export default function Sidebar2({isVisible, showSidebar}) {
  const currentLocation = useLocation();
  const getActiveLink = () => {
    const path = currentLocation.pathname;
    if (path.includes('/settings/account-information')) return 'Account Information';
    if (path.includes('/settings/change-password')) return 'Change Password';
    return '';
  };
  const activeLink = getActiveLink();
  const linkClasses = (link) =>
    activeLink === link
      ? 'flex items-center text-orange-500 p-1'
      : 'flex items-center text-black hover:text-orange-500 p-1';
  return (
    <div className=" bg-slate-100 w-25 h-screen border-r-2 p-3 sticky top-0">
      <div className="flex flex-col justify-center">
        <h1 className="text-xl font-bold p-2">Setting</h1>
      </div>
      <div className="flex flex-col p-2 gap-4">
        <Link to="/settings/account-information" className={linkClasses('Account Information')}>
          <span className="text-sm">Account Information</span>
        </Link>
        <Link to="/settings/change-password" className={linkClasses('Change Password')}>
          <span className="text-sm">Change Password</span>
        </Link>
      </div>
    </div>
  )
}