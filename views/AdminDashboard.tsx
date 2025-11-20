
import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, Package, Shield, Settings, FileText, 
  TrendingUp, AlertTriangle, Search, Ban, DollarSign, CheckCircle, XCircle, 
  Activity, Lock, Save, Landmark, X, Bell, Image as ImageIcon, Globe
} from 'lucide-react';
import { User, Listing, SystemConfig, AuditLog, BankDetails, PayoutRequest } from '../types';
import { MOCK_AUDIT_LOGS } from '../constants';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area
} from 'recharts';
import { AdminListingManager } from './AdminListingManager';

interface AdminDashboardProps {
  systemConfig: SystemConfig;
  onUpdateConfig: (newConfig: SystemConfig) => void;
  allUsers: User[]; 
  allListings: Listing[];
  payoutRequests?: PayoutRequest[];
  onProcessPayout?: (requestId: string, approved: boolean) => void;
  onUpdateListing?: (listing: Listing) => void; 
}

// --- SUB-COMPONENTS ---

const KpiCard: React.FC<{title: string, value: string, subtext?: string, icon: React.ElementType, color: string}> = ({ title, value, subtext, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
        {subtext && <p className={`text-xs mt-2 font-semibold ${subtext.startsWith('+') ? 'text-green-600' : 'text-gray-400'}`}>{subtext}</p>}
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

// --- MAIN DASHBOARD ---

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  systemConfig, onUpdateConfig, allUsers, allListings, 
  payoutRequests = [], onProcessPayout, onUpdateListing 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'listings' | 'finance' | 'config' | 'cms' | 'brand'>('overview');
  
  // Local state for editing config
  const [configForm, setConfigForm] = useState<SystemConfig>(systemConfig);

  // Bank Details Modal State
  const [selectedBankDetails, setSelectedBankDetails] = useState<{details: BankDetails, userName: string} | null>(null);
  
  // Mock data for charts
  const chartData = [
    { name: 'Lun', users: 12, revenue: 150 },
    { name: 'Mar', users: 19, revenue: 230 },
    { name: 'Mer', users: 3, revenue: 45 },
    { name: 'Gio', users: 25, revenue: 320 },
    { name: 'Ven', users: 40, revenue: 500 },
    { name: 'Sab', users: 55, revenue: 650 },
    { name: 'Dom', users: 48, revenue: 580 },
  ];

  const handleSaveConfig = () => {
    onUpdateConfig(configForm);
    alert("Configurazione aggiornata! Le modifiche sono ora attive su tutta la piattaforma.");
  };

  const handleViewBankDetails = (user: User) => {
    if (user.bankDetails) {
      setSelectedBankDetails({
        details: user.bankDetails,
        userName: user.name
      });
    } else {
      alert(`Nessun dato bancario presente per ${user.name}.`);
    }
  };

  // --- VIEWS RENDERERS ---

  const renderOverview = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Utenti Totali" value={allUsers.length > 2 ? allUsers.length.toString() : "1,240"} subtext="+12% questo mese" icon={Users} color="bg-blue-500" />
        <KpiCard title="Annunci Attivi" value={allListings.length.toString()} subtext="+5 questa settimana" icon={Package} color="bg-orange-500" />
        <KpiCard title="Fatturato (Fee)" value="€ 3,450" subtext="+8% vs mese scorso" icon={TrendingUp} color="bg-green-500" />
        <KpiCard title="Richieste Payout" value={payoutRequests.filter(r => r.status === 'pending').length.toString()} subtext="In attesa" icon={DollarSign} color="bg-yellow-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6">Revenue Trend</h3>
          <div className="h-72">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                   <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                         <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} />
                   <YAxis axisLine={false} tickLine={false} />
                   <Tooltip />
                   <Area type="monotone" dataKey="revenue" stroke="#10B981" fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
             </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
           <h3 className="font-bold text-gray-900 mb-4">Audit Log Recenti</h3>
           <div className="space-y-4 overflow-y-auto max-h-80">
              {MOCK_AUDIT_LOGS.map(log => (
                 <div key={log.id} className="flex items-start text-sm border-b border-gray-50 pb-3 last:border-0">
                    <div className="bg-gray-100 p-1.5 rounded-full mr-3 mt-0.5">
                       <Activity className="w-3 h-3 text-gray-500" />
                    </div>
                    <div>
                       <p className="font-semibold text-gray-900">{log.action}</p>
                       <p className="text-xs text-gray-500">{log.details}</p>
                       <p className="text-[10px] text-gray-400 mt-1">{log.timestamp} da <span className="font-medium">{log.adminName}</span></p>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
         <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Cerca utente..." className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand outline-none" />
         </div>
         <div className="flex gap-2">
            <button className="px-4 py-2 bg-brand text-white text-sm font-bold rounded-lg">Esporta CSV</button>
         </div>
      </div>
      <table className="w-full text-left text-sm text-gray-600">
        <thead className="bg-gray-50 text-gray-900 font-semibold border-b border-gray-100">
          <tr>
             <th className="p-4">Utente</th>
             <th className="p-4">Ruolo</th>
             <th className="p-4">Dati Bancari</th>
             <th className="p-4">Rating</th>
             <th className="p-4 text-right">Azioni</th>
          </tr>
        </thead>
        <tbody>
           {allUsers.map((user) => (
             <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="p-4 flex items-center">
                   <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full mr-3" />
                   <div>
                      <p className="font-bold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email || 'No email'}</p>
                   </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold capitalize ${user.roles.includes('admin') ? 'bg-gray-800 text-white' : user.roles.includes('hubber') ? 'bg-orange-50 text-orange-700' : 'bg-blue-50 text-blue-700'}`}>
                    {user.roles.includes('admin') ? 'ADMIN' : user.roles.includes('hubber') ? 'HUBBER' : 'RENTER'}
                  </span>
                </td>
                <td className="p-4">
                  {user.bankDetails ? (
                    <button 
                      onClick={() => handleViewBankDetails(user)}
                      className="text-blue-600 hover:text-blue-800 text-xs font-bold flex items-center"
                    >
                      <Landmark className="w-3 h-3 mr-1" /> Vedi Dati
                    </button>
                  ) : (
                    <span className="text-gray-400 text-xs italic">Non presenti</span>
                  )}
                </td>
                <td className="p-4">{user.rating || 'N/A'}</td>
                <td className="p-4 text-right">
                   <button className="text-red-600 hover:bg-red-50 p-2 rounded-lg" title="Sospendi"><Ban className="w-4 h-4" /></button>
                   <button className="text-gray-600 hover:bg-gray-100 p-2 rounded-lg" title="Modifica"><Settings className="w-4 h-4" /></button>
                </td>
             </tr>
           ))}
        </tbody>
      </table>
    </div>
  );

  const renderFinance = () => (
     <div className="space-y-6 animate-in fade-in">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
           <h3 className="text-lg font-bold text-gray-900 mb-4">Richieste di Bonifico (Payout)</h3>
           <p className="text-sm text-gray-500 mb-6">Approva i pagamenti verso gli Hubber. Una volta approvato, l'importo verrà scalato dal saldo.</p>
           
           {payoutRequests.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                 <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                 <p className="text-gray-500">Nessuna richiesta di payout in attesa.</p>
              </div>
           ) : (
              <table className="w-full text-left text-sm text-gray-600">
                 <thead className="bg-gray-50 text-gray-900 font-semibold border-b border-gray-100">
                    <tr>
                       <th className="p-4">Hubber</th>
                       <th className="p-4">Importo</th>
                       <th className="p-4">IBAN</th>
                       <th className="p-4">Data Richiesta</th>
                       <th className="p-4">Stato</th>
                       <th className="p-4 text-right">Azioni</th>
                    </tr>
                 </thead>
                 <tbody>
                    {payoutRequests.map((req) => (
                       <tr key={req.id} className="border-b border-gray-50">
                          <td className="p-4 font-medium text-gray-900">{req.userName}</td>
                          <td className="p-4 font-bold text-gray-900">€ {req.amount.toFixed(2)}</td>
                          <td className="p-4 font-mono text-xs">{req.iban}</td>
                          <td className="p-4">{req.date}</td>
                          <td className="p-4">
                             <span className={`px-2 py-1 rounded text-xs font-bold capitalize 
                                ${req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                  req.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {req.status === 'pending' ? 'In Attesa' : req.status === 'approved' ? 'Approvato' : 'Rifiutato'}
                             </span>
                          </td>
                          <td className="p-4 text-right">
                             {req.status === 'pending' && (
                                <div className="flex justify-end gap-2">
                                   <button 
                                      onClick={() => onProcessPayout && onProcessPayout(req.id, true)}
                                      className="bg-green-50 text-green-600 hover:bg-green-100 p-2 rounded-lg flex items-center font-bold text-xs"
                                      title="Approva e Invia"
                                   >
                                      <CheckCircle className="w-4 h-4 mr-1" /> Approva
                                   </button>
                                   <button 
                                      onClick={() => onProcessPayout && onProcessPayout(req.id, false)}
                                      className="bg-red-50 text-red-600 hover:bg-red-100 p-2 rounded-lg flex items-center font-bold text-xs"
                                      title="Rifiuta"
                                   >
                                      <XCircle className="w-4 h-4 mr-1" /> Rifiuta
                                   </button>
                                </div>
                             )}
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           )}
        </div>
     </div>
  );

  const renderConfig = () => (
     <div className="max-w-4xl animate-in fade-in slide-in-from-right-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
           <div className="mb-8 border-b border-gray-100 pb-6 flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Configurazioni Economiche & Regole</h2>
                <p className="text-gray-500 mt-1">Gestisci le fee della piattaforma e le regole di business.</p>
              </div>
              <button 
                onClick={handleSaveConfig}
                className="bg-brand text-white font-bold py-2 px-6 rounded-xl shadow-lg hover:bg-brand-dark transition-all flex items-center"
              >
                 <Save className="w-4 h-4 mr-2" /> Salva
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* FEES */}
              <div>
                 <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-brand" /> Commissioni Piattaforma
                 </h3>
                 <div className="space-y-4 bg-gray-50 p-6 rounded-xl">
                    <div>
                       <label className="block text-sm font-semibold text-gray-700 mb-2">Percentuale Base (%)</label>
                       <input 
                         type="number" 
                         value={configForm.fees.platformPercentage}
                         onChange={(e) => setConfigForm({...configForm, fees: {...configForm.fees, platformPercentage: parseFloat(e.target.value)}})}
                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand outline-none"
                       />
                    </div>
                    <div>
                       <label className="block text-sm font-semibold text-gray-700 mb-2">Costo Fisso (€)</label>
                       <input 
                         type="number" 
                         value={configForm.fees.fixedFeeEur}
                         onChange={(e) => setConfigForm({...configForm, fees: {...configForm.fees, fixedFeeEur: parseFloat(e.target.value)}})}
                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand outline-none"
                       />
                    </div>
                    <div className="flex items-center justify-between pt-2">
                       <span className="text-sm font-medium text-gray-700">Sconto SuperHubber (%)</span>
                       <input 
                         type="number" 
                         value={configForm.fees.superHubberDiscount}
                         onChange={(e) => setConfigForm({...configForm, fees: {...configForm.fees, superHubberDiscount: parseFloat(e.target.value)}})}
                         className="w-24 px-4 py-2 border border-gray-300 rounded-lg text-right"
                       />
                    </div>
                 </div>
              </div>

              {/* RULES & REFERRAL */}
              <div>
                 <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-brand" /> Regole & Referral
                 </h3>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 border border-gray-200 rounded-xl">
                       <div>
                          <p className="font-semibold text-gray-900">Referral System</p>
                          <p className="text-xs text-gray-500">Attiva/Disattiva bonus invito</p>
                       </div>
                       <div className="flex items-center gap-2">
                          <span className="text-sm font-bold mr-2">€ {configForm.referral.bonusAmount}</span>
                          <button 
                             onClick={() => setConfigForm({...configForm, referral: {...configForm.referral, isActive: !configForm.referral.isActive}})}
                             className={`w-12 h-6 rounded-full p-1 transition-colors ${configForm.referral.isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                          >
                             <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${configForm.referral.isActive ? 'translate-x-6' : ''}`} />
                          </button>
                       </div>
                    </div>
                    <div className="flex justify-between items-center p-4 border border-gray-200 rounded-xl">
                       <div>
                          <p className="font-semibold text-gray-900">Rating SuperHubber</p>
                       </div>
                       <input 
                         type="number" step="0.1"
                         value={configForm.superHubberMinRating}
                         onChange={(e) => setConfigForm({...configForm, superHubberMinRating: parseFloat(e.target.value)})}
                         className="w-16 px-2 py-1 border border-gray-300 rounded text-center font-bold"
                       />
                    </div>
                 </div>
              </div>
           </div>
        </div>
     </div>
  );

  const renderCms = () => (
    <div className="max-w-4xl animate-in fade-in slide-in-from-right-4">
       <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <div className="mb-8 border-b border-gray-100 pb-6 flex justify-between items-end">
             <div>
               <h2 className="text-2xl font-bold text-gray-900">CMS & Contenuti</h2>
               <p className="text-gray-500 mt-1">Modifica i testi dell'app, la homepage e le FAQ.</p>
             </div>
             <button 
               onClick={handleSaveConfig}
               className="bg-brand text-white font-bold py-2 px-6 rounded-xl shadow-lg hover:bg-brand-dark transition-all flex items-center"
             >
                <Save className="w-4 h-4 mr-2" /> Salva
             </button>
          </div>

          <div className="space-y-6">
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Titolo Hero Homepage</label>
                <input 
                   type="text" 
                   value={configForm.cms.heroTitle}
                   onChange={(e) => setConfigForm({...configForm, cms: {...configForm.cms, heroTitle: e.target.value}})}
                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand outline-none"
                />
             </div>
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Sottotitolo Hero</label>
                <textarea 
                   rows={2}
                   value={configForm.cms.heroSubtitle}
                   onChange={(e) => setConfigForm({...configForm, cms: {...configForm.cms, heroSubtitle: e.target.value}})}
                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand outline-none"
                />
             </div>
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Testo Footer</label>
                <input 
                   type="text" 
                   value={configForm.cms.footerText}
                   onChange={(e) => setConfigForm({...configForm, cms: {...configForm.cms, footerText: e.target.value}})}
                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand outline-none"
                />
             </div>

             <div className="border-t border-gray-100 pt-6 mt-6">
                <h3 className="font-bold text-gray-900 mb-4">Gestione FAQ</h3>
                {configForm.cms.faq.map((faq, idx) => (
                   <div key={idx} className="mb-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <input 
                         type="text" 
                         value={faq.question}
                         onChange={(e) => {
                            const newFaq = [...configForm.cms.faq];
                            newFaq[idx].question = e.target.value;
                            setConfigForm({...configForm, cms: {...configForm.cms, faq: newFaq}});
                         }}
                         className="w-full bg-white border border-gray-300 rounded px-3 py-2 mb-2 font-medium"
                         placeholder="Domanda"
                      />
                      <textarea 
                         value={faq.answer}
                         onChange={(e) => {
                            const newFaq = [...configForm.cms.faq];
                            newFaq[idx].answer = e.target.value;
                            setConfigForm({...configForm, cms: {...configForm.cms, faq: newFaq}});
                         }}
                         className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm text-gray-600"
                         placeholder="Risposta"
                         rows={2}
                      />
                   </div>
                ))}
                <button className="text-brand font-bold text-sm hover:underline">+ Aggiungi FAQ</button>
             </div>
          </div>
       </div>
    </div>
  );

  const renderBrand = () => (
     <div className="max-w-4xl animate-in fade-in slide-in-from-right-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
           <div className="mb-8 border-b border-gray-100 pb-6 flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Brand & Immagini</h2>
                <p className="text-gray-500 mt-1">Personalizza l'aspetto di Renthubber.</p>
              </div>
              <button 
                onClick={handleSaveConfig}
                className="bg-brand text-white font-bold py-2 px-6 rounded-xl shadow-lg hover:bg-brand-dark transition-all flex items-center"
              >
                 <Save className="w-4 h-4 mr-2" /> Salva
              </button>
           </div>
 
           <div className="grid grid-cols-2 gap-8">
              <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2">Colore Primario (Hex)</label>
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg border border-gray-200 shadow-sm" style={{backgroundColor: configForm.brand.primaryColor}}></div>
                    <input 
                       type="text" 
                       value={configForm.brand.primaryColor}
                       onChange={(e) => setConfigForm({...configForm, brand: {...configForm.brand, primaryColor: e.target.value}})}
                       className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-mono"
                    />
                 </div>
              </div>
              
              <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2">Immagine Hero (URL)</label>
                 <div className="flex gap-2">
                    <input 
                       type="text" 
                       value={configForm.brand.heroImageUrl}
                       onChange={(e) => setConfigForm({...configForm, brand: {...configForm.brand, heroImageUrl: e.target.value}})}
                       className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center overflow-hidden border border-gray-200">
                       <img src={configForm.brand.heroImageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                 </div>
              </div>

              <div className="col-span-2 border-t border-gray-100 pt-6">
                 <h3 className="font-bold text-gray-900 mb-4 flex items-center"><Bell className="w-5 h-5 mr-2" /> Notifiche</h3>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                       <span className="font-medium">Notifiche Email</span>
                       <input type="checkbox" checked={configForm.notifications.emailEnabled} onChange={e => setConfigForm({...configForm, notifications: {...configForm.notifications, emailEnabled: e.target.checked}})} className="w-5 h-5 text-brand" />
                    </div>
                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                       <span className="font-medium">Notifiche Push</span>
                       <input type="checkbox" checked={configForm.notifications.pushEnabled} onChange={e => setConfigForm({...configForm, notifications: {...configForm.notifications, pushEnabled: e.target.checked}})} className="w-5 h-5 text-brand" />
                    </div>
                 </div>
                 
                 <div className="mt-6">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Template: Conferma Prenotazione</label>
                    <textarea 
                       rows={2}
                       value={configForm.notifications.templates.bookingConfirmed}
                       onChange={(e) => setConfigForm({...configForm, notifications: {...configForm.notifications, templates: {...configForm.notifications.templates, bookingConfirmed: e.target.value}}})}
                       className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                 </div>
              </div>
           </div>
        </div>
     </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0F172A] text-white flex flex-col fixed h-full z-20 shadow-xl">
         <div className="h-16 flex items-center px-6 border-b border-gray-800">
            <span className="font-bold text-xl tracking-tight text-white">Renthubber <span className="bg-brand text-white text-[10px] px-1.5 py-0.5 rounded ml-1 align-middle">ADMIN</span></span>
         </div>
         
         <nav className="flex-1 py-6 space-y-1 px-3 overflow-y-auto custom-scrollbar">
            <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center px-3 py-3 rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
               <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
            </button>
            
            <div className="pt-4 pb-2 px-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Gestione</div>
            
            <button onClick={() => setActiveTab('users')} className={`w-full flex items-center px-3 py-3 rounded-lg transition-colors ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
               <Users className="w-5 h-5 mr-3" /> Utenti & Hubber
            </button>
            <button onClick={() => setActiveTab('listings')} className={`w-full flex items-center px-3 py-3 rounded-lg transition-colors ${activeTab === 'listings' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
               <Package className="w-5 h-5 mr-3" /> Annunci
            </button>
            <button onClick={() => setActiveTab('finance')} className={`w-full flex items-center px-3 py-3 rounded-lg transition-colors ${activeTab === 'finance' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
               <DollarSign className="w-5 h-5 mr-3" /> Finanza & Wallet
            </button>

            <div className="pt-4 pb-2 px-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Sistema</div>
            
            <button onClick={() => setActiveTab('config')} className={`w-full flex items-center px-3 py-3 rounded-lg transition-colors ${activeTab === 'config' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
               <Settings className="w-5 h-5 mr-3" /> Regole & Economia
            </button>
            <button onClick={() => setActiveTab('cms')} className={`w-full flex items-center px-3 py-3 rounded-lg transition-colors ${activeTab === 'cms' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
               <FileText className="w-5 h-5 mr-3" /> CMS & Contenuti
            </button>
            <button onClick={() => setActiveTab('brand')} className={`w-full flex items-center px-3 py-3 rounded-lg transition-colors ${activeTab === 'brand' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
               <ImageIcon className="w-5 h-5 mr-3" /> Brand & Notifiche
            </button>
         </nav>

         <div className="p-4 border-t border-gray-800">
            <div className="flex items-center">
               <div className="w-8 h-8 rounded-full bg-gray-600 mr-3 flex-shrink-0"></div>
               <div className="overflow-hidden">
                  <p className="text-sm font-bold text-white truncate">Admin System</p>
                  <p className="text-xs text-gray-400">Super Admin</p>
               </div>
            </div>
         </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
         {activeTab === 'overview' && renderOverview()}
         {activeTab === 'users' && renderUsers()}
         {activeTab === 'config' && renderConfig()}
         {activeTab === 'listings' && (
            <AdminListingManager listings={allListings} onUpdateListing={onUpdateListing} />
         )}
         {activeTab === 'finance' && renderFinance()}
         {activeTab === 'cms' && renderCms()}
         {activeTab === 'brand' && renderBrand()}
      </main>

      {/* BANK DETAILS MODAL (ADMIN VIEW) */}
      {selectedBankDetails && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in">
           <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                 <h3 className="font-bold text-gray-900">Dati Bancari: {selectedBankDetails.userName}</h3>
                 <button onClick={() => setSelectedBankDetails(null)} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-200 rounded-full"><X className="w-5 h-5" /></button>
              </div>
              
              <div className="p-6 space-y-4">
                 <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                   <p className="text-xs text-gray-500 mb-1 uppercase font-bold">Intestatario Conto</p>
                   <p className="font-bold text-lg text-gray-900">{selectedBankDetails.details.accountHolderName} {selectedBankDetails.details.accountHolderSurname}</p>
                 </div>

                 <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                   <p className="text-xs text-gray-500 mb-1 uppercase font-bold">IBAN</p>
                   <p className="font-mono font-bold text-lg text-brand break-all">{selectedBankDetails.details.iban}</p>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                       <p className="text-xs text-gray-500 mb-1 uppercase font-bold">Banca</p>
                       <p className="font-semibold text-gray-900">{selectedBankDetails.details.bankName || '-'}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                       <p className="text-xs text-gray-500 mb-1 uppercase font-bold">BIC/SWIFT</p>
                       <p className="font-mono font-semibold text-gray-900">{selectedBankDetails.details.bicSwift || '-'}</p>
                    </div>
                 </div>

                 <div className="pt-2 flex justify-end">
                    <button 
                      onClick={() => setSelectedBankDetails(null)}
                      className="px-6 py-2 bg-gray-800 text-white rounded-lg font-bold hover:bg-gray-900 shadow-md"
                    >
                       Chiudi
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};
