interface SkullIconProps {
  size?: number;
  className?: string;
}

export default function SkullIcon({ size = 24, className = "" }: SkullIconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Ornate Frame */}
      <path 
        d="M16 2 C8 2 2 8 2 16 C2 24 8 30 16 30 C24 30 30 24 30 16 C30 8 24 2 16 2 Z" 
        fill="currentColor" 
        opacity="0.1"
      />
      
      {/* Skull Base */}
      <ellipse cx="16" cy="17" rx="9" ry="11" fill="#5FB3CC"/>
      <ellipse cx="16" cy="17" rx="8.5" ry="10.5" fill="#4A90A4"/>
      
      {/* Skull Highlights */}
      <ellipse cx="14" cy="14" rx="2" ry="3" fill="#7BC8D9" opacity="0.6"/>
      <ellipse cx="18" cy="15" rx="1.5" ry="2" fill="#7BC8D9" opacity="0.4"/>
      
      {/* Eye Sockets */}
      <ellipse cx="13" cy="15" rx="2.5" ry="3" fill="#2C5F6F"/>
      <ellipse cx="19" cy="15" rx="2.5" ry="3" fill="#2C5F6F"/>
      <ellipse cx="13" cy="15" rx="2" ry="2.5" fill="#1A3A42"/>
      <ellipse cx="19" cy="15" rx="2" ry="2.5" fill="#1A3A42"/>
      
      {/* Nasal Cavity */}
      <path d="M16 18 L14.5 21 L17.5 21 Z" fill="#2C5F6F"/>
      <path d="M16 18.5 L15 20.5 L17 20.5 Z" fill="#1A3A42"/>
      
      {/* Teeth */}
      <rect x="12" y="23" width="1" height="2" fill="#F8F6F0"/>
      <rect x="13.5" y="23" width="1" height="2.5" fill="#F8F6F0"/>
      <rect x="15" y="23" width="1" height="2" fill="#F8F6F0"/>
      <rect x="16.5" y="23" width="1" height="2.5" fill="#F8F6F0"/>
      <rect x="18" y="23" width="1" height="2" fill="#F8F6F0"/>
      <rect x="19.5" y="23" width="1" height="2" fill="#F8F6F0"/>
      
      {/* Mystical Accents */}
      <circle cx="11" cy="12" r="0.5" fill="#D4AF37" opacity="0.8"/>
      <circle cx="21" cy="13" r="0.5" fill="#D4AF37" opacity="0.8"/>
      <circle cx="14" cy="20" r="0.3" fill="#FF69B4" opacity="0.7"/>
      <circle cx="18" cy="20" r="0.3" fill="#FF69B4" opacity="0.7"/>
    </svg>
  );
}