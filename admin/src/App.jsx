import React, { useState } from 'react';
import { getToken, clearToken } from './GitHubApi';
import Login from './Login';
import Dashboard from './Dashboard';
import BusinessInfoEditor from './BusinessInfoEditor';
import LeadsManager from './LeadsManager';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(() => !!getToken());
  const [section, setSection] = useState(null);

  const handleAuthError = () => {
    clearToken();
    setLoggedIn(false);
    setSection(null);
  };

  if (!loggedIn) {
    return <Login onLoggedIn={() => setLoggedIn(true)} />;
  }

  if (section === 'leads') {
    return <LeadsManager onBack={() => setSection(null)} onAuthError={handleAuthError} />;
  }

  if (section === 'business-info') {
    return <BusinessInfoEditor onBack={() => setSection(null)} onAuthError={handleAuthError} />;
  }

  return <Dashboard onOpenSection={setSection} />;
}
