import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SEOHead from '@/components/SEOHead';
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
        title="Troves & Coves - Premium Crystal Jewelry | Winnipeg Manitoba"
        description="Discover exquisite crystal jewelry and healing stones in Winnipeg. Handcrafted necklaces, wire-wrapped pendants, and authentic crystals. Free local delivery, expert crystal consultations, premium quality guaranteed."
        keywords="crystal jewelry Winnipeg, healing crystals Manitoba, handmade necklaces, wire wrapped jewelry, lepidolite, turquoise, citrine, rose quartz, local jewelry store, spiritual jewelry, Winnipeg artisan, Manitoba crystals"
        url="https://troves-and-coves.com"
        type="website"
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Organic Background with Crystal Elements */}
        <div className="absolute inset-0">
          {/* Floating Crystal Shapes */}
          <div className="absolute inset-0">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className={`absolute floating-crystal opacity-30 ${
                  i % 3 === 0 ? 'crystal-frame bg-gradient-to-br from-purple-200/20 to-purple-300/10' :
                  i % 3 === 1 ? 'faceted-frame bg-gradient-to-br from-pink-200/30 to-orange-200/20' :
                  'rounded-full bg-gradient-to-br from-stone-100/40 to-stone-50/20'
                }`}
                style={{
                  width: `${20 + Math.random() * 40}px`,
                  height: `${20 + Math.random() * 40}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 6}s`,
                  animationDuration: `${8 + Math.random() * 4}s`
                }}
              />
            ))}
          </div>
          
          {/* Wire-wrap inspired decorative elements */}
          <div className="absolute top-1/4 left-1/6 w-32 h-32 wire-wrap rounded-full opacity-20"></div>
          <div className="absolute bottom-1/3 right-1/5 w-24 h-24 wire-wrap faceted-frame opacity-15"></div>
        </div>

        {/* Content */}
        <div className={`relative z-10 container-jewelry text-center transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Badge */}
          <Badge className="glass-jewelry mb-6 px-6 py-2 text-sm font-medium tracking-wider uppercase highlight-rose-quartz">
            <MapPin className="h-3 w-3 mr-2" />
            Winnipeg's Premier Crystal Jewelry
          </Badge>

          {/* Main Heading */}
          <h1 className="text-display text-5xl md:text-7xl lg:text-8xl mb-6 tracking-tight">
            <span className="block text-rose-gold mb-2">Troves & Coves</span>
            <span className="block text-3xl md:text-4xl lg:text-5xl text-foreground-muted font-normal tracking-wide">
              Handcrafted Crystal Jewelry
            </span>
          </h1>

          {/* Description */}
          <p className="text-body text-xl md:text-2xl text-foreground-muted max-w-3xl mx-auto mb-8 leading-relaxed">
            Where sacred gemstone energies merge with artisan craftsmanship. Each piece channels ancient crystal wisdom 
            to amplify your inner light, promote spiritual healing, and guide your soul's awakening journey.
          </p>

          {/* Features with Wire-Wrap Aesthetic */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="pendant-style flex items-center gap-2 px-4 py-2">
              <Sparkles className="h-4 w-4" style={{ color: 'hsl(var(--wire-gold))' }} />
              <span className="text-sm font-medium">Sacred Wire-Wrapping</span>
            </div>
            <div className="pendant-style flex items-center gap-2 px-4 py-2">
              <Gem className="h-4 w-4" style={{ color: 'hsl(var(--turquoise-deep))' }} />
              <span className="text-sm font-medium">Genuine Earth Crystals</span>
            </div>
            <div className="pendant-style flex items-center gap-2 px-4 py-2">
              <Heart className="h-4 w-4" style={{ color: 'hsl(var(--carnelian-orange))' }} />
              <span className="text-sm font-medium">Metaphysical Healing</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button className="btn-organic text-lg px-8 py-4">
                Discover Collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="glass-jewelry hover:card-crystal text-lg px-8 py-4 border-primary/20">
                Book Crystal Reading
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-24 relative">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card-crystal p-6 h-80 shimmer-effect">
                  <div className="animate-pulse">
                    <div className="h-40 bg-gradient-to-br from-stone-200 to-stone-100 rounded-lg mb-4"></div>
                    <div className="h-4 bg-stone-200 rounded mb-2"></div>
                    <div className="h-3 bg-stone-100 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts?.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`}>
                  <Card className="card-crystal hover:crystal-glow transition-all duration-500 group cursor-pointer h-full">
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
                        <span className="text-display text-lg font-semibold text-rose-gold">
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