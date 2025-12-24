import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { Workspace } from './components/Workspace';
import { ToastProvider } from './components/Toast';
import { authAPI } from './services/supabase-api';

// Protected Route Component
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await authAPI.isAuthenticated();
        setIsAuthenticated(isAuth);
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F2F2F2] dark:bg-[#121212]">
        <Loader className="w-8 h-8 animate-spin text-black dark:text-white" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Wrapper to handle redirect if already logged in
const RedirectIfAuth = ({ children }: { children: JSX.Element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await authAPI.isAuthenticated();
      setIsAuthenticated(isAuth);
    };
    checkAuth();
  }, []);

  if (isAuthenticated === true) {
    return <Navigate to="/app" replace />;
  }

  return children;
};

// Wrapper for Login Page to handle navigation
const LoginPageWrapper = () => {
  const navigate = useNavigate();
  return <LoginPage onLoginSuccess={() => navigate('/app')} />;
};

const AppContent: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={
          <RedirectIfAuth>
             <LoginPageWrapper />
          </RedirectIfAuth>
        }
      />
      <Route
        path="/app"
        element={
          <RequireAuth>
            <Workspace />
          </RequireAuth>
        }
      />
      {/* Catch all redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;
