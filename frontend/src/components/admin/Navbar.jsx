import React from "react";
import { CupSoda, Gauge, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { getAvatarFallbackText } from "@/lib/utils";
import { Link, NavLink } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "../ui/button"; // shadcn button

const links = [
  { label: "Dashboard", path: "/admin/dashboard", icon: Gauge },
  { label: "Category", path: "/admin/category", icon: CupSoda },
];

const Navbar = () => {
  const { authUser, login, logout, loading, error } = useAuthStore();

  return (
    <nav className="sticky z-50 top-0 bg-primary-foreground shadow-md left-0">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center px-4 py-2">
        <h1 className="text-[#ff5200] font-semibold">
          <Link to={"/"}>Cloud Kitchen</Link>
        </h1>

        <div className="flex items-center gap-6">
          {/* Nav Links */}
          <ul className="flex gap-4 text-sm text-primary/70">
            {links.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `transition-colors py-1.5 px-2 rounded-lg flex gap-2 items-center font-semibold ${
                      isActive
                        ? "text-primary-foreground bg-primary"
                        : "text-primary/70 hover:text-primary"
                    }`
                  }
                >
                  <link.icon className="size-5" />
                  <span className="hidden sm:block">{link.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          {/* If user not logged in -> show login button */}
          {!authUser ? (
            <Button onClick={login} disabled={loading.login}>
              {loading.login ? "Signing in..." : "Login with Google"}
            </Button>
          ) : (
            /* If user logged in -> show avatar dropdown */
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="size-8 border cursor-pointer">
                  <AvatarImage
                    src={authUser?.photoURL}
                    alt={authUser?.displayName}
                    referrerPolicy="no-referrer"
                  />

                  <AvatarFallback>
                    {getAvatarFallbackText(authUser?.displayName)}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={authUser?.photoURL}
                        alt={authUser?.displayName}
                        referrerPolicy="no-referrer"
                      />

                      <AvatarFallback>
                        {getAvatarFallbackText(authUser?.displayName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {authUser?.displayName}
                      </span>
                      <span className="truncate text-xs">
                        {authUser?.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  disabled={loading.logout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="size-4" />
                  {loading.logout ? "Logging out..." : "Log out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error.login && (
        <div className="bg-red-500 text-white text-center py-1 text-sm">
          {error.login}
        </div>
      )}
      {error.logout && (
        <div className="bg-red-500 text-white text-center py-1 text-sm">
          {error.logout}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
