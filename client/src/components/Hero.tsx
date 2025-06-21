import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Gem, 
  Star, 
  Sparkles, 
  Heart,
  Crown,
  MapPin,
  ArrowRight
} from 'lucide-react';

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="hero-gold-luxury relative py-20 md:py-32 flex items-center justify-center overflow-hidden">
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
        
        {/* Sparkle Elements */}
        <div className="absolute top-[15%] left-[20%] text-elegant-gold text-lg animate-pulse opacity-70">✨</div>
        <div className="absolute top-[30%] right-[25%] text-troves-turquoise text-xl animate-bounce opacity-60" style={{ animationDelay: '0.5s' }}>⭐</div>
        <div className="absolute bottom-[25%] left-[15%] text-elegant-gold text-lg animate-pulse opacity-50" style={{ animationDelay: '1s' }}>💎</div>
        <div className="absolute bottom-[40%] right-[20%] text-skull-turquoise text-xl animate-bounce opacity-70" style={{ animationDelay: '1.5s' }}>✨</div>
        <div className="absolute top-[60%] left-[70%] text-elegant-gold text-lg animate-pulse opacity-60" style={{ animationDelay: '2s' }}>⭐</div>
        <div className="absolute top-[45%] right-[80%] text-troves-turquoise text-xl animate-bounce opacity-50" style={{ animationDelay: '0.3s' }}>💎</div>
      </div>

      {/* Content */}
      <div className={`relative z-10 container-jewelry text-center transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        {/* Badge */}
        <Badge className="luxury-badge mb-6 px-6 py-2 text-sm font-medium tracking-wider uppercase inline-flex items-center whitespace-nowrap min-w-[320px]">
          <Sparkles className="h-3 w-3 mr-2 flex-shrink-0" />
          <span>Authentic Canadian Crystal Artistry</span>
        </Badge>

        {/* Authentic Brand Heading from Wooden Sign */}
        <h1 className="text-display text-5xl md:text-7xl lg:text-8xl mb-6 tracking-tight">
          <span className="block mb-2">
            <span className="troves-text-style">Troves</span>
            <span className="and-text-style">&</span>
            <span className="coves-text-style">Coves</span>
          </span>
          <span className="block text-3xl md:text-4xl lg:text-5xl text-foreground-muted font-normal tracking-wide">
            Handcrafted Crystal Jewellery
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

        {/* CTA Buttons with Enhanced UX */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products/crystal-necklaces">
            <Button className="luxury-button button-interactive text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300">
              Shop Crystal Necklaces
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/ai-assistant">
            <Button variant="outline" className="glass-jewelry button-interactive text-lg px-8 py-4 border-primary/20 shadow-md hover:shadow-lg transition-all duration-300">
              Get Crystal Guidance
              <Sparkles className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Quick Navigation Pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-8 pt-8 border-t border-white/10">
          <Link href="/products/healing-crystals">
            <Badge className="pendant-style badge-interactive hover-sparkle cursor-pointer px-4 py-2">
              <Heart className="h-3 w-3 mr-1" />
              Healing Stones
            </Badge>
          </Link>
          <Link href="/products/wire-wrapped">
            <Badge className="pendant-style badge-interactive hover-sparkle cursor-pointer px-4 py-2">
              <Crown className="h-3 w-3 mr-1" />
              Wire Wrapped
            </Badge>
          </Link>
          <Link href="/contact">
            <Badge className="pendant-style badge-interactive hover-sparkle cursor-pointer px-4 py-2">
              <MapPin className="h-3 w-3 mr-1" />
              Connect Online
            </Badge>
          </Link>
        </div>
      </div>
    </section>
  );
}
