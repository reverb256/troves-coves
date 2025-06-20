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

      {/* Modern Hero Section with Framer Motion */}
      <Hero />

      {/* Featured Products Section */}
      <section className="py-12 md:py-16 relative">
        <div className="container-jewelry">
          {/* Section Header */}
          <div className="text-center mb-16">
            <Badge className="glass-jewelry mb-4 px-4 py-2 highlight-amethyst">
              <Star className="h-3 w-3 mr-2" />
              Featured Collection
            </Badge>
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

      {/* Features Section with Beaded Pattern */}
      <section className="py-24 bg-gradient-to-br from-background-secondary to-background-tertiary">
        <div className="container-jewelry">
          <div className="text-center mb-16">
            <h2 className="text-display text-4xl md:text-5xl mb-6">
              Why Choose <span className="text-rose-gold">Troves & Coves</span>
            </h2>
            <div className="beaded-pattern mx-auto max-w-xs mb-8"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Sacred Earth Gems',
                description: 'Every sacred stone is ethically sourced from Mother Earth and blessed with cleansing rituals before transformation.'
              },
              {
                icon: Crown,
                title: 'Divine Artistry',
                description: 'Hand-forged with precious metals through ancient wire-wrapping ceremonies, honoring timeless spiritual traditions.'
              },
              {
                icon: Heart,
                title: 'Mystical Attunement',
                description: 'Each talisman is lovingly charged with healing intentions and attuned to amplify your soul\'s vibrational essence.'
              }
            ].map(({ icon: Icon, title, description }) => (
              <div key={title} className="text-center group">
                <div className="pendant-style w-16 h-16 mx-auto mb-6 flex items-center justify-center group-hover:floating-crystal">
                  <Icon className="h-8 w-8" style={{ color: 'hsl(var(--wire-gold))' }} />
                </div>
                <h3 className="text-display text-xl mb-4 group-hover:text-rose-gold transition-colors">
                  {title}
                </h3>
                <p className="text-body text-foreground-muted">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with Obsidian Elements */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background-secondary to-background-tertiary"></div>
        <div className="absolute top-10 right-10 obsidian-arrowhead w-16 h-20 opacity-10"></div>
        <div className="absolute bottom-20 left-20 obsidian-arrowhead w-12 h-16 opacity-15"></div>
        
        <div className="container-jewelry relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-display text-4xl md:text-6xl mb-6">
              Begin Your <span className="text-crystal">Crystal Journey</span>
            </h2>
            <p className="text-body text-xl text-foreground-muted mb-8">
              Embark on a sacred consultation to unveil which divine crystals align with your soul's vibration and manifest your deepest spiritual intentions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="btn-organic text-lg px-8 py-4">
                  Book Consultation
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="outline" className="glass-jewelry hover:card-crystal text-lg px-8 py-4 border-primary/20">
                  View All Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
