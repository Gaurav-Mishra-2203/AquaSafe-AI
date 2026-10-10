import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { TesterView } from './components/TesterView';
import { DashboardView } from './components/DashboardView';
import { BatchView } from './components/BatchView';
import { MethodologyView } from './components/MethodologyView';
import { Footer } from './components/Footer';
import { api } from './services/api';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [backendOnline, setBackendOnline] = useState<boolean>(false);
  const [aiMode, setAiMode] = useState<string>('Connecting...');
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  useEffect(() => {
    checkBackendHealth();
    const interval = setInterval(checkBackendHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const checkBackendHealth = async () => {
    try {
      const data = await api.checkHealth();
      setBackendOnline(data.status === 'healthy');
      setAiMode(data.ai_provider_mode);
    } catch {
      setBackendOnline(false);
      setAiMode('Offline / Retrying');
    }
  };

  const handleStartDiagnostic = () => {
    setActiveTab('tester');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDashboard = () => {
    setActiveTab('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPreset = (presetId: string) => {
    setSelectedPreset(presetId);
    setActiveTab('tester');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendOnline={backendOnline}
        aiMode={aiMode}
      />

      <main style={{ flex: 1 }}>
        {activeTab === 'landing' && (
          <LandingPage
            onStartDiagnostic={handleStartDiagnostic}
            onViewDashboard={handleViewDashboard}
            onSelectPreset={handleSelectPreset}
          />
        )}
        {activeTab === 'tester' && (
          <TesterView initialPreset={selectedPreset} />
        )}
        {activeTab === 'dashboard' && (
          <DashboardView />
        )}
        {activeTab === 'batch' && (
          <BatchView />
        )}
        {activeTab === 'science' && (
          <MethodologyView />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;
