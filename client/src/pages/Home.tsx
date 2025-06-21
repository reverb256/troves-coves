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

      {/* Featured Products Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-white via-troves-turquoise/5 to-gold-50 relative">
        <div className="container-jewelry">
          <div className="text-center mb-14">
            <h2 className="text-5xl md:text-6xl font-serif font-bold mb-4 tracking-tight text-troves-turquoise drop-shadow-lg">
              Curated <span className="bg-gradient-to-r from-troves-turquoise to-gold-400 bg-clip-text text-transparent">for You</span>
            </h2>
            <p className="text-lg md:text-xl text-troves-turquoise/80 max-w-2xl mx-auto">
              Each sacred stone is divinely chosen for its metaphysical properties and ethereal beauty, 
              transformed into talismans that honor your spiritual essence and divine purpose.
            </p>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="adaptive-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card-crystal p-6 card-uniform shimmer-effect">
                  <div className="animate-pulse">
                    <div className="h-40 bg-gradient-to-br from-stone-200 to-stone-100 rounded-lg mb-4"></div>
                    <div className="h-4 bg-stone-200 rounded mb-2"></div>
                    <div className="h-3 bg-stone-100 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="adaptive-grid">
              {featuredProducts?.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`}>
                  <Card className="rounded-3xl border border-gold-100 bg-white/80 shadow-lg hover:shadow-xl transition-all duration-500 group cursor-pointer h-full">
                    <CardContent className="p-6">
                      <div className="aspect-square mb-4 rounded-2xl overflow-hidden bg-gradient-to-br from-troves-turquoise/10 to-gold-50">
                        <img
                          src={product.imageUrl || '/api/placeholder/300/300'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <h3 className="text-2xl font-serif font-semibold mb-2 group-hover:text-troves-turquoise transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-troves-turquoise/80 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-gold-500">
                          ${product.price}
                        </span>
                        {product.category && (
                          <Badge className="bg-gold-50 border border-gold-200 text-troves-turquoise text-xs rounded-full px-3 py-1">
                            {product.category.name}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {/* View All Link */}
          <div className="text-center mt-14">
            <Link href="/products">
              <Button className="bg-troves-turquoise hover:bg-troves-turquoise/90 text-white text-lg px-8 py-4 rounded-full shadow-lg font-semibold transition-all duration-300 border-2 border-gold-200">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>


    </>
  );
}
