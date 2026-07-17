import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ResearchLibrary from './components/ResearchLibrary';
import PaperViewer from './components/PaperViewer';
import Analytics from './components/Analytics';
import SettingsPage from './components/Settings';
import Profile from './components/Profile';
import LiteratureReviewPage from './components/LiteratureReview';
import { User } from './types';
import InteractiveBackground from './components/landing/InteractiveBackground';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [activePaperId, setActivePaperId] = useState<string | null>(null);
  const [selectedPaperIds, setSelectedPaperIds] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Check if session exists in localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('researchmind_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Stale user session', err);
      }
    }
  }, []);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('researchmind_user', JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('researchmind_user');
    setActivePaperId(null);
    setActiveTab('dashboard');
  };

  const handleNavigateToTab = (tab: string) => {
    setActiveTab(tab);
  };

  const handleOpenPaper = (paperId: string) => {
    setActivePaperId(paperId);
    setActiveTab('workspace');
  };

  const handleStartComparativeChat = async () => {
    setActivePaperId('all');
    setActiveTab('workspace');
  };

  // Render authenticating screen
  if (!user) {
    return <LandingPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="relative flex h-screen overflow-hidden bg-slate-50/20 dark:bg-[#070a13]/70 text-slate-900 dark:text-slate-100 font-sans" id="app_frame_container">
      {/* 1. Liquid Glass Dynamic Canvas Background with spotlight */}
      <InteractiveBackground />

      {/* PERSISTENT SIDEBAR */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={handleNavigateToTab} 
        user={user} 
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* RIGHT WORKSPACE INTERFACE */}
      <div className="flex-1 flex flex-col overflow-hidden bg-transparent relative z-10" id="workspace_right_column">
        {/* UNIFIED TOP CONTEXT HEADER */}
        <Header activeTab={activeTab} user={user} onToggleSidebar={() => setSidebarOpen(prev => !prev)} />

        {/* DETAILED CONTENT VIEWS */}
        <main className="flex-1 overflow-y-auto bg-white/5 dark:bg-slate-950/10 backdrop-blur-md" id="main_content_pane">
          {activeTab === 'dashboard' && (
            <Dashboard 
              user={user} 
              onOpenPaper={handleOpenPaper} 
              onNavigateToTab={handleNavigateToTab} 
            />
          )}

          {activeTab === 'library' && (
            <ResearchLibrary 
              user={user} 
              onOpenPaper={handleOpenPaper} 
              onNavigateToTab={handleNavigateToTab}
              onStartComparativeChat={handleStartComparativeChat}
              selectedPaperIds={selectedPaperIds}
              setSelectedPaperIds={setSelectedPaperIds}
            />
          )}

          {activeTab === 'synthesis' && (
            <LiteratureReviewPage
              user={user}
              onBackToLibrary={() => handleNavigateToTab('library')}
              selectedPaperIds={selectedPaperIds}
              setSelectedPaperIds={setSelectedPaperIds}
            />
          )}

          {activeTab === 'workspace' && (
            <PaperViewer
              paperId={activePaperId}
              onBackToLibrary={() => setActivePaperId(null)}
              userId={user.id}
              onSelectPaper={handleOpenPaper}
            />
          )}

          {activeTab === 'analytics' && (
            <Analytics />
          )}

          {activeTab === 'profile' && (
            <Profile 
              user={user}
              onOpenPaper={handleOpenPaper}
              onUserUpdate={(updatedUser: User) => {
                setUser(updatedUser);
                localStorage.setItem('researchmind_user', JSON.stringify(updatedUser));
              }}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsPage />
          )}
        </main>
      </div>
    </div>
  );
}
