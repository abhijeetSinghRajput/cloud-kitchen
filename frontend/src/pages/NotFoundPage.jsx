import { Button } from "@/components/ui/button";
import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ import navigate hook

const NotFoundPage = ({ fallbackRoute = "/", btnLabel }) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-screen-2xl mx-auto p-4 h-svh flex items-center justify-center">
      <div>
        <img
          src="/egg-404.svg"
          alt="404 not found"
          className="grayscale animate-pulse"
        />
        <div className="text-center">
          <h1 className="font-bold text-4xl">Page not found</h1>
          <p className="text-muted-foreground mt-2">
            Sorry, we couldn't find the page you are looking for
          </p>
          <Button
            size="lg"
            className="mt-8 rounded-xl"
            onClick={() => navigate(fallbackRoute)}
          >
            {btnLabel ? btnLabel : "Go Back To Home"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
