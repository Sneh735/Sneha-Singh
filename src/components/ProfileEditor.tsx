import React, { useState, useRef, useEffect } from 'react';
import { User } from 'firebase/auth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, OperationType, handleFirestoreError } from '../lib/firebase';
import { Camera, Mail, Phone, User as UserIcon, Loader2, Check, FileText, Clock, GraduationCap, Lock, Sparkles, Linkedin, Github } from 'lucide-react';
import { cn, getAvatarUrl } from '../lib/utils';
import { motion } from 'motion/react';

interface ProfileEditorProps {
  user: User;
  initialData?: any;
  onUpdate?: (updatedData: any) => void;
}

export default function ProfileEditor({ user, initialData, onUpdate }: ProfileEditorProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: initialData?.displayName || user.displayName || '',
    bio: initialData?.bio || '',
    phoneNumber: initialData?.phoneNumber || '',
    education: initialData?.education || '',
    graduationDetails: initialData?.graduationDetails || '',
    dob: initialData?.dob || '',
    enrollmentPin: initialData?.enrollmentPin || '',
    linkedin: initialData?.linkedin || '',
    github: initialData?.github || '',
    resumeUrl: initialData?.resumeUrl || '',
    experience: initialData?.experience || 0,
    keySkills: initialData?.keySkills || [],
    photoURL: initialData?.photoURL || user.photoURL || ''
  });

  const [newSkill, setNewSkill] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const [resumeUploading, setResumeUploading] = useState(false);

  const getWordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

  useEffect(() => {
    if (initialData) {
      setProfileData(prev => ({
        ...prev,
        ...initialData,
        photoURL: initialData.photoURL || user.photoURL || prev.photoURL
      }));
    }
  }, [initialData, user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const addSkill = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (newSkill.trim() && !profileData.keySkills.includes(newSkill.trim())) {
      setProfileData({
        ...profileData,
        keySkills: [...profileData.keySkills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setProfileData({
      ...profileData,
      keySkills: profileData.keySkills.filter(s => s !== skill)
    });
  };

  const handleSave = async () => {
    if (getWordCount(profileData.bio) > 250) {
      alert("Bio exceeds 250 words limit.");
      return;
    }
    setLoading(true);
    try {
      let finalPhotoURL = profileData.photoURL;
      let finalResumeURL = profileData.resumeUrl;

      if (fileInputRef.current?.files?.[0]) {
        const file = fileInputRef.current.files[0];
        
        // Pre-upload validation
        if (file.size > 2 * 1024 * 1024) {
          alert("Image size must be less than 2MB.");
          setLoading(false);
          return;
        }
        
        if (!file.type.startsWith('image/')) {
          alert("Only image files are allowed.");
          setLoading(false);
          return;
        }

        setUploading(true);
        try {
          const storageRef = ref(storage, `users/${user.uid}/avatar`);
          await uploadBytes(storageRef, file);
          finalPhotoURL = await getDownloadURL(storageRef);
        } catch (sErr: any) {
          console.error("Storage upload error:", sErr);
          setUploading(false);
          if (sErr.message?.toLowerCase().includes("permission")) {
            alert("Firebase Storage: Permission denied. Please ensure you have deployed Storage rules.");
          } else {
            alert(`Upload failed: ${sErr.message}`);
          }
          setLoading(false);
          return;
        }
        setUploading(false);
      }

      // Handle Resume Upload
      if (resumeInputRef.current?.files?.[0]) {
        const file = resumeInputRef.current.files[0];
        if (file.size > 5 * 1024 * 1024) {
          alert("Resume size must be less than 5MB.");
          setLoading(false);
          return;
        }
        if (file.type !== 'application/pdf') {
          alert("Only PDF files are allowed for resume.");
          setLoading(false);
          return;
        }

        setResumeUploading(true);
        try {
          const storageRef = ref(storage, `users/${user.uid}/resume.pdf`);
          await uploadBytes(storageRef, file);
          finalResumeURL = await getDownloadURL(storageRef);
        } catch (sErr: any) {
          console.error("Resume upload error:", sErr);
        } finally {
          setResumeUploading(false);
        }
      }

      const updatedFields = {
        displayName: profileData.displayName,
        bio: profileData.bio,
        phoneNumber: profileData.phoneNumber,
        education: profileData.education,
        graduationDetails: profileData.graduationDetails,
        dob: profileData.dob,
        enrollmentPin: profileData.enrollmentPin,
        linkedin: profileData.linkedin,
        github: profileData.github,
        resumeUrl: finalResumeURL,
        experience: profileData.experience,
        keySkills: profileData.keySkills,
        photoURL: finalPhotoURL,
        updatedAt: new Date().toISOString()
      };

      await updateDoc(doc(db, "users", user.uid), updatedFields);

      setProfileData(prev => ({ ...prev, photoURL: finalPhotoURL }));
      setPreviewUrl(null);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      if (onUpdate) onUpdate({ ...initialData, ...updatedFields });
    } catch (error: any) {
      console.error("Profile update error:", error);
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row items-center gap-10 bg-brand-cream/30 p-8 rounded-[40px] border border-brand-border/50">
        <div className="relative group shrink-0">
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-2xl bg-white flex items-center justify-center relative">
            <img 
              src={previewUrl || getAvatarUrl(profileData.photoURL, profileData.displayName)} 
              alt="Avatar" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {uploading && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
              </div>
            )}
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all gap-2">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-brand-blue w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"
              title="Upload Photo"
            >
              <Camera className="w-5 h-5" />
            </button>
            {(profileData.photoURL || previewUrl) && (
              <button 
                onClick={() => {
                  setProfileData({ ...profileData, photoURL: '' });
                  setPreviewUrl(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="bg-red-500 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"
                title="Reset to Avatar"
              >
                <div className="font-bold text-lg leading-none mt-[-2px]">×</div>
              </button>
            )}
          </div>
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
          <p className="text-brand-muted font-medium italic mb-4">"{profileData.bio.slice(0, 100)}{profileData.bio.length > 100 ? '...' : ''}"</p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            {profileData.linkedin && (
              <a href={profileData.linkedin.startsWith('http') ? profileData.linkedin : `https://${profileData.linkedin}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-white rounded-xl border border-brand-border text-[#0077b5] hover:shadow-md transition-shadow">
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            {profileData.github && (
              <a href={profileData.github.startsWith('http') ? profileData.github : `https://${profileData.github}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-white rounded-xl border border-brand-border text-[#333] hover:shadow-md transition-shadow">
                <Github className="w-5 h-5" />
              </a>
            )}
          </div>
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
              <FileText className="w-3 h-3 text-brand-blue" />
              Resume (PDF)
            </label>
            <div className="flex items-center gap-3">
              <button 
                type="button"
                onClick={() => resumeInputRef.current?.click()}
                className="px-6 py-3 bg-white border border-brand-border rounded-xl font-bold text-[10px] uppercase tracking-widest hover:border-brand-blue transition-colors flex items-center gap-2"
              >
                {resumeUploading ? <Loader2 className="w-3 h-3 animate-spin"/> : <FileText className="w-3 h-3"/>}
                {profileData.resumeUrl ? 'Update Resume' : 'Link Resume (PDF)'}
              </button>
              {profileData.resumeUrl && (
                <a 
                  href={profileData.resumeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[9px] font-black uppercase text-brand-blue hover:underline"
                >
                  View Current PDF
                </a>
              )}
            </div>
            <input 
              type="file" 
              ref={resumeInputRef} 
              className="hidden" 
              accept=".pdf"
            />
            <p className="text-[9px] font-bold text-brand-muted uppercase tracking-widest pl-1">Enable professional visibility with academic proof</p>
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
              <Clock className="w-3 h-3 text-brand-blue" />
              Years of Experience
            </label>
            <input 
              type="number" 
              value={profileData.experience}
              onChange={(e) => setProfileData({ ...profileData, experience: parseInt(e.target.value) || 0 })}
              className="w-full px-5 py-4 bg-white border border-brand-border rounded-2xl font-bold text-sm focus:border-brand-blue outline-none transition-all shadow-sm"
              placeholder="0"
              min="0"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-brand-ink uppercase tracking-widest flex items-center gap-2">
              <Lock className="w-3 h-3 text-brand-blue" />
              Enrollment PIN/Password
            </label>
            <div className="relative">
              <input 
                type={showPin ? "text" : "password"} 
                value={profileData.enrollmentPin}
                onChange={(e) => setProfileData({ ...profileData, enrollmentPin: e.target.value })}
                className="w-full px-5 py-4 bg-white border border-brand-border rounded-2xl font-bold text-sm focus:border-brand-blue outline-none transition-all shadow-sm"
                placeholder="Set a PIN for course access"
                maxLength={6}
              />
              <button 
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-blue transition-colors"
              >
                <div className="text-[10px] font-black uppercase tracking-widest">{showPin ? 'Hide' : 'Show'}</div>
              </button>
            </div>
            <p className="text-[9px] font-bold text-brand-muted uppercase tracking-widest pl-1">Required to authenticate course enrollment</p>
          </div>
          <div className="space-y-1.5 pt-4">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-brand-blue border-b border-brand-blue/20 pb-2 mb-4">Professional Nodes</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-brand-ink uppercase tracking-widest flex items-center gap-2">
                  <Linkedin className="w-3 h-3 text-[#0077b5]" />
                  LinkedIn Profile
                </label>
                <input 
                  type="url" 
                  value={profileData.linkedin}
                  onChange={(e) => setProfileData({ ...profileData, linkedin: e.target.value })}
                  className="w-full px-5 py-3 bg-white border border-brand-border rounded-2xl font-bold text-sm focus:border-brand-blue outline-none transition-all shadow-sm"
                  placeholder="linkedin.com/in/username"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-brand-ink uppercase tracking-widest flex items-center gap-2">
                  <Github className="w-3 h-3 text-[#333]" />
                  GitHub Registry
                </label>
                <input 
                  type="url" 
                  value={profileData.github}
                  onChange={(e) => setProfileData({ ...profileData, github: e.target.value })}
                  className="w-full px-5 py-3 bg-white border border-brand-border rounded-2xl font-bold text-sm focus:border-brand-blue outline-none transition-all shadow-sm"
                  placeholder="github.com/username"
                />
              </div>
            </div>
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

          <div className="space-y-3">
            <label className="text-[10px] font-black text-brand-ink uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-brand-blue" />
              Key Domain Expertise
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {profileData.keySkills.map(skill => (
                <span key={skill} className="bg-brand-blue/10 text-brand-blue px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-brand-blue/20">
                  {skill}
                  <button onClick={() => removeSkill(skill)} className="hover:text-red-500 transition-colors">×</button>
                </span>
              ))}
              {profileData.keySkills.length === 0 && (
                <p className="text-[10px] text-brand-muted italic font-medium">No expertise mapped yet.</p>
              )}
            </div>
            <form onSubmit={addSkill} className="relative">
              <input 
                type="text" 
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="w-full px-5 py-3 bg-white border border-brand-border rounded-2xl font-bold text-xs focus:border-brand-blue outline-none transition-all"
                placeholder="Add skill (e.g. React, UX, Python)"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-blue text-white w-8 h-8 rounded-xl flex items-center justify-center hover:bg-brand-blue-dark transition-all"
              >
                +
              </button>
            </form>
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
