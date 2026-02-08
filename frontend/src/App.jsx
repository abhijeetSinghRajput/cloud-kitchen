import React, { lazy, Suspense } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import useOnlineStatus from "./hooks/useOnlineStatus";
import NoInternet from "./components/NoInternet";

// Lazy load pages for code splitting
const Homepage = lazy(() => import("./pages/Homepage"));
const SubscriptionPage = lazy(() => import("./pages/SubscriptionPage"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboardPage = lazy(() => import("./pages/admin/AdminDashboardPage"));
const FoodCategoryPage = lazy(() => import("./pages/admin/FoodCategoryPage"));
const FoodItemPage = lazy(() => import("./pages/admin/FoodItemPage"));
const CreateQrPage = lazy(() => import("./pages/admin/CreateQrPage"));
const SubscribersPage = lazy(() => import("./pages/admin/SubscribersPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

const App = () => {
  const { isOnline, isOffline } = useOnlineStatus();
  if (isOffline) {
    return <NoInternet />;
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="theme">
      {/* Suspense shows fallback while lazy component loads */}
      <Suspense fallback={<div className="text-center mt-20">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/subscription" element={<SubscriptionPage />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="category" element={<FoodCategoryPage />} />
            <Route path="category/:categoryName" element={<FoodItemPage />} />
            <Route path="create-qr" element={<CreateQrPage />} />
            <Route path="subscribers" element={<SubscribersPage />} />
            <Route
              path="*"
              element={
                <NotFoundPage
                  fallbackRoute="/admin/dashboard"
                  btnLabel="Back To Dashboard"
                />
              }
            />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <Toaster />
    </ThemeProvider>
  );
};

export default App;
