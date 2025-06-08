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
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background-secondary to-background-tertiary">
          {/* Floating Particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 4}s`,
                  animationDuration: `${3 + Math.random() * 4}s`
                }}
              >
                <Sparkles className="h-2 w-2 text-primary/20" />
              </div>
            ))}
          </div>
          
          {/* Gradient Orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Content */}
        <div className={`relative z-10 container-luxury text-center transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Badge */}
          <Badge className="glass mb-6 px-6 py-2 text-sm font-medium tracking-wider uppercase">
            <MapPin className="h-3 w-3 mr-2" />
            Winnipeg's Premier Crystal Jewelry
          </Badge>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
            <span className="block gold-text mb-2">Troves & Coves</span>
            <span className="block text-3xl md:text-4xl lg:text-5xl text-foreground-muted font-normal tracking-wide">
              Luxury Crystal Jewelry
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-foreground-muted max-w-3xl mx-auto mb-8 leading-relaxed">
            Discover handcrafted crystal jewelry that harmonizes ancient wisdom with modern elegance. 
            Each piece is lovingly created to enhance your natural radiance and spiritual journey.
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {[
              { icon: Crown, text: 'Premium Quality' },
              { icon: Shield, text: 'Authentic Crystals' },
              { icon: Heart, text: 'Handcrafted' },
              { icon: Award, text: 'Local Artisan' }
            ].map(({ icon: Icon, text }, index) => (
              <div 
                key={text}
                className="flex items-center glass px-4 py-2 rounded-full fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Icon className="h-4 w-4 text-primary mr-2" />
                <span className="text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button className="btn-luxury text-lg px-8 py-4 group">
                Explore Collection
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="glass hover:glass-card text-lg px-8 py-4 border-primary/20 hover:border-primary/40">
                Crystal Consultation
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-24 relative">
        <div className="container-luxury">
          {/* Section Header */}
          <div className="text-center mb-16 fade-in-up">
            <Badge className="glass mb-4 px-4 py-2">
              <Star className="h-3 w-3 mr-2" />
              Featured Collection
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gold-text">Curated</span> for You
            </h2>
            <p className="text-xl text-foreground-muted max-w-2xl mx-auto">
              Each crystal is hand-selected for its unique properties and aesthetic beauty, 
              crafted into jewelry that tells your story.
            </p>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-card p-6 rounded-2xl animate-pulse">
                  <div className="w-full h-64 bg-muted rounded-xl mb-4" />
                  <div className="h-4 bg-muted rounded mb-2" />
                  <div className="h-3 bg-muted rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts?.slice(0, 6).map((product, index) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Card className="glass-card overflow-hidden border-0 hover:scale-105 transition-all duration-500 group-hover:shadow-2xl">
                    <div className="relative overflow-hidden">
                      <div className="w-full h-64 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center relative">
                        <Gem className="h-16 w-16 text-primary float-animation" />
                        <div className="absolute inset-0 shimmer" />
                      </div>
                      <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                        ${product.price}
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-foreground-muted mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="glass">
                          {product.category?.name}
                        </Badge>
                        <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 relative">
        <div className="container-luxury">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose <span className="gold-text">Troves & Coves</span>
            </h2>
            <p className="text-xl text-foreground-muted max-w-2xl mx-auto">
              Experience the perfect blend of craftsmanship, authenticity, and spiritual connection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: 'Authentic Crystals',
                description: 'Sourced directly from trusted suppliers worldwide, each crystal is genuine and energetically cleansed.'
              },
              {
                icon: Crown,
                title: 'Premium Materials',
                description: '14k gold filled, sterling silver, and copper wire ensure lasting beauty and durability.'
              },
              {
                icon: Heart,
                title: 'Handcrafted Love',
                description: 'Every piece is lovingly created by skilled artisans with attention to detail and intention.'
              },
              {
                icon: MapPin,
                title: 'Winnipeg Local',
                description: 'Proudly serving the Winnipeg community with personalized service and local expertise.'
              }
            ].map(({ icon: Icon, title, description }, index) => (
              <div 
                key={title}
                className="text-center fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="glass-card p-8 rounded-2xl group hover:scale-105 transition-all duration-300">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 gold-glow rounded-full opacity-20" />
                    <Icon className="h-12 w-12 text-primary mx-auto relative z-10" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors">
                    {title}
                  </h3>
                  <p className="text-foreground-muted leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container-luxury text-center">
          <div className="glass-card p-12 rounded-3xl max-w-4xl mx-auto fade-in-up">
            <Diamond className="h-16 w-16 text-primary mx-auto mb-6 float-animation" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Begin Your <span className="gold-text">Crystal Journey</span>
            </h2>
            <p className="text-xl text-foreground-muted mb-8 max-w-2xl mx-auto">
              Let us help you find the perfect crystal jewelry that resonates with your energy and style. 
              Book a consultation or explore our collection today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="btn-luxury text-lg px-8 py-4">
                  Book Consultation
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="outline" className="glass hover:glass-card text-lg px-8 py-4 border-primary/20">
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