import { useState } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { RegisterScreen } from './components/RegisterScreen';
import { Dashboard } from './components/Dashboard';
import { ClientDashboard } from './components/ClientDashboard';
import { ThemeProvider } from './contexts/ThemeContext';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = (adminStatus: boolean) => {
    setIsAdmin(adminStatus);
    setIsAuthenticated(true);
  };

  const handleRegister = (adminStatus: boolean) => {
    setIsAdmin(adminStatus);
    setShowRegister(false);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  return (
    <ThemeProvider>
      {!isAuthenticated ? (
        showRegister ? (
          <RegisterScreen
            onRegister={handleRegister}
            onBackToLogin={() => setShowRegister(false)}
          />
        ) : (
          <LoginScreen
            onLogin={handleLogin}
            onGoToRegister={() => setShowRegister(true)}
          />
        )
      ) : (
        isAdmin ? (
          <Dashboard onLogout={handleLogout} />
        ) : (
          <ClientDashboard onLogout={handleLogout} />
        )
      )}
    </ThemeProvider>
  );
}