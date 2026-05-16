import React, { useState, useRef, useEffect } from 'react';
import { User } from 'firebase/auth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { Camera, Mail, Phone, User as UserIcon, Loader2, Check, FileText, Clock, GraduationCap, Lock } from 'lucide-react';
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
    graduationDetails: '',
    dob: '',
    enrollmentPin: '',
    experience: 0,
    photoURL: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getWordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

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
          graduationDetails: data.graduationDetails || '',
          dob: data.dob || '',
          enrollmentPin: data.enrollmentPin || '',
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
    if (getWordCount(profileData.bio) > 250) {
      alert("Bio exceeds 250 words limit.");
      return;
    }
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
        graduationDetails: profileData.graduationDetails,
        dob: profileData.dob,
        enrollmentPin: profileData.enrollmentPin,
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
    <div className="max-w-3xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row items-center gap-10 bg-brand-cream/30 p-8 rounded-[40px] border border-brand-border/50">
        <div className="relative group shrink-0">
          <div className="w-40 h-40 rounded-[48px] overflow-hidden border-4 border-white shadow-2xl bg-white flex items-center justify-center">
            <img 
              src={previewUrl || profileData.photoURL} 
              alt="Avatar" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 bg-brand-ink/60 rounded-[48px] flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-white gap-2"
          >
            <Camera className="w-8 h-8" />
            <span className="text-[10px] font-black uppercase tracking-widest">Update Photo</span>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*"
          />
        </div>
        <div className="flex-1 space-y-2 text-center md:text-left">
          <div className="inline-block px-3 py-1 bg-brand-blue/10 rounded-lg text-[10px] font-black text-brand-blue uppercase tracking-[0.2em] mb-2">
            Professional ID: SKILL-{user.uid.slice(0, 8).toUpperCase()}
          </div>
          <h2 className="text-4xl font-display font-black text-brand-ink leading-tight">{profileData.displayName || 'Unnamed Maven'}</h2>
          <p className="text-brand-muted font-medium italic">"{profileData.bio.slice(0, 100)}{profileData.bio.length > 100 ? '...' : ''}"</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Personal Discovery */}
        <div className="space-y-8">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-brand-blue border-b border-brand-blue/20 pb-2">Civil Identity</h3>
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-brand-ink uppercase tracking-widest flex items-center gap-2">
              <UserIcon className="w-3 h-3 text-brand-blue" />
              Full Name
            </label>
            <input 
              type="text" 
              value={profileData.displayName}
              onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
              className="w-full px-5 py-4 bg-white border border-brand-border rounded-2xl font-bold text-sm focus:border-brand-blue outline-none transition-all shadow-sm"
              placeholder="Full Name"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-brand-ink uppercase tracking-widest flex items-center gap-2">
              <Phone className="w-3 h-3 text-brand-blue" />
              Contact Number
            </label>
            <input 
              type="tel" 
              value={profileData.phoneNumber}
              onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
              className="w-full px-5 py-4 bg-white border border-brand-border rounded-2xl font-bold text-sm focus:border-brand-blue outline-none transition-all shadow-sm"
              placeholder="Contact Number"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-brand-ink uppercase tracking-widest flex items-center gap-2">
              <Clock className="w-3 h-3 text-brand-blue" />
              Date of Birth
            </label>
            <input 
              type="date" 
              value={profileData.dob}
              onChange={(e) => setProfileData({ ...profileData, dob: e.target.value })}
              className="w-full px-5 py-4 bg-white border border-brand-border rounded-2xl font-bold text-sm focus:border-brand-blue outline-none transition-all shadow-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-brand-ink uppercase tracking-widest flex items-center gap-2">
              <Lock className="w-3 h-3 text-brand-blue" />
              Enrollment PIN/Password
            </label>
            <input 
              type="password" 
              value={profileData.enrollmentPin}
              onChange={(e) => setProfileData({ ...profileData, enrollmentPin: e.target.value })}
              className="w-full px-5 py-4 bg-white border border-brand-border rounded-2xl font-bold text-sm focus:border-brand-blue outline-none transition-all shadow-sm"
              placeholder="Set a PIN for course access"
              maxLength={6}
            />
            <p className="text-[9px] font-bold text-brand-muted uppercase tracking-widest pl-1">Required to authenticate course enrollment</p>
          </div>
        </div>

        {/* Academic Topology */}
        <div className="space-y-8">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-brand-blue border-b border-brand-blue/20 pb-2">Academic Topology</h3>
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-brand-ink uppercase tracking-widest flex items-center gap-2">
              <GraduationCap className="w-3 h-3 text-brand-blue" />
              Graduation Details
            </label>
            <input 
              type="text" 
              value={profileData.graduationDetails}
              onChange={(e) => setProfileData({ ...profileData, graduationDetails: e.target.value })}
              className="w-full px-5 py-4 bg-white border border-brand-border rounded-2xl font-bold text-sm focus:border-brand-blue outline-none transition-all shadow-sm"
              placeholder="Degree, Major, Graduation Year"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-brand-ink uppercase tracking-widest flex items-center gap-2 flex-justify-between w-full">
              <span className="flex items-center gap-2"><FileText className="w-3 h-3 text-brand-blue" /> Professional Bio</span>
              <span className={cn(
                "text-[9px] font-bold",
                getWordCount(profileData.bio) > 250 ? "text-red-500" : "text-brand-muted"
              )}>
                {getWordCount(profileData.bio)} / 250 Words
              </span>
            </label>
            <textarea 
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              className="w-full px-5 py-4 bg-white border border-brand-border rounded-2xl font-bold text-sm focus:border-brand-blue outline-none transition-all shadow-sm min-h-[160px] resize-none leading-relaxed"
              placeholder="Craft your 250-word manifest..."
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
