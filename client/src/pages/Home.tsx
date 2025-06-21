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
      <section className="py-12 md:py-16 relative">
        <div className="container-jewelry">
          <div className="text-center mb-16">
            <h2 className="text-display text-4xl md:text-5xl mb-6 layered-styling">
              <span className="text-crystal">Curated</span> for You
            </h2>
            <p className="text-body text-xl text-foreground-muted max-w-2xl mx-auto">
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
                  <Card className="mystical-card hover:gold-glow transition-all duration-500 group cursor-pointer h-full skull-accent">
                    <CardContent className="p-6">
                      <div className="aspect-square mb-4 rounded-lg overflow-hidden raw-crystal-texture">
                        <img
                          src={product.imageUrl || '/api/placeholder/300/300'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <h3 className="text-display text-xl mb-2 group-hover:text-rose-gold transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-body text-foreground-muted text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-display text-lg font-semibold text-gold-500">
                          ${product.price}
                        </span>
                        {product.category && (
                          <Badge className="highlight-rose-quartz text-xs">
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
          <div className="text-center mt-12">
            <Link href="/products">
              <Button variant="outline" className="glass-jewelry border-primary/20 hover:card-crystal px-8 py-3">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>


    </>
  );
}
