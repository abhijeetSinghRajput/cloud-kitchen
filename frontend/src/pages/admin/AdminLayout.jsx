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
          <Loader className="animate-spin" />
          <ShinyText speed={2} text={"Checking authentication..."} />
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
            className="bg-[#ff5200] hover:bg-[#e24900] rounded-lg"
            onClick={login}
            disabled={loading.login}
          >
            {loading.login ? (
              <Loader2 className="animate-spin" />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-5 h-5"
              >
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
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
