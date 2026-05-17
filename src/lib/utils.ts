import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAvatarUrl(photoURL: string | null | undefined, name: string | null | undefined) {
  // 1. Priority: Custom Upload, Google Photo, or any provided external URL
  if (photoURL && (
    photoURL.includes('firebasestorage') || 
    photoURL.startsWith('blob:') || 
    photoURL.includes('googleusercontent.com') ||
    (!photoURL.includes('dicebear') && photoURL.length > 10)
  )) {
    return photoURL;
  }
  
  // 2. Fallback: Clean professional initials
  const seed = name || 'User';
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed)}&backgroundColor=0047FF&fontFamily=Arial&fontSize=40&fontWeight=700`;
}
