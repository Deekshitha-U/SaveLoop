import { Youtube, Instagram, Linkedin, Facebook, Pin, Globe, Github, Twitter, Video, BookOpen } from 'lucide-react';
const icons = { youtube: Youtube, instagram: Instagram, linkedin: Linkedin, facebook: Facebook, pinterest: Pin, github: Github, twitter: Twitter, tiktok: Video, medium: BookOpen, website: Globe };
export default function PlatformIcon({ platform = 'website', size = 18 }) {
  const Icon = icons[platform] || Globe;
  return <span className={`platform-badge platform-${platform}`} title={platform}><Icon size={size}/></span>;
}
