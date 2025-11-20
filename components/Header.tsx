
import React, { useState } from 'react';
import { 
  Menu, PlusCircle, MessageSquare, Wallet, LogOut, LayoutDashboard, 
  Search, User as UserIcon, X, Home 
} from 'lucide-react';
import { User, ActiveMode } from '../types';

interface HeaderProps {
  setView: (view: string) => void;
  currentView: string;
  currentUser: User | null;
  activeMode: ActiveMode;
  onSwitchMode: (mode: ActiveMode) => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  setView, currentView, currentUser, activeMode, onSwitchMode, onLogout 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (view: string) => currentView === view;

  // --- DESKTOP HEADER (Hidden on Mobile) ---
  const renderDesktopHeader = () => (
    <header className="hidden md:block sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => setView('home')}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand to-brand-light flex items-center justify-center mr-2">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-brand">Renthubber</span>
          </div>

          {/* Desktop Nav */}
          {currentUser && (
            <nav className="flex items-center space-x-6">
               {/* Mode Switcher */}
               <div className="bg-gray-100 p-1 rounded-lg flex items-center mr-4">
                  <button 
                    onClick={() => onSwitchMode('renter')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${activeMode === 'renter' ? 'bg-white shadow text-brand' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Renter
                  </button>
                  <button 
                    onClick={() => onSwitchMode('hubber')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${activeMode === 'hubber' ? 'bg-white shadow text-brand-accent' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Hubber
                  </button>
               </div>

               <button 
                  onClick={() => setView('dashboard')}
                  className={`flex items-center text-sm font-medium transition-colors hover:text-brand ${currentView === 'dashboard' ? 'text-brand' : 'text-gray-500'}`}
                >
                  <LayoutDashboard className="w-4 h-4 mr-1.5" />
                  Dashboard
                </button>
                
                {activeMode === 'hubber' && (
                  <button 
                    onClick={() => setView('publish')}
                    className={`flex items-center text-sm font-medium transition-colors hover:text-brand ${currentView === 'publish' ? 'text-brand' : 'text-gray-500'}`}
                  >
                    <PlusCircle className="w-4 h-4 mr-1.5" />
                    Pubblica
                  </button>
                )}

                <button 
                  onClick={() => setView('messages')}
                  className={`flex items-center text-sm font-medium transition-colors hover:text-brand ${currentView === 'messages' ? 'text-brand' : 'text-gray-500'}`}
                >
                  <MessageSquare className="w-4 h-4 mr-1.5" />
                  Messaggi
                </button>
                <button 
                  onClick={() => setView('wallet')}
                  className={`flex items-center text-sm font-medium transition-colors hover:text-brand ${currentView === 'wallet' ? 'text-brand' : 'text-gray-500'}`}
                >
                  <Wallet className="w-4 h-4 mr-1.5" />
                  Wallet
                </button>
            </nav>
          )}

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-3 relative group">
                 <div className="flex flex-col items-end mr-1">
                    <span className="text-sm font-semibold text-gray-900">{currentUser.name}</span>
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${activeMode === 'hubber' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                      {activeMode}
                    </span>
                 </div>
                 
                 <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full pl-1 pr-1 py-1 cursor-pointer hover:shadow-md transition-shadow">
                    <Menu className="w-4 h-4 text-gray-600 mx-2" />
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.name} 
                      className="w-8 h-8 rounded-full object-cover border border-white shadow-sm" 
                    />
                 </div>
                 
                 {/* Desktop Dropdown */}
                 <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1 hidden group-hover:block">
                     {activeMode === 'hubber' && (
                       <button 
                         onClick={() => setView('my-listings')}
                         className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                       >
                          <PlusCircle className="w-4 h-4 mr-2" /> I miei annunci
                       </button>
                     )}
                     <button 
                       onClick={() => setView('wallet')}
                       className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                       >
                        <Wallet className="w-4 h-4 mr-2" /> Wallet
                     </button>
                     {currentUser.roles.includes('admin') && (
                       <button 
                         onClick={() => setView('admin')}
                         className="w-full text-left px-4 py-2 text-sm text-gray-800 font-bold bg-gray-50 hover:bg-gray-100 flex items-center"
                       >
                          <LayoutDashboard className="w-4 h-4 mr-2" /> Pannello Admin
                       </button>
                     )}
                     <button 
                       onClick={onLogout}
                       className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                     >
                        <LogOut className="w-4 h-4 mr-2" /> Esci
                     </button>
                 </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setView('signup')}
                  className="text-gray-600 hover:text-brand font-medium text-sm"
                >
                  Accedi
                </button>
                <button 
                  onClick={() => setView('signup')}
                  className="bg-brand hover:bg-brand-dark text-white text-sm font-bold py-2 px-4 rounded-full transition-all shadow-md hover:shadow-lg"
                >
                  Registrati
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );

  // --- MOBILE NAVIGATION ---
  
  // 1. Top Bar (Logo Only)
  const renderMobileTopBar = () => (
    <div className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100 px-4 h-14 flex items-center justify-center shadow-sm">
       <div className="flex items-center text-brand font-bold text-lg" onClick={() => setView('home')}>
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-brand to-brand-light flex items-center justify-center mr-2">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          Renthubber
       </div>
    </div>
  );

  // 2. Bottom Tab Bar (Logged In)
  const renderMobileBottomBar = () => {
    if (!currentUser) return null;

    return (
      <>
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 h-[72px] pb-safe flex justify-around items-center shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
          <button
            onClick={() => setView('home')}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive('home') ? 'text-brand' : 'text-gray-400'}`}
          >
            <Search className={`w-6 h-6 ${isActive('home') ? 'stroke-[2.5px]' : ''}`} />
            <span className="text-[10px] font-medium">Esplora</span>
          </button>

          <button
            onClick={() => setView('dashboard')}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive('dashboard') ? 'text-brand' : 'text-gray-400'}`}
          >
            <LayoutDashboard className={`w-6 h-6 ${isActive('dashboard') ? 'stroke-[2.5px]' : ''}`} />
            <span className="text-[10px] font-medium">Dash</span>
          </button>

          {/* Center Action Button */}
          {activeMode === 'hubber' ? (
             <button
                onClick={() => setView('publish')}
                className="flex flex-col items-center justify-center w-full h-full -mt-5"
             >
                <div className={`p-3 rounded-full shadow-lg transition-transform active:scale-95 ${isActive('publish') ? 'bg-brand text-white ring-4 ring-brand/20' : 'bg-brand text-white'}`}>
                   <PlusCircle className="w-7 h-7" />
                </div>
                <span className="text-[10px] font-medium text-gray-500 mt-1">Pubblica</span>
             </button>
          ) : (
            <div className="w-full pointer-events-none"></div> 
          )}

          <button
            onClick={() => setView('messages')}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive('messages') ? 'text-brand' : 'text-gray-400'}`}
          >
            <MessageSquare className={`w-6 h-6 ${isActive('messages') ? 'stroke-[2.5px]' : ''}`} />
            <span className="text-[10px] font-medium">Chat</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(true)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${mobileMenuOpen ? 'text-brand' : 'text-gray-400'}`}
          >
            <div className="relative">
               <img src={currentUser.avatar} alt="Profile" className="w-6 h-6 rounded-full border border-gray-200" />
               <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${activeMode === 'hubber' ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
            </div>
            <span className="text-[10px] font-medium">Menu</span>
          </button>
        </nav>

        {/* 3. Mobile Menu Overlay */}
        {mobileMenuOpen && (
           <div className="fixed inset-0 z-[60] bg-black/60 md:hidden animate-in fade-in" onClick={() => setMobileMenuOpen(false)}>
              <div 
                className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 pb-8 shadow-2xl animate-in slide-in-from-bottom duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                 {/* Menu Header */}
                 <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                       <img src={currentUser.avatar} className="w-14 h-14 rounded-full mr-4 border-2 border-gray-100" alt="" />
                       <div>
                          <h3 className="font-bold text-xl text-gray-900">{currentUser.name}</h3>
                          <p className="text-xs text-gray-500 font-medium">{currentUser.email}</p>
                       </div>
                    </div>
                    <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                       <X className="w-6 h-6 text-gray-600" />
                    </button>
                 </div>

                 {/* Role Switcher */}
                 <div className="bg-gray-100 p-1.5 rounded-2xl flex mb-8">
                    <button
                      onClick={() => { onSwitchMode('renter'); setMobileMenuOpen(false); }}
                      className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all shadow-sm flex items-center justify-center ${activeMode === 'renter' ? 'bg-white text-brand' : 'text-gray-500 hover:bg-gray-200/50'}`}
                    >
                      <UserIcon className="w-4 h-4 mr-2" /> Renter
                    </button>
                    <button
                      onClick={() => { onSwitchMode('hubber'); setMobileMenuOpen(false); }}
                      className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all shadow-sm flex items-center justify-center ${activeMode === 'hubber' ? 'bg-white text-brand-accent' : 'text-gray-500 hover:bg-gray-200/50'}`}
                    >
                      <PlusCircle className="w-4 h-4 mr-2" /> Hubber
                    </button>
                 </div>

                 {/* Menu Items */}
                 <div className="space-y-3">
                    {activeMode === 'hubber' && (
                       <button 
                         onClick={() => { setView('my-listings'); setMobileMenuOpen(false); }} 
                         className="w-full flex items-center p-4 bg-gray-50 rounded-2xl font-bold text-gray-700 hover:bg-gray-100 active:scale-[0.98] transition-all"
                       >
                          <div className="bg-white p-2 rounded-lg mr-4 shadow-sm"><LayoutDashboard className="w-5 h-5 text-brand" /></div>
                          I miei Annunci
                       </button>
                    )}
                    
                    <button 
                      onClick={() => { setView('wallet'); setMobileMenuOpen(false); }} 
                      className="w-full flex items-center p-4 bg-gray-50 rounded-2xl font-bold text-gray-700 hover:bg-gray-100 active:scale-[0.98] transition-all"
                    >
                       <div className="bg-white p-2 rounded-lg mr-4 shadow-sm"><Wallet className="w-5 h-5 text-brand" /></div>
                       Wallet & Pagamenti
                    </button>

                    {currentUser.roles.includes('admin') && (
                       <button 
                         onClick={() => { setView('admin'); setMobileMenuOpen(false); }} 
                         className="w-full flex items-center p-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 active:scale-[0.98] transition-all"
                       >
                          <div className="bg-white/20 p-2 rounded-lg mr-4"><LayoutDashboard className="w-5 h-5 text-white" /></div>
                          Pannello Admin
                       </button>
                    )}
                    
                    <button 
                      onClick={onLogout} 
                      className="w-full flex items-center p-4 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 active:scale-[0.98] transition-all mt-6"
                    >
                       <div className="bg-white p-2 rounded-lg mr-4 shadow-sm"><LogOut className="w-5 h-5 text-red-500" /></div>
                       Esci
                    </button>
                 </div>
                 
                 <div className="mt-8 text-center">
                    <p className="text-xs text-gray-400 font-medium">Renthubber v1.0</p>
                 </div>
              </div>
           </div>
        )}
      </>
    );
  };

  // 3. Bottom Action Bar for Guest Users (Logged Out)
  const renderMobileGuestBar = () => {
    if (currentUser) return null;

    return (
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 px-4 py-3 flex gap-3 shadow-[0_-4px_15px_rgba(0,0,0,0.05)] pb-safe">
         <button 
           onClick={() => setView('signup')}
           className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors"
         >
           Accedi
         </button>
         <button 
           onClick={() => setView('signup')}
           className="flex-1 py-3 rounded-xl bg-brand text-white font-bold text-sm shadow-lg hover:bg-brand-dark transition-colors"
         >
           Registrati
         </button>
      </div>
    );
  };

  return (
    <>
      {renderDesktopHeader()}
      {renderMobileTopBar()}
      {renderMobileBottomBar()}
      {renderMobileGuestBar()}
    </>
  );
};
