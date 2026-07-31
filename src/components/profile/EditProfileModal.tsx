import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, CivicAffiliation, SocialLinks } from '../../types';
import {
  X,
  Camera,
  User as UserIcon,
  Briefcase,
  Globe,
  MapPin,
  Mail,
  Phone,
  Plus,
  Trash2,
  Check,
  Sparkles,
  Link as LinkIcon,
  Award,
} from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_COVERS = [
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1477959858617-67f30ac4ce78?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
];

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, setUser, theme } = useApp();
  const isLight = theme === 'light';

  const [formData, setFormData] = useState<User>({ ...user });
  const [newSkill, setNewSkill] = useState('');
  const [newAffiliation, setNewAffiliation] = useState({ title: '', organization: '', period: '' });
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUser(formData);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 800);
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    const currentSkills = formData.skills || [];
    if (!currentSkills.includes(newSkill.trim())) {
      setFormData({ ...formData, skills: [...currentSkills, newSkill.trim()] });
    }
    setNewSkill('');
  };

  const removeSkill = (skillToRemove: string) => {
    const currentSkills = formData.skills || [];
    setFormData({ ...formData, skills: currentSkills.filter((s) => s !== skillToRemove) });
  };

  const addAffiliation = () => {
    if (!newAffiliation.title.trim() || !newAffiliation.organization.trim()) return;
    const currentAff = formData.civicAffiliations || [];
    const item: CivicAffiliation = {
      id: `aff_${Date.now()}`,
      title: newAffiliation.title,
      organization: newAffiliation.organization,
      period: newAffiliation.period || '2025 - Present',
      isCurrent: true,
    };
    setFormData({ ...formData, civicAffiliations: [item, ...currentAff] });
    setNewAffiliation({ title: '', organization: '', period: '' });
  };

  const removeAffiliation = (id: string) => {
    const currentAff = formData.civicAffiliations || [];
    setFormData({ ...formData, civicAffiliations: currentAff.filter((a) => a.id !== id) });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className={`w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden my-auto ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-950 border-white/10 text-white'
      }`}>
        
        {/* Header */}
        <div className={`p-5 border-b flex items-center justify-between ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-white/10'
        }`}>
          <div className="flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-indigo-500" />
            <h3 className="text-base font-black">Edit Executive Civic Profile</h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-full cursor-pointer ${
              isLight ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          
          {/* Cover & Profile Images */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-wider block">Profile & Cover Imagery</label>
            
            {/* Cover Preview & Custom Input */}
            <div className="relative h-28 rounded-2xl overflow-hidden border border-slate-300 dark:border-white/10 bg-slate-800">
              <img
                src={formData.coverPhoto || PRESET_COVERS[0]}
                alt="Cover Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-2">
                <input
                  type="text"
                  value={formData.coverPhoto || ''}
                  onChange={(e) => setFormData({ ...formData, coverPhoto: e.target.value })}
                  placeholder="Paste Cover Photo Image URL..."
                  className="w-full max-w-md px-3 py-1.5 rounded-xl bg-slate-900/90 text-white border border-white/20 text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-[10px] font-bold text-slate-500 shrink-0">Cover Presets:</span>
              {PRESET_COVERS.map((url, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setFormData({ ...formData, coverPhoto: url })}
                  className="w-10 h-6 rounded-md overflow-hidden border border-white/20 shrink-0 cursor-pointer hover:opacity-80"
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Avatar Row */}
            <div className="flex items-center gap-4 pt-2">
              <img
                src={formData.avatar}
                alt={formData.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/50 shadow-md"
              />
              <div className="flex-1 space-y-1">
                <input
                  type="text"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  placeholder="Avatar Image URL..."
                  className={`w-full px-3 py-1.5 rounded-xl border text-xs focus:outline-none ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-white/10'
                  }`}
                />
                <div className="flex items-center gap-2 overflow-x-auto pt-1">
                  <span className="text-[10px] font-bold text-slate-500 shrink-0">Avatars:</span>
                  {PRESET_AVATARS.map((url, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setFormData({ ...formData, avatar: url })}
                      className="w-6 h-6 rounded-full overflow-hidden border shrink-0 cursor-pointer hover:scale-105"
                    >
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Identity & Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold block mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-white/10'
                }`}
              />
            </div>

            <div>
              <label className="text-xs font-bold block mb-1">Location / Ward</label>
              <input
                type="text"
                value={formData.locationName || ''}
                onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                placeholder="e.g. Madhapur, Hyderabad, Ward 107"
                className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-white/10'
                }`}
              />
            </div>
          </div>

          {/* Tagline & Bio */}
          <div>
            <label className="text-xs font-bold block mb-1">Civic Tagline / Title</label>
            <input
              type="text"
              value={formData.tagline || ''}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="e.g. Civic Leader & Community Mentor • GHMC Ward 107 Advisory"
              className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-white/10'
              }`}
            />
          </div>

          <div>
            <label className="text-xs font-bold block mb-1">Bio & Impact Statement</label>
            <textarea
              rows={3}
              value={formData.bio || ''}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell your civic community about your leadership goals..."
              className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-white/10'
              }`}
            />
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold block mb-1">Primary Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-white/10'
                }`}
              />
            </div>

            <div>
              <label className="text-xs font-bold block mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-white/10'
                }`}
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-black uppercase tracking-wider block">Social & Web Links</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={formData.socialLinks?.linkedin || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, linkedin: e.target.value },
                })}
                placeholder="LinkedIn Profile URL"
                className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-white/10'
                }`}
              />
              <input
                type="text"
                value={formData.socialLinks?.twitter || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, twitter: e.target.value },
                })}
                placeholder="X / Twitter Handle or URL"
                className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-white/10'
                }`}
              />
            </div>
          </div>

          {/* Skills Management */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-black uppercase tracking-wider block">Civic Expertise & Skills</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                placeholder="Add skill (e.g., Disaster Management, GIS, Budget Auditing)..."
                className={`flex-1 px-3 py-2 rounded-xl border text-xs focus:outline-none ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-white/10'
                }`}
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {(formData.skills || []).map((skill, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${
                    isLight ? 'bg-indigo-50 border-indigo-200 text-indigo-900' : 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                  }`}
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:text-red-500 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Civic Affiliations */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-black uppercase tracking-wider block">Civic & NGO Affiliations</label>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                value={newAffiliation.title}
                onChange={(e) => setNewAffiliation({ ...newAffiliation, title: e.target.value })}
                placeholder="Role / Title"
                className={`px-3 py-2 rounded-xl border text-xs focus:outline-none ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-white/10'
                }`}
              />
              <input
                type="text"
                value={newAffiliation.organization}
                onChange={(e) => setNewAffiliation({ ...newAffiliation, organization: e.target.value })}
                placeholder="Organization / NGO"
                className={`px-3 py-2 rounded-xl border text-xs focus:outline-none ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-white/10'
                }`}
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newAffiliation.period}
                  onChange={(e) => setNewAffiliation({ ...newAffiliation, period: e.target.value })}
                  placeholder="2024 - Present"
                  className={`flex-1 px-3 py-2 rounded-xl border text-xs focus:outline-none ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-white/10'
                  }`}
                />
                <button
                  type="button"
                  onClick={addAffiliation}
                  className="px-3 py-2 rounded-xl bg-emerald-600 text-white text-xs font-black cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              {(formData.civicAffiliations || []).map((aff) => (
                <div
                  key={aff.id}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-white/10'
                  }`}
                >
                  <div>
                    <div className="font-extrabold">{aff.title}</div>
                    <div className="text-[11px] text-slate-500">{aff.organization} • {aff.period}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAffiliation(aff.id)}
                    className="p-1 rounded text-red-500 hover:bg-red-500/10 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions Bar */}
          <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className={`px-5 py-2.5 rounded-xl text-xs font-extrabold cursor-pointer ${
                isLight ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-black shadow-lg shadow-emerald-600/20 cursor-pointer flex items-center gap-2"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  Saved Changes!
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Save Executive Profile
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
