import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SEOHead from '@/components/SEOHead';
import Hero from '@/components/Hero';
import type { ProductWithCategory } from '@shared/schema';
import { 
  Gem, 
  Star, 
  Sparkles, 
  Shield, 
  Truck, 
  Award,
  ArrowRight,
  MapPin,
  Heart,
  Crown,
  Diamond
} from 'lucide-react';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const { data: featuredProducts, isLoading } = useQuery<ProductWithCategory[]>({
    queryKey: ['/api/products/featured'],
  });

  return (
    <>
      <SEOHead
        title="Troves & Coves - Sacred Crystal Jewellery | Mystical Healing Talismans | Winnipeg"
        description="Awaken your soul with sacred crystal jewellery and healing gemstone talismans in Winnipeg. Divine wire-wrapped pendants, blessed necklaces, and consecrated stones for spiritual transformation. Sacred consultations, metaphysical guidance, divine protection guaranteed."
        keywords="sacred crystal jewellery Winnipeg, mystical healing crystals Manitoba, spiritual talismans, wire wrapped pendants, lepidolite meditation, turquoise protection, citrine manifestation, rose quartz love, chakra jewellery, divine feminine, spiritual awakening, crystal healing Winnipeg"
        url="https://trovesandcoves.ca"
        type="website"
      />

      {/* Modern Hero Section */}
      <Hero />



    </>
  );
}
