import React, { useState } from 'react';
import { Camera, Save, User, MapPin, Link as LinkIcon, Smartphone, Video } from 'lucide-react';
import { db } from '../../firebase';
import { doc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: 'Demo Creator',
    bio: 'Lifestyle & Tech Creator',
    city: 'Mumbai',
    niche: 'Tech',
    price: 15000,
    igHandle: 'democreator',
    ytHandle: 'democreator_yt'
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    if (db) {
      try {
        await updateDoc(doc(db, 'creators', 'demo_creator'), profile);
      } catch (e) {
        console.error(e);
      }
    }
    setTimeout(() => setSaving(false), 800);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Profile Settings</h1>
      
      <div className="glass p-8 rounded-3xl border border-gray-100 flex flex-col md:flex-row gap-8 items-start">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-32 h-32 bg-gray-100 rounded-full border-4 border-white shadow-lg flex items-center justify-center relative overflow-hidden group">
            <User className="w-12 h-12 text-gray-400" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="w-8 h-8 text-white" />
            </div>
          </div>
          <button className="text-cyan-600 font-medium text-sm">Change Picture</button>
        </div>

        <div className="flex-1 w-full space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
              <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-cyan-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" value={profile.city} onChange={e => setProfile({...profile, city: e.target.value})} className="w-full p-3 pl-10 rounded-xl border border-gray-200 focus:outline-none focus:border-cyan-500" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-cyan-500 h-24" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Starting Price (₹)</label>
              <input type="number" value={profile.price} onChange={e => setProfile({...profile, price: Number(e.target.value)})} className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-cyan-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Niche / Category</label>
              <select value={profile.niche} onChange={e => setProfile({...profile, niche: e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-cyan-500 bg-white">
                <option>Tech</option>
                <option>Fashion</option>
                <option>Lifestyle</option>
                <option>Finance</option>
                <option>Comedy</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="glass p-8 rounded-3xl border border-gray-100">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><LinkIcon className="w-5 h-5"/> Connected Accounts</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50/50">
            <Smartphone className="w-6 h-6 text-pink-600" />
            <input type="text" value={profile.igHandle} onChange={e => setProfile({...profile, igHandle: e.target.value})} placeholder="Instagram Username" className="flex-1 bg-transparent focus:outline-none font-medium" />
          </div>
          <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50/50">
            <Video className="w-6 h-6 text-red-600" />
            <input type="text" value={profile.ytHandle} onChange={e => setProfile({...profile, ytHandle: e.target.value})} placeholder="YouTube Channel ID" className="flex-1 bg-transparent focus:outline-none font-medium" />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button onClick={handleSave} disabled={saving} className="px-8 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-50">
          <Save className="w-5 h-5"/> {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </div>
  );
}
