import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Lead, AcquisitionChannel } from '../types';

interface NewLeadModalProps {
  onClose: () => void;
  onCreate: (leadData: Partial<Lead>) => void;
}

export const NewLeadModal: React.FC<NewLeadModalProps> = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    channel: 'Site Web Direct' as AcquisitionChannel,
    value: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      ...formData,
      value: parseFloat(formData.value) || 0,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-[#1a1a1a] border-b border-gray-100 dark:border-white/10 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-black dark:text-white">Nouveau Lead</h2>
            <p className="text-sm text-gray-500 mt-1">Ajoutez un nouveau lead à votre base de données</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informations de contact */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Informations de contact</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Prénom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-black dark:text-white"
                  placeholder="John"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-black dark:text-white"
                  placeholder="Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-black dark:text-white"
                  placeholder="john.doe@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-black dark:text-white"
                  placeholder="+33 6 12 34 56 78"
                />
              </div>
            </div>
          </div>

          {/* Informations professionnelles */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Informations professionnelles</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Entreprise
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-black dark:text-white"
                  placeholder="Acme Corp"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Poste
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-black dark:text-white"
                  placeholder="CEO"
                />
              </div>
            </div>
          </div>

          {/* Informations commerciales */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Informations commerciales</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Canal d'acquisition <span className="text-red-500">*</span>
                </label>
                <select
                  name="channel"
                  value={formData.channel}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-black dark:text-white cursor-pointer"
                >
                  {Object.values(AcquisitionChannel).map(channel => (
                    <option key={channel} value={channel}>{channel}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Valeur potentielle (€)
                </label>
                <input
                  type="number"
                  name="value"
                  value={formData.value}
                  onChange={handleChange}
                  min="0"
                  step="100"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-black dark:text-white"
                  placeholder="5000"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-gray-700 dark:text-gray-300 font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-medium shadow-lg"
            >
              Créer le Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
