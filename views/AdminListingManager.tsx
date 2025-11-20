
import React, { useState } from 'react';
import { Listing, ListingStatus } from '../types';
import { 
  Search, Edit, Eye, Ban, CheckCircle, AlertTriangle, Save, X, MapPin 
} from 'lucide-react';

interface AdminListingManagerProps {
  listings: Listing[];
  onUpdateListing?: (listing: Listing) => void;
}

export const AdminListingManager: React.FC<AdminListingManagerProps> = ({ listings, onUpdateListing }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ListingStatus | 'all'>('all');
  const [editingListing, setEditingListing] = useState<Listing | null>(null);

  const filteredListings = listings.filter(l => {
    const matchesSearch = l.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          l.owner.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSave = () => {
    if (editingListing && onUpdateListing) {
      onUpdateListing(editingListing);
      setEditingListing(null);
      alert(`Annuncio "${editingListing.title}" aggiornato con successo.`);
    }
  };

  const handleToggleBadge = (badge: string) => {
    if (!editingListing) return;
    const currentBadges = editingListing.manualBadges || [];
    const newBadges = currentBadges.includes(badge)
      ? currentBadges.filter(b => b !== badge)
      : [...currentBadges, badge];
    
    setEditingListing({ ...editingListing, manualBadges: newBadges });
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header Controls */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
           <input 
             type="text" 
             placeholder="Cerca per titolo o host..." 
             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand outline-none text-sm"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
           />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
           <span className="text-sm text-gray-500">Stato:</span>
           <select 
             className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-brand outline-none"
             value={statusFilter}
             onChange={(e) => setStatusFilter(e.target.value as ListingStatus | 'all')}
           >
              <option value="all">Tutti</option>
              <option value="published">Pubblicati</option>
              <option value="draft">Bozze</option>
              <option value="suspended">Sospesi</option>
           </select>
        </div>
      </div>

      {/* Listings Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-900 font-semibold border-b border-gray-100">
            <tr>
              <th className="p-4">Annuncio</th>
              <th className="p-4">Host</th>
              <th className="p-4">Stato</th>
              <th className="p-4">Prezzo</th>
              <th className="p-4">Rating</th>
              <th className="p-4 text-right">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {filteredListings.map((listing) => (
              <tr key={listing.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="p-4 max-w-xs">
                  <div className="flex items-center gap-3">
                    <img src={listing.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-200" />
                    <div>
                      <p className="font-bold text-gray-900 line-clamp-1" title={listing.title}>{listing.title}</p>
                      <p className="text-xs text-gray-400 capitalize">{listing.category} • {listing.location}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                     <img src={listing.owner.avatar} className="w-6 h-6 rounded-full" alt="" />
                     <span className="font-medium text-gray-900">{listing.owner.name}</span>
                  </div>
                </td>
                <td className="p-4">
                   <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                      listing.status === 'published' ? 'bg-green-100 text-green-700' :
                      listing.status === 'suspended' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                   }`}>
                      {listing.status}
                   </span>
                </td>
                <td className="p-4 font-mono text-gray-900">
                   €{listing.price} <span className="text-gray-400 text-xs">/{listing.priceUnit}</span>
                </td>
                <td className="p-4">
                   <div className="flex items-center">
                      <span className="font-bold text-gray-900">{listing.rating || '-'}</span>
                      <span className="text-xs text-gray-400 ml-1">({listing.reviewCount})</span>
                   </div>
                </td>
                <td className="p-4 text-right">
                   <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setEditingListing(listing)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Modifica Completa"
                      >
                         <Edit className="w-4 h-4" />
                      </button>
                      {listing.status === 'suspended' ? (
                         <button 
                           className="p-2 text-green-600 hover:bg-green-50 rounded-lg" 
                           title="Riattiva"
                           onClick={() => onUpdateListing && onUpdateListing({...listing, status: 'published'})}
                         >
                            <CheckCircle className="w-4 h-4" />
                         </button>
                      ) : (
                         <button 
                           className="p-2 text-red-600 hover:bg-red-50 rounded-lg" 
                           title="Sospendi"
                           onClick={() => onUpdateListing && onUpdateListing({...listing, status: 'suspended'})}
                         >
                            <Ban className="w-4 h-4" />
                         </button>
                      )}
                   </div>
                </td>
              </tr>
            ))}
            {filteredListings.length === 0 && (
               <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                     Nessun annuncio trovato.
                  </td>
               </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL (GOD MODE) */}
      {editingListing && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in">
           <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-900 text-white">
                 <h3 className="font-bold flex items-center">
                    <Edit className="w-5 h-5 mr-2" /> Gestione Annuncio (Admin Mode)
                 </h3>
                 <button onClick={() => setEditingListing(null)} className="text-white/70 hover:text-white p-1 hover:bg-white/10 rounded-full">
                    <X className="w-5 h-5" />
                 </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                 
                 {/* Status & Moderation */}
                 <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                    <h4 className="text-sm font-bold text-red-900 mb-2 flex items-center">
                       <AlertTriangle className="w-4 h-4 mr-2" /> Moderazione & Stato
                    </h4>
                    <div className="flex items-center gap-4">
                       <select 
                          value={editingListing.status}
                          onChange={(e) => setEditingListing({...editingListing, status: e.target.value as ListingStatus})}
                          className="px-3 py-2 border border-red-200 rounded-lg bg-white text-sm font-medium focus:ring-2 focus:ring-red-500 outline-none"
                       >
                          <option value="published">Pubblicato</option>
                          <option value="draft">Bozza</option>
                          <option value="suspended">Sospeso (Violazione)</option>
                          <option value="hidden">Nascosto</option>
                       </select>
                       <p className="text-xs text-red-700">
                          Modificare lo stato invierà una notifica all'utente.
                       </p>
                    </div>
                 </div>

                 {/* Basic Info */}
                 <div className="space-y-4">
                    <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Titolo</label>
                       <input 
                          type="text" 
                          value={editingListing.title}
                          onChange={(e) => setEditingListing({...editingListing, title: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand outline-none"
                       />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descrizione</label>
                       <textarea 
                          rows={4}
                          value={editingListing.description}
                          onChange={(e) => setEditingListing({...editingListing, description: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand outline-none text-sm"
                       />
                    </div>
                 </div>

                 {/* Location & Price */}
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Prezzo (€)</label>
                       <input 
                          type="number" 
                          value={editingListing.price}
                          onChange={(e) => setEditingListing({...editingListing, price: parseFloat(e.target.value)})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand outline-none font-bold"
                       />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Città</label>
                       <input 
                          type="text" 
                          value={editingListing.location}
                          onChange={(e) => setEditingListing({...editingListing, location: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand outline-none"
                       />
                    </div>
                 </div>

                 {/* Admin Badges */}
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Badge Speciali (Admin Only)</label>
                    <div className="flex flex-wrap gap-2">
                       {['Offerta', 'Consigliato', 'Verificato', 'Top Rated'].map(badge => (
                          <button
                             key={badge}
                             onClick={() => handleToggleBadge(badge)}
                             className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                                editingListing.manualBadges?.includes(badge)
                                   ? 'bg-brand text-white border-brand'
                                   : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                             }`}
                          >
                             {badge}
                          </button>
                       ))}
                    </div>
                 </div>

              </div>

              <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                 <button 
                    onClick={() => setEditingListing(null)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg font-medium text-sm transition-colors"
                 >
                    Annulla
                 </button>
                 <button 
                    onClick={handleSave}
                    className="px-6 py-2 bg-brand text-white rounded-lg font-bold hover:bg-brand-dark shadow-md flex items-center text-sm"
                 >
                    <Save className="w-4 h-4 mr-2" /> Salva Modifiche
                 </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};
