
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './views/Home';
import { Publish } from './views/Publish';
import { Wallet } from './views/Wallet';
import { Messages } from './views/Messages';
import { ListingDetail } from './views/ListingDetail';
import { Signup } from './views/Signup';
import { Dashboard } from './views/Dashboard';
import { MyListings } from './views/MyListings';
import { HubberListingEditor } from './views/HubberListingEditor';
import { AdminDashboard } from './views/AdminDashboard';
import { BecomeHubberWizard } from './views/BecomeHubberWizard';
import { PublicHostProfile } from './views/PublicHostProfile'; // New View
import { Listing, User, SystemConfig, ActiveMode, PayoutRequest } from './types';
import { MOCK_LISTINGS, DEFAULT_SYSTEM_CONFIG, DEMO_RENTER, DEMO_HUBBER, DEMO_ADMIN } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [selectedHost, setSelectedHost] = useState<User | null>(null); // State for host profile
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [listings, setListings] = useState<Listing[]>(MOCK_LISTINGS);
  
  // GLOBAL CONFIG & MODE STATE
  const [systemConfig, setSystemConfig] = useState<SystemConfig>(DEFAULT_SYSTEM_CONFIG);
  const [activeMode, setActiveMode] = useState<ActiveMode>('renter');
  
  // PAYOUT REQUESTS STATE
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>([]);

  // --- AUTOMATIC SCROLL TO TOP ---
  // Resets scroll position whenever the view changes (Essential for Mobile UX)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  // Sync active mode when logging in
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (user.roles.includes('admin')) {
      setCurrentView('admin');
    } else if (user.roles.includes('hubber')) {
      setActiveMode('hubber');
      setCurrentView('dashboard');
    } else {
      setActiveMode('renter');
      setCurrentView('dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('home');
    setActiveMode('renter');
  };

  const handleAddListing = (newListing: Listing) => {
    setListings([newListing, ...listings]);
    setCurrentView('my-listings');
  };

  const handleUpdateListing = (updatedListing: Listing) => {
    setListings(prevListings => 
      prevListings.map(l => l.id === updatedListing.id ? updatedListing : l)
    );
    // Update selectedListing if it's the one currently being viewed
    if (selectedListing?.id === updatedListing.id) {
      setSelectedListing(updatedListing);
    }
    // Do not force view change if in admin dashboard
    if (currentView === 'my-listings') {
        setCurrentView('my-listings');
    }
  };

  const handleUpdateConfig = (newConfig: SystemConfig) => {
    setSystemConfig(newConfig);
  };

  const handlePayment = (amount: number, useWallet: number) => {
    if (currentUser) {
      const newBalance = currentUser.renterBalance - useWallet;
      setCurrentUser({
        ...currentUser,
        renterBalance: newBalance
      });
    }
  };

  const handleListingClick = (listing: Listing) => {
    setSelectedListing(listing);
    setCurrentView('detail');
  };

  const handleHostClick = (host: User) => {
    setSelectedHost(host);
    setCurrentView('host-profile');
  };

  const handleEditListingClick = (listing: Listing) => {
    setEditingListing(listing);
    setCurrentView('hubber-edit');
  };

  // Switch role mode (Renter <-> Hubber)
  const handleSwitchMode = (mode: ActiveMode) => {
    if (!currentUser) return;
    if (mode === 'hubber' && !currentUser.roles.includes('hubber')) {
       setCurrentView('become-hubber');
       return;
    }
    setActiveMode(mode);
    if (currentView === 'dashboard' || currentView === 'wallet' || currentView === 'my-listings') {
        setCurrentView('dashboard');
    }
  };

  const handleHubberActivation = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    setActiveMode('hubber');
    setCurrentView('dashboard');
  };

  const handleUserUpdate = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  // HANDLE PAYOUT REQUEST FROM HUBBER
  const handleRequestPayout = (amount: number) => {
    if (!currentUser || !currentUser.bankDetails) return;
    
    const newRequest: PayoutRequest = {
      id: `payout-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      amount: amount,
      iban: currentUser.bankDetails.iban,
      status: 'pending',
      date: new Date().toLocaleDateString('it-IT')
    };
    
    setPayoutRequests([newRequest, ...payoutRequests]);
  };

  // HANDLE ADMIN PROCESSING PAYOUT
  const handleProcessPayout = (requestId: string, approved: boolean) => {
    setPayoutRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: approved ? 'approved' : 'rejected' } : req
    ));

    if (approved) {
      // Find request to get user and amount
      const request = payoutRequests.find(r => r.id === requestId);
      if (request) {
        if (currentUser && currentUser.id === request.userId) {
           setCurrentUser({
             ...currentUser,
             hubberBalance: currentUser.hubberBalance - request.amount
           });
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-gray-50 pb-[80px] md:pb-0">
      
      {currentView !== 'admin' && currentView !== 'become-hubber' && currentView !== 'hubber-edit' && (
        <Header 
          setView={setCurrentView} 
          currentView={currentView}
          currentUser={currentUser}
          activeMode={activeMode}
          onSwitchMode={handleSwitchMode}
          onLogout={handleLogout}
        />
      )}

      <main className="flex-grow">
        {currentView === 'home' && (
          <Home 
            onListingClick={handleListingClick} 
            listings={listings}
          />
        )}

        {currentView === 'detail' && selectedListing && (
          <ListingDetail 
            listing={selectedListing} 
            currentUser={currentUser}
            onBack={() => setCurrentView('home')}
            systemConfig={systemConfig}
            onPaymentSuccess={handlePayment}
            onHostClick={handleHostClick}
          />
        )}

        {currentView === 'host-profile' && selectedHost && (
          <PublicHostProfile 
             host={selectedHost}
             listings={listings}
             onBack={() => setCurrentView('detail')}
             onListingClick={handleListingClick}
          />
        )}

        {currentView === 'publish' && currentUser && (
          <Publish 
            onPublish={handleAddListing} 
            currentUser={currentUser}
          />
        )}

        {currentView === 'hubber-edit' && editingListing && (
          <HubberListingEditor
            listing={editingListing}
            onSave={handleUpdateListing}
            onCancel={() => setCurrentView('my-listings')}
          />
        )}
        
        {currentView === 'signup' && (
          <Signup 
            onComplete={handleLogin}
            onLoginRedirect={() => {}} 
          />
        )}

        {currentView === 'dashboard' && currentUser && (
          <Dashboard 
            user={currentUser} 
            activeMode={activeMode}
            onManageListings={activeMode === 'hubber' 
              ? () => setCurrentView('my-listings') 
              : () => setCurrentView('become-hubber')
            }
          />
        )}

        {currentView === 'wallet' && currentUser && (
          <Wallet 
            currentUser={currentUser} 
            activeMode={activeMode}
            systemConfig={systemConfig}
            onUpdateUser={handleUserUpdate}
            onRequestPayout={handleRequestPayout}
          />
        )}

        {currentView === 'messages' && (
          <Messages />
        )}

        {currentView === 'my-listings' && currentUser && (
          <MyListings 
            currentUser={currentUser} 
            listings={listings}
            onCreateNew={() => setCurrentView('publish')}
            onEditListing={handleEditListingClick}
          />
        )}

        {currentView === 'admin' && (
           <AdminDashboard 
              systemConfig={systemConfig}
              onUpdateConfig={handleUpdateConfig}
              allUsers={[currentUser || DEMO_ADMIN, DEMO_RENTER, DEMO_HUBBER]} 
              allListings={listings}
              payoutRequests={payoutRequests}
              onProcessPayout={handleProcessPayout}
              onUpdateListing={handleUpdateListing}
           />
        )}

        {currentView === 'become-hubber' && currentUser && (
           <BecomeHubberWizard 
              currentUser={currentUser}
              onComplete={handleHubberActivation}
              onCancel={() => setCurrentView('dashboard')}
           />
        )}
      </main>

      {/* Show footer only on desktop or if user is not logged in (to avoid clutter on mobile app view) */}
      <div className="hidden md:block">
         {currentView !== 'admin' && currentView !== 'become-hubber' && currentView !== 'hubber-edit' && <Footer />}
      </div>
      
      {/* Mobile Footer for logged out users */}
      {!currentUser && (
         <div className="md:hidden">
             {currentView !== 'admin' && currentView !== 'become-hubber' && currentView !== 'hubber-edit' && <Footer />}
         </div>
      )}
    </div>
  );
};

export default App;
