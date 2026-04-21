import React, { useState, useRef, useEffect } from 'react';
import { User } from 'firebase/auth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { Camera, Mail, Phone, User as UserIcon, Loader2, Check, FileText } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface ProfileEditorProps {
  user: User;
  onUpdate?: () => void;
}

export default function ProfileEditor({ user, onUpdate }: ProfileEditorProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: user.displayName || '',
    bio: '',
    phoneNumber: '',
    education: '',
    experience: 0,
    photoURL: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setProfileData(prev => ({
          ...prev,
          displayName: data.displayName || user.displayName || '',
          bio: data.bio || '',
          phoneNumber: data.phoneNumber || '',
          education: data.education || '',
          experience: data.experience || 0,
          photoURL: data.photoURL || user.photoURL || prev.photoURL
        }));
      }
    };
    fetchProfile();
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let finalPhotoURL = profileData.photoURL;

      if (fileInputRef.current?.files?.[0]) {
        setUploading(true);
        const file = fileInputRef.current.files[0];
        const storageRef = ref(storage, `users/${user.uid}/avatar`);
        await uploadBytes(storageRef, file);
        finalPhotoURL = await getDownloadURL(storageRef);
        setUploading(false);
      }

      await updateDoc(doc(db, "users", user.uid), {
        displayName: profileData.displayName,
        bio: profileData.bio,
        phoneNumber: profileData.phoneNumber,
        education: profileData.education,
        experience: profileData.experience,
        photoURL: finalPhotoURL,
        updatedAt: new Date().toISOString()
      });

      setProfileData(prev => ({ ...prev, photoURL: finalPhotoURL }));
      setPreviewUrl(null);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Profile update error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-10">
      <div className="flex flex-col items-center gap-6">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-slate-100 flex items-center justify-center">
            <img 
              src={previewUrl || profileData.photoURL} 
              alt="Avatar" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white gap-1"
          >
            <Camera className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-widest">Change</span>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*"
          />
          {uploading && (
            <div className="absolute -right-2 -bottom-2 bg-white p-2 rounded-full shadow-lg">
              <Loader2 className="w-5 h-5 text-brand-blue animate-spin" />
            </div>
          )}
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-display font-black text-brand-ink">{profileData.displayName || 'Unnamed Maven'}</h2>
          <p className="text-xs font-black text-brand-blue uppercase tracking-widest mt-1">Professional Identity</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Basic Info */}
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-brand-ink uppercase tracking-widest flex items-center gap-2">
              <UserIcon className="w-3 h-3 text-brand-blue" />
              Full Name
            </label>
            <input 
              type="text" 
              value={profileData.displayName}
              onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-brand-border rounded-xl font-medium focus:border-brand-blue outline-none transition-colors shadow-sm"
              placeholder="e.g. Alex Rivera"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-brand-ink uppercase tracking-widest flex items-center gap-2">
              <Phone className="w-3 h-3 text-brand-blue" />
              Contact Number
            </label>
            <input 
              type="text" 
              value={profileData.phoneNumber}
              onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-brand-border rounded-xl font-medium focus:border-brand-blue outline-none transition-colors shadow-sm"
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>

        {/* Professional Info */}
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-brand-ink uppercase tracking-widest flex items-center gap-2">
              <FileText className="w-3 h-3 text-brand-blue" />
              Professional Bio
            </label>
            <textarea 
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-brand-border rounded-xl font-medium focus:border-brand-blue outline-none transition-colors shadow-sm min-h-[108px] resize-none"
              placeholder="Tell us about your background and goals..."
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <button 
          onClick={handleSave}
          disabled={loading}
          className={cn(
            "px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs transition-all flex items-center gap-3",
            saveSuccess 
              ? "bg-green-500 text-white shadow-xl shadow-green-100" 
              : "bg-brand-blue text-white shadow-xl shadow-blue-100 hover:bg-brand-blue-dark active:scale-95 disabled:opacity-50"
          )}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : saveSuccess ? (
            <>
              <Check className="w-4 h-4" />
              Saved!
            </>
          ) : (
            'Commit Changes'
          )}
        </button>
      </div>
    </div>
  );
}
