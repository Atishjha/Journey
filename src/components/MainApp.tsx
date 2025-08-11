import React, { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import Login from "@/components/auth/Login"; // Default import
import Register from "@/components/auth/Register"; // Default import

import { HomePage } from "@/pages/HomePage";
import { DashboardPage } from "@/pages/DashboardPage";
import { PlannerPage } from "@/pages/PlannerPage";
import { ItineraryPage } from "@/pages/ItineraryPage";
import { ProfilePage } from "@/pages/ProfilePage";
import NotFound from "../pages/NotFound";

import { AuthProvider } from '../hooks/useAuth';
import './App.css';

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleLogin = () => {
    setAuthMode('login');
    setAuthModalOpen(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const switchToRegister = () => {
    setAuthMode('register');
  };

  const switchToLogin = () => {
    setAuthMode('login');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen flex flex-col">
              <Header 
                isAuthenticated={isAuthenticated}
                onLogin={handleLogin}
                onLogout={handleLogout}
              />
              
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/planner" element={<PlannerPage />} />
                  <Route path="/itinerary" element={<ItineraryPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>

              <Footer />
            </div>

            <Dialog open={authModalOpen} onOpenChange={setAuthModalOpen}>
              <DialogContent className="sm:max-w-md p-0 border-0 bg-transparent">
                {authMode === 'login' ? (
                  <Login 
                    onClose={closeAuthModal}
                    onSwitchToRegister={switchToRegister}
                  />
                ) : (
                  <Register 
                    onClose={closeAuthModal}
                    onSwitchToLogin={switchToLogin}
                  />
                )}
              </DialogContent>
            </Dialog>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;