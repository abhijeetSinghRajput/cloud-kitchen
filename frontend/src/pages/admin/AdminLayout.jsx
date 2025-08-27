// pages/admin/AdminLayout.jsx
import React, { useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import Navbar from "@/components/admin/Navbar";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import { Loader, Loader2 } from "lucide-react";
import ShinyText from "@/components/ui/ShinyText/ShinyText";

const AdminLayout = () => {
  const { authUser, login, checkAuth, loading, error } = useAuthStore();

  // check firebase auth state on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loading.checkAuth) {
    return (
      <div className="flex items-center justify-center h-screen text-lg">
        <div className="flex gap-2 items-center">
          <Loader className="animate-spin text-sm size-5" />
          <ShinyText speed={2} text={"Checking authentication..."} className="text-sm" />
        </div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
        <div className="max-w-md w-full text-center space-y-6 p-6 rounded-2xl shadow-lg bg-white">
          {/* Brand */}
          <h1 className="text-3xl font-extrabold text-[#ff5200] tracking-tight">
            <Link to={"/"}>
              Cloud Kitchen{" "}
              <span className="text-gray-800">
                24<sup>7</sup>
              </span>
            </Link>
          </h1>
          <p className="text-muted-foreground">
            Welcome back, admin! Sign in to manage your restaurant.
          </p>

          {/* Login Button */}
          <Button
            size="lg"
            className="rounded-lg hover:bg-primary/80"
            onClick={login}
            disabled={loading.login}
          >
            {loading.login ? (
              <Loader2 className="animate-spin" />
            ) : (
              <img src="./google.svg" width={30}/>
            )}
            Login with Google
          </Button>

          {/* Error message */}
          {error.login && (
            <p className="text-red-500 text-sm font-medium">{error.login}</p>
          )}
        </div>
      </div>
    );
  }

  // if logged in -> show admin layout
  return (
    <div>
      <Navbar />
      <div className="p-2 sm:p-4 max-w-screen-xl mx-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
