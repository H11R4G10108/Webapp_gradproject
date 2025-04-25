import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { AuthContext } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logoutUser } = useContext(AuthContext);
  const user_id = user ? user.user_id : null;
  const location = useLocation();

  const generalItems = [
    { name: "Trang chủ", href: "/" },
    { name: "Tìm kiếm", href: "/article" },
    { name: "So sánh", href: "/compare" },
  ];

  const accountItems = [
    { name: "Bookmark", href: "/bookmarks" },
    { name: "Thông tin tài khoản", href: "/settings/account-information" },
    { name: "Đổi mật khẩu", href: "/settings/change-password" },
  ];

  return (
    <div className="bg-gray-50 shadow-sm sticky top-0 z-50 border-b-2">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo */}
        <div className="text-lg font-bold text-orange-500">
          <Link to="/">Trọ Đà Nẵng</Link>
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger className="p-2 text-gray-800 hover:text-orange-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-md shadow-lg p-2 bg-white">
              {generalItems.map((item) => (
                <DropdownMenuItem key={item.name} asChild>
                  <Link
                    to={item.href}
                    className={`block px-4 py-2 text-sm rounded-md transition-colors ${
                      location.pathname === item.href
                        ? "text-orange-500 font-semibold"
                        : "text-gray-800 hover:text-orange-500"
                    }`}
                  >
                    {item.name}
                  </Link>
                </DropdownMenuItem>
              ))}
              {user_id ? (
                <>
                  <DropdownMenuSeparator />
                  {accountItems.map((item) => (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link
                        to={item.href}
                        className={`block px-4 py-2 text-sm rounded-md transition-colors ${
                          location.pathname === item.href
                            ? "text-orange-500 font-semibold"
                            : "text-gray-800 hover:text-orange-500"
                        }`}
                      >
                        {item.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuItem asChild>
                    <button
                      onClick={logoutUser}
                      className="block px-4 py-2 text-sm text-gray-800 hover:text-orange-500"
                    >
                      Đăng xuất
                    </button>
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem asChild>
                  <Link
                    to="/login"
                    className={`block px-4 py-2 text-sm rounded-md transition-colors ${
                      location.pathname === "/login"
                        ? "text-orange-500 font-semibold"
                        : "text-gray-800 hover:text-orange-500"
                    }`}
                  >
                    Đăng nhập
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Full Menu for Desktop */}
        <div className="hidden md:flex ml-auto items-center">
          <NavigationMenu>
            <NavigationMenuList>
              {generalItems.map((item) => (
                <NavigationMenuItem key={item.name}>
                  <NavigationMenuLink asChild>
                    <Link
                      to={item.href}
                      className={`px-4 py-2 transition-colors ${
                        location.pathname === item.href
                          ? "text-orange-500 font-semibold"
                          : "text-gray-800 hover:text-orange-500"
                      }`}
                    >
                      {item.name}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
              {user_id ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="text-base font-semibold text-gray-800 hover:text-orange-500 transition-colors px-4 py-2">
                    Tài khoản
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="rounded-md shadow-lg p-2">
                    <DropdownMenuSeparator />
                    {accountItems.map((item) => (
                      <DropdownMenuItem key={item.name} asChild>
                        <Link
                          to={item.href}
                          className={`block px-2 py-1 text-sm rounded-md transition-colors ${
                            location.pathname === item.href
                              ? "text-orange-500 font-semibold"
                              : "text-gray-800 hover:text-orange-500"
                          }`}
                        >
                          {item.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuItem asChild>
                      <button
                        onClick={logoutUser}
                        className="block px-2 py-1 text-sm text-gray-800 hover:text-orange-500"
                      >
                        Đăng xuất
                      </button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/login"
                      className={`px-4 py-2 transition-colors ${
                        location.pathname === "/login"
                          ? "text-orange-500 font-semibold"
                          : "text-gray-800 hover:text-orange-500"
                      }`}
                    >
                      Đăng nhập
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </div>
  );
}
