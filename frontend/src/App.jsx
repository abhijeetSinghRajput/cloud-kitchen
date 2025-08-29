import React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import FoodCategoryPage from "./pages/admin/FoodCategoryPage";
import FoodItemPage from "./pages/admin/FoodItemPage";
import { Toaster } from "sonner";
import CreateQrPage from "./pages/admin/CreateQrPage";
import NotFoundPage from "./pages/NotFoundPage";
import SubscriptionPage from "./pages/SubscriptionPage";
import SubscribersPage from "./pages/admin/SubscribersPage";

const App = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="theme">
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
          {/* Catch-all for unknown admin routes */}
          <Route path="*" element={<NotFoundPage fallbackRoute="/admin/dashboard" btnLabel={"Back To Dashboard"} />} />
        </Route>

        {/* Catch-all for unknown top-level routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </ThemeProvider>
  );
};

export default App;
