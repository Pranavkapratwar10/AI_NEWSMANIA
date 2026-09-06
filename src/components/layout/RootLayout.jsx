import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../custom/Header";
import Footer from "../custom/Footer";

export default function RootLayout() {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <Outlet />
      </main>
      {location.pathname !== '/ai-assistant' && <Footer />}
    </div>
  );
}
