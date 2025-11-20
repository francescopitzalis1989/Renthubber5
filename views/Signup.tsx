
import React, { useState } from 'react';
import { User, Briefcase, Check, Upload, ShieldCheck, ArrowRight, ChevronLeft, Camera, LogIn, Gift, Lock } from 'lucide-react';
import { User as UserType } from '../types';
import { DEMO_RENTER, DEMO_HUBBER, DEMO_ADMIN } from '../constants';

interface SignupProps {
  onComplete: (user: UserType) => void;
  onLoginRedirect: () => void; // Legacy prop, kept for compatibility but unused in new logic
}

type Step = 'role' | 'info' | 'kyc' | 'success' | 'login';
type Role = 'renter' | 'hubber' | null;

export const Signup: React.FC<SignupProps> = ({ onComplete }) => {
  const [step, setStep] = useState<Step>('role');
  const [role, setRole] = useState<Role>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    referralCode: '',
  });

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const handleRoleSelect = (selectedRole: Role) => {
    setRole(selectedRole);
    setStep('info');
  };

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('kyc');
  };

  const handleKycSubmit = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setStep('success');
  };

  const handleFinalizeSignup = () => {
     // Create a new user object based on form data
     const newUser: UserType = {
        id: 'new_user_' + Date.now(),
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        avatar: `https://ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName}&background=0D414B&color=fff`,
        rating: 0,
        isSuperHubber: false,
        role: role || 'renter',
        roles: role === 'hubber' ? ['renter', 'hubber'] : ['renter'],
        // Simula l'applicazione del bonus se è stato inserito un codice
        renterBalance: formData.referralCode ? 10.00 : 0, 
        hubberBalance: 0,
        referralCode: (formData.firstName.substring(0, 3) + Date.now().toString().slice(-3)).toUpperCase()
     };
     onComplete(newUser);
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock auth logic
    if (loginEmail === DEMO_ADMIN.email) {
      onComplete(DEMO_ADMIN);
    } else if (loginEmail === DEMO_HUBBER.email) {
      onComplete(DEMO_HUBBER);
    } else if (loginEmail === DEMO_RENTER.email) {
      onComplete(DEMO_RENTER);
    } else {
       alert("Utente non trovato. Usa i pulsanti Demo o registrati.");
    }
  };

  // --- RENDER STEPS ---

  // STEP LOGIN
  const renderLogin = () => (
    <div className="max-w-md mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
       <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-brand-dark mb-2">Bentornato!</h2>
        <p className="text-gray-500">Accedi al tuo account Renthubber.</p>
      </div>

      {/* DEMO LOGIN BUTTONS */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6">
         <p className="text-xs font-bold text-indigo-800 text-center mb-3 uppercase tracking-wide">Area Sviluppo / Demo Rapida</p>
         <div className="grid grid-cols-3 gap-2">
            <button 
               onClick={() => onComplete(DEMO_ADMIN)}
               className="bg-gray-900 text-white text-xs font-bold py-2 px-2 rounded-lg hover:bg-gray-800 transition-colors flex flex-col items-center justify-center"
            >
               <Lock className="w-4 h-4 mb-1" /> Admin
            </button>
            <button 
               onClick={() => onComplete(DEMO_HUBBER)}
               className="bg-white border border-indigo-200 text-indigo-900 text-xs font-bold py-2 px-2 rounded-lg hover:bg-indigo-100 transition-colors flex flex-col items-center justify-center"
            >
               <Briefcase className="w-4 h-4 mb-1" /> Hubber
            </button>
            <button 
               onClick={() => onComplete(DEMO_RENTER)}
               className="bg-white border border-indigo-200 text-indigo-900 text-xs font-bold py-2 px-2 rounded-lg hover:bg-indigo-100 transition-colors flex flex-col items-center justify-center"
            >
               <User className="w-4 h-4 mb-1" /> Renter
            </button>
         </div>
      </div>

      <form onSubmit={handleManualLogin} className="space-y-4">
         <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
              placeholder="admin@renthubber.com"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
         </div>
         <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
              placeholder="••••••••"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
         </div>
         <button type="submit" className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center">
            Accedi <LogIn className="w-4 h-4 ml-2" />
         </button>
      </form>

      <div className="text-center mt-8 pt-6 border-t border-gray-100">
         <p className="text-sm text-gray-500">
            Non hai ancora un account? 
            <button onClick={() => setStep('role')} className="ml-1 font-bold text-brand hover:underline">
               Registrati
            </button>
         </p>
      </div>
    </div>
  );

  // STEP 1: ROLE SELECTION
  const renderRoleSelection = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-brand-dark mb-2">Benvenuto su Renthubber</h2>
        <p className="text-gray-500">Come vuoi utilizzare la piattaforma oggi?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card RENTER */}
        <div 
          onClick={() => handleRoleSelect('renter')}
          className="group cursor-pointer relative bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-brand hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center"
        >
          <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-brand group-hover:text-white transition-colors">
            <User className="w-10 h-10 text-brand group-hover:text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Renter</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Voglio noleggiare oggetti e spazi.<br/>
            Risparmio, evito sprechi e trovo ciò che mi serve, quando serve.
          </p>
          <div className="mt-6 flex items-center text-brand font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
            Inizia a noleggiare <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </div>

        {/* Card HUBBER */}
        <div 
          onClick={() => handleRoleSelect('hubber')}
          className="group cursor-pointer relative bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-brand-accent hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center"
        >
          <div className="absolute top-4 right-4 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
            Guadagna
          </div>
          <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center mb-6 group-hover:bg-brand-accent group-hover:text-white transition-colors">
            <Briefcase className="w-10 h-10 text-brand-accent group-hover:text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Hubber</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Voglio pubblicare annunci.<br/>
            Metto a rendita i miei oggetti o i miei spazi in totale sicurezza.
          </p>
          <div className="mt-6 flex items-center text-brand-accent font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
            Inizia a guadagnare <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </div>
      </div>

      <div className="text-center mt-8 text-sm text-gray-500">
         Hai già un account? 
         <button onClick={() => setStep('login')} className="ml-1 font-bold text-brand hover:underline">
            Accedi qui
         </button>
      </div>
    </div>
  );

  // STEP 2: PERSONAL INFO
  const renderInfoForm = () => (
    <div className="max-w-md mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
      <button onClick={() => setStep('role')} className="text-gray-400 hover:text-gray-600 mb-6 flex items-center text-sm">
        <ChevronLeft className="w-4 h-4 mr-1" /> Indietro
      </button>
      
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-brand-dark">
          Crea il tuo account {role === 'hubber' ? 'Hubber' : 'Renter'}
        </h2>
        <p className="text-gray-500 text-sm mt-2">
          Inserisci i tuoi dati per accedere a Renthubber.
        </p>
      </div>

      <form onSubmit={handleInfoSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input 
              type="text" required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all"
              placeholder="Mario"
              value={formData.firstName}
              onChange={e => setFormData({...formData, firstName: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cognome</label>
            <input 
              type="text" required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all"
              placeholder="Rossi"
              value={formData.lastName}
              onChange={e => setFormData({...formData, lastName: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="email" required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all"
            placeholder="mario.rossi@example.com"
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input 
            type="password" required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all"
            placeholder="••••••••"
            value={formData.password}
            onChange={e => setFormData({...formData, password: e.target.value})}
          />
          <p className="text-xs text-gray-400 mt-1">Minimo 8 caratteri, una maiuscola e un numero.</p>
        </div>

        {/* REFERRAL CODE INPUT */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Codice Invito (Opzionale)</label>
          <div className="relative">
             <div className="absolute left-3 top-3 text-brand-accent pointer-events-none">
                <Gift className="w-5 h-5" />
             </div>
             <input 
               type="text"
               className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all uppercase font-medium tracking-wider"
               placeholder="Es. MARIO24"
               value={formData.referralCode}
               onChange={e => setFormData({...formData, referralCode: e.target.value.toUpperCase()})}
             />
          </div>
          <p className="text-xs text-gray-500 mt-1">Hai un codice amico? Inseriscilo per ricevere un bonus di benvenuto.</p>
        </div>

        <div className="pt-4">
          <button type="submit" className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center">
            Continua <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
        
        <div className="text-center mt-4 text-sm text-gray-500">
         Già registrato?
         <button type="button" onClick={() => setStep('login')} className="ml-1 font-bold text-brand hover:underline">
            Accedi
         </button>
      </div>
      </form>
    </div>
  );

  // STEP 3: KYC VERIFICATION
  const renderKyc = () => (
    <div className="max-w-md mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8 text-brand" />
        </div>
        <h2 className="text-2xl font-bold text-brand-dark">Verifica la tua identità</h2>
        <p className="text-gray-500 text-sm mt-2">
          Per garantire la sicurezza della community, richiediamo un documento di identità valido.
        </p>
      </div>

      <div className="space-y-6">
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer group">
          <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
            <Camera className="w-6 h-6 text-brand" />
          </div>
          <h4 className="font-semibold text-gray-900">Fronte Documento</h4>
          <p className="text-xs text-gray-400">Carta d'identità, Patente o Passaporto</p>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer group">
          <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
            <Upload className="w-6 h-6 text-brand" />
          </div>
          <h4 className="font-semibold text-gray-900">Retro Documento</h4>
          <p className="text-xs text-gray-400">Assicurati che sia leggibile</p>
        </div>

        <button 
          onClick={handleKycSubmit}
          disabled={isLoading}
          className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center disabled:opacity-70"
        >
          {isLoading ? (
            <span className="animate-pulse">Verifica in corso...</span>
          ) : (
            <>Completa Registrazione <ShieldCheck className="w-4 h-4 ml-2" /></>
          )}
        </button>
        
        <button onClick={() => setStep('info')} className="w-full text-gray-500 text-sm py-2 hover:text-brand">
          Lo farò più tardi (Accesso limitato)
        </button>
      </div>
    </div>
  );

  // STEP 4: SUCCESS
  const renderSuccess = () => (
    <div className="text-center max-w-md mx-auto animate-in zoom-in duration-500 py-12">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Check className="w-12 h-12 text-green-600" />
      </div>
      <h2 className="text-3xl font-bold text-brand-dark mb-4">Benvenuto a bordo, {formData.firstName}!</h2>
      <p className="text-gray-600 mb-8">
        Il tuo account {role === 'hubber' ? 'Hubber' : 'Renter'} è attivo. 
        {role === 'hubber' 
          ? ' Puoi iniziare subito a pubblicare i tuoi primi annunci.'
          : ' Inizia subito a cercare l\'oggetto o lo spazio perfetto.'}
        {formData.referralCode && (
           <span className="block mt-2 font-semibold text-brand-accent">
              Bonus Benvenuto di €10.00 accreditato! 🎉
           </span>
        )}
      </p>
      
      <button 
        onClick={handleFinalizeSignup}
        className="bg-brand text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
      >
        Vai alla Homepage
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        {/* Header semplificato per signup */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand to-brand-light flex items-center justify-center mr-3">
              <span className="text-white font-bold text-2xl">R</span>
            </div>
            <span className="font-bold text-3xl tracking-tight text-brand">Renthubber</span>
          </div>
        </div>

        {/* Progress Bar (only for form steps) */}
        {step !== 'role' && step !== 'success' && step !== 'login' && (
           <div className="max-w-md mx-auto mb-8">
             <div className="flex justify-between mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
               <span className={step === 'info' || step === 'kyc' ? 'text-brand' : ''}>Dati</span>
               <span className={step === 'kyc' ? 'text-brand' : ''}>Verifica</span>
               <span>Fatto</span>
             </div>
             <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
               <div 
                 className="h-full bg-brand transition-all duration-500 ease-out"
                 style={{ width: step === 'info' ? '33%' : step === 'kyc' ? '66%' : '100%' }}
               ></div>
             </div>
           </div>
        )}

        {/* Content Area */}
        {step === 'role' && renderRoleSelection()}
        {step === 'login' && renderLogin()}
        {step === 'info' && renderInfoForm()}
        {step === 'kyc' && renderKyc()}
        {step === 'success' && renderSuccess()}

      </div>
    </div>
  );
};
