import React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import FoodCategoryPage from "./pages/admin/FoodCategoryPage";
import FoodItemPage from "./pages/admin/FoodItemPage";
import { Toaster } from "sonner";

const App = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="theme">
      <Routes>
        <Route path="/" element={<Homepage/>}/>
        <Route path="/admin" element={<AdminLayout/>}>
          <Route index element={<AdminDashboardPage/>}/>
          <Route path="dashboard" element={<AdminDashboardPage/>}/>
          <Route path="category" element={<FoodCategoryPage/>}/>
          <Route path="category/:categoryName" element={<FoodItemPage/>}/>
        </Route>
      </Routes>
      <Toaster/>
    </ThemeProvider>
  );
};

export default App;