import React from "react";
import { Button } from "./components/ui/button";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";
import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";

const App = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="theme">
      <Routes>
        <Route path="/" element={<Homepage/>}/>
      </Routes>
    </ThemeProvider>
  );
};

export default App;

// modeling
// photography
// social media managing
// contact
// doctor patient