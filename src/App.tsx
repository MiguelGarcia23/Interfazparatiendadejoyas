import { useState } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { RegisterScreen } from './components/RegisterScreen';
import { Dashboard } from './components/Dashboard';
import { ClientDashboard } from './components/ClientDashboard';
import { StoreDashboard } from './components/StoreDashboard';
import { ThemeProvider } from './contexts/ThemeContext';

type UserType = 'admin' | 'store' | 'client';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<UserType>('client');
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = (type: UserType) => {
    setUserType(type);
    setIsAuthenticated(true);
  };

  const handleRegister = (type: UserType) => {
    setUserType(type);
    setShowRegister(false);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserType('client');
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
        userType === 'admin' ? (
          <Dashboard onLogout={handleLogout} />
        ) : userType === 'store' ? (
          <StoreDashboard onLogout={handleLogout} />
        ) : (
          <ClientDashboard onLogout={handleLogout} />
        )
      )}
    </ThemeProvider>
  );
}