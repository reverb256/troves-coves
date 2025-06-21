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
    <section
      className="relative flex items-center justify-center overflow-hidden py-24 md:py-36 bg-gradient-to-br from-white via-troves-turquoise/10 to-gold-50"
      style={{ minHeight: '70vh' }}
    >
      {/* Minimal floating accent */}
      <div className="absolute top-10 left-10 w-8 h-8 rounded-full bg-gradient-to-br from-troves-turquoise to-gold-300 opacity-20 blur-2xl"></div>
      <div className="absolute bottom-10 right-10 w-12 h-12 rounded-full bg-gradient-to-br from-gold-200 to-troves-turquoise opacity-10 blur-2xl"></div>

      {/* Content */}
      <div className={`relative z-10 container-jewelry text-center transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        {/* Badge */}
        <Badge className="mb-8 px-6 py-2 text-sm font-medium tracking-wider uppercase inline-flex items-center whitespace-nowrap bg-white/80 text-troves-turquoise border border-gold-200 shadow-sm">
          <Sparkles className="h-3 w-3 mr-2 flex-shrink-0 text-gold-400" />
          <span>Authentic Canadian Crystal Artistry</span>
        </Badge>

        {/* Main Headline */}
        <h1 className="text-display text-6xl md:text-8xl font-serif font-bold mb-8 tracking-tight text-troves-turquoise drop-shadow-lg" style={{ letterSpacing: '-0.04em' }}>
          Troves
          <span
            className="mx-4"
            style={{
              fontFamily: '"Dancing Script", "Playfair Display", "cursive", "serif"',
              fontWeight: 700,
              fontSize: '1.2em',
              background: 'linear-gradient(90deg, #14b8a6 0%, #ffd700 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block',
              verticalAlign: 'middle'
            }}
          >
            &
          </span>
          Coves
        </h1>

        {/* Subheadline */}
        <h2 className="text-2xl md:text-3xl font-medium text-gold-700 mb-6">
          Handcrafted Crystal Jewellery
        </h2>

        {/* Description */}
        <p className="text-base md:text-lg text-troves-turquoise/80 max-w-2xl mx-auto mb-10 leading-relaxed" style={{ fontWeight: 400 }}>
          Sacred gemstone energies meet artisan craftsmanship. Each piece channels ancient crystal wisdom to amplify your inner light and guide your soul’s journey.
        </p>

        {/* Features */}
        <div className="flex flex-wrap justify-center gap-6 mb-14">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-gold-100 shadow-sm">
            <Sparkles className="h-4 w-4 text-gold-400" />
            <span className="text-sm font-medium text-troves-turquoise">Wire-Wrapped</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-gold-100 shadow-sm">
            <Gem className="h-4 w-4 text-troves-turquoise" />
            <span className="text-sm font-medium text-troves-turquoise">Earth Crystals</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-gold-100 shadow-sm">
            <Heart className="h-4 w-4 text-gold-400" />
            <span className="text-sm font-medium text-troves-turquoise">Healing Energy</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center mb-6">
          <Link href="/products/crystal-necklaces">
            <Button className="bg-troves-turquoise hover:bg-troves-turquoise/90 text-white text-lg px-8 py-4 rounded-full shadow-lg font-semibold transition-all duration-300 border-2 border-gold-200">
              Shop Crystal Necklaces
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/ai-assistant">
            <Button variant="outline" className="border-gold-200 text-troves-turquoise text-lg px-8 py-4 rounded-full shadow-md font-semibold transition-all duration-300 bg-white/80 hover:bg-gold-50">
              Get Crystal Guidance
              <Sparkles className="ml-2 h-4 w-4 text-gold-400" />
            </Button>
          </Link>
        </div>

        {/* Quick Navigation Pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-10 pt-6 border-t border-gold-100">
          <Link href="/products/healing-crystals">
            <Badge className="bg-white/80 border border-gold-100 text-troves-turquoise px-4 py-2 rounded-full hover:bg-gold-50 cursor-pointer">
              <Heart className="h-3 w-3 mr-1 text-gold-400" />
              Healing Stones
            </Badge>
          </Link>
          <Link href="/products/wire-wrapped">
            <Badge className="bg-white/80 border border-gold-100 text-troves-turquoise px-4 py-2 rounded-full hover:bg-gold-50 cursor-pointer">
              <Crown className="h-3 w-3 mr-1 text-gold-400" />
              Wire Wrapped
            </Badge>
          </Link>
          <Link href="/contact">
            <Badge className="bg-white/80 border border-gold-100 text-troves-turquoise px-4 py-2 rounded-full hover:bg-gold-50 cursor-pointer">
              <MapPin className="h-3 w-3 mr-1 text-gold-400" />
              Connect Online
            </Badge>
          </Link>
        </div>
      </div>
    </section>
  );
}
