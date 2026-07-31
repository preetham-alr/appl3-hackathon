/**
 * Krithiq AI - Main Application Shell
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { ParticleBackground } from './components/common/ParticleBackground';
import { HomeDashboard } from './components/dashboard/HomeDashboard';
import { GovernmentDashboard } from './components/dashboard/GovernmentDashboard';
import { NgoDashboard } from './components/dashboard/NgoDashboard';
import { VerificationEngine } from './components/verification/VerificationEngine';
import { CivicReporting } from './components/civic/CivicReporting';
import { ComplaintManagement } from './components/civic/ComplaintManagement';
import { CivicMap } from './components/map/CivicMap';
import { CommunityPlatform } from './components/community/CommunityPlatform';
import { AiReels } from './components/reels/AiReels';
import { TransparencyDashboard } from './components/dashboard_transparency/TransparencyDashboard';
import { SchemesDashboard } from './components/schemes/SchemesDashboard';
import { VolunteersDashboard } from './components/volunteers/VolunteersDashboard';
import { RewardsView } from './components/gamification/RewardsView';
import { UserProfileView } from './components/profile/UserProfileView';
import { AiAssistant } from './components/assistant/AiAssistant';
import { FloatingAiAssistant } from './components/assistant/FloatingAiAssistant';
import { RewardsModal } from './components/gamification/RewardsModal';
import { UserProfileModal } from './components/profile/UserProfileModal';
import { CreatorProfileModal } from './components/profile/CreatorProfileModal';
import { LocationPickerModal } from './components/location/LocationPickerModal';
import { SemanticSearchModal } from './components/search/SemanticSearchModal';
import { AccessibilityDrawer } from './components/accessibility/AccessibilityDrawer';
import { AuthModal } from './components/auth/AuthModal';
import { SettingsModal } from './components/common/SettingsModal';
import { NotificationsModal } from './components/notifications/NotificationsModal';
import { SplashScreen } from './components/auth/SplashScreen';
import { RoleSelectionScreen } from './components/auth/RoleSelectionScreen';
import { ProfileSetupScreen } from './components/auth/ProfileSetupScreen';
import { CreatorStudio } from './components/creator/CreatorStudio';

export function App() {
  const {
    activeTab,
    isReportingModalOpen,
    setReportingModalOpen,
    isCreatorStudioOpen,
    setCreatorStudioOpen,
    setAuthModalOpen,
    accessibility,
    authStep,
    setAuthStep,
    user,
    switchUserRole,
    completeOnboarding,
    theme,
  } = useApp();

  // Onboarding & Authentication Step Gates
  if (authStep === 'splash') {
    return (
      <>
        <SplashScreen
          onGetStarted={() => setAuthModalOpen(true)}
          onLogin={() => setAuthModalOpen(true)}
        />
        <AuthModal />
      </>
    );
  }

  if (authStep === 'role_select') {
    return (
      <RoleSelectionScreen
        initialRole={user.role || 'citizen'}
        onSelectRole={(selectedRole) => {
          switchUserRole(selectedRole);
          setAuthStep('profile_setup');
        }}
        onBack={() => setAuthStep('splash')}
      />
    );
  }

  if (authStep === 'profile_setup') {
    return (
      <ProfileSetupScreen
        initialData={user}
        role={user.role || 'citizen'}
        onComplete={(profileData) => completeOnboarding(profileData)}
        onBack={() => setAuthStep('role_select')}
      />
    );
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        if (user.role === 'government') return <GovernmentDashboard />;
        if (user.role === 'ngo') return <NgoDashboard />;
        return <HomeDashboard />;
      case 'assistant':
        return <AiAssistant />;
      case 'verification':
        return <VerificationEngine />;
      case 'civic':
        return <ComplaintManagement />;
      case 'map':
        return <CivicMap />;
      case 'community':
        return <CommunityPlatform />;
      case 'reels':
        return <AiReels />;
      case 'transparency':
        return <TransparencyDashboard />;
      case 'schemes':
        return <SchemesDashboard />;
      case 'volunteers':
        return <VolunteersDashboard />;
      case 'rewards':
        return <RewardsView />;
      case 'profile':
        return <UserProfileView />;
      default:
        if (user.role === 'government') return <GovernmentDashboard />;
        if (user.role === 'ngo') return <NgoDashboard />;
        return <HomeDashboard />;
    }
  };

  return (
    <div
      className={`min-h-screen font-sans relative overflow-x-hidden transition-colors duration-300 ${
        theme === 'light'
          ? 'bg-slate-50 text-slate-900 selection:bg-teal-700 selection:text-white'
          : 'bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950'
      } ${accessibility.elderlyMode ? 'text-lg space-y-2' : ''} ${
        accessibility.highContrast ? 'contrast-125' : ''
      }`}
    >
      {/* Dynamic Particle Background */}
      <ParticleBackground />

      {/* Main Refined Header (Hidden in Full-Screen Synks View) */}
      {activeTab !== 'reels' && <Header />}

      {/* Primary Tab Content Viewport */}
      <main className={activeTab === 'reels' ? 'w-full h-full relative z-10' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 relative z-10 pb-20'}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Clean Bottom Navigation Bar (Hidden in Full-Screen Synks View) */}
      {activeTab !== 'reels' && <BottomNav />}

      {/* Floating Draggable AI Assistant Bubble & Sheet */}
      <FloatingAiAssistant />

      {/* Civic Reporting Modal */}
      <AnimatePresence>
        {isReportingModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 16 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <CivicReporting onClose={() => setReportingModalOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SYNKS Creator Studio Modal / Overlay */}
      <AnimatePresence>
        {isCreatorStudioOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="min-h-full"
            >
              <CreatorStudio onClose={() => setCreatorStudioOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auxiliary Modals & Drawers */}
      <RewardsModal />
      <UserProfileModal />
      <CreatorProfileModal />
      <LocationPickerModal />
      <SemanticSearchModal />
      <AccessibilityDrawer />
      <AuthModal />
      <SettingsModal />
      <NotificationsModal />
    </div>
  );
}

export default App;
