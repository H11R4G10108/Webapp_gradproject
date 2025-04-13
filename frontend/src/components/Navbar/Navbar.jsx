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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
        {/* Logo or Brand */}
        <div className="text-lg font-bold text-orange-500 hidden">
          <Link to="/">Trọ Đà Nẵng</Link>
        </div>

        {/* Navigation Items */}
        <div className="ml-auto flex items-center space-x-4">
          <NavigationMenu>
            <NavigationMenuList className="flex space-x-4">
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
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <div>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="px-2 py-1 text-sm text-gray-800 hover:text-orange-500 cursor-pointer"
                          >
                            Đăng xuất
                          </DropdownMenuItem>
                        </div>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Xác nhận đăng xuất
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Bạn có chắc chắn muốn đăng xuất khỏi tài khoản
                            không?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-orange-500 text-white hover:bg-orange-600"
                            onClick={logoutUser}
                          >
                            Đăng xuất
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
