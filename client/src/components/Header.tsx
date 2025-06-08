import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCartContext } from '@/lib/store';
import { ShoppingCart, Menu, Gem, Star, Search, ArrowRight } from 'lucide-react';

export default function Header() {
  const [location] = useLocation();
  const { itemCount } = useCartContext();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Home', path: '/' },
    { name: 'Crystal Necklaces', path: '/products/crystal-necklaces' },
    { name: 'Healing Crystals', path: '/products/healing-crystals' },
    { name: 'Wire Wrapped', path: '/products/wire-wrapped' },
    { name: 'AI Consultant', path: '/ai-assistant' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActivePath = (path: string) => {
    if (path === '/' && location === '/') return true;
    if (path !== '/' && location.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Luxury Header */}
      <header 
        className={`fixed top-0 w-full z-50 transition-all duration-300 will-change-transform ${
          isScrolled 
            ? 'glass-card backdrop-blur-xl border-b border-white/10' 
            : 'bg-transparent'
        }`}
        style={{ transform: 'translateZ(0)' }}
      >
        <div className="container-luxury">
          <nav className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 gold-glow rounded-full opacity-20"></div>
                <Gem className="h-8 w-8 text-turquoise-500 relative z-10 float-animation" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight">
                  <span className="text-turquoise-500 font-bold">Troves</span>
                  <span className="text-muted-foreground mx-1">&</span>
                  <span className="text-amber-400 font-cursive italic">Coves</span>
                </span>
                <span className="text-xs text-muted-foreground -mt-1 tracking-widest uppercase">
                  Crystal Jewelry • Winnipeg
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 group ${
                    isActivePath(item.path)
                      ? 'text-primary'
                      : 'text-foreground hover:text-primary'
                  }`}
                >
                  {item.name}
                  <span 
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-primary/50 transition-all duration-300 ${
                      isActivePath(item.path) 
                        ? 'scale-x-100' 
                        : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </Link>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Search Button */}
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex items-center space-x-2 glass hover:glass-card transition-all duration-300"
              >
                <Search className="h-4 w-4" />
                <span className="text-sm">Search</span>
              </Button>

              {/* Cart Button */}
              <Link href="/checkout">
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative glass hover:glass-card transition-all duration-300"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <Badge 
                      className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-primary text-primary-foreground gold-glow"
                    >
                      {itemCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* Mobile Menu */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden glass hover:glass-card"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="glass-card border-l border-white/10 w-80">
                  <div className="flex flex-col h-full">
                    {/* Mobile Logo */}
                    <div className="flex items-center space-x-3 pb-8">
                      <Gem className="h-6 w-6 text-primary" />
                      <div>
                        <span className="text-lg font-bold gold-text">Troves & Coves</span>
                        <p className="text-xs text-muted-foreground">Crystal Jewelry • Winnipeg</p>
                      </div>
                    </div>

                    {/* Mobile Navigation */}
                    <nav className="flex-1 space-y-2">
                      {navigation.map((item) => (
                        <Link
                          key={item.path}
                          href={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 group ${
                            isActivePath(item.path)
                              ? 'glass-card text-primary'
                              : 'hover:glass text-foreground hover:text-primary'
                          }`}
                        >
                          <span className="font-medium">{item.name}</span>
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      ))}
                    </nav>

                    {/* Mobile Footer */}
                    <div className="pt-6 border-t border-white/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Star className="h-4 w-4 text-primary" />
                          <span className="text-sm text-muted-foreground">Premium Quality</span>
                        </div>
                        <Badge variant="secondary" className="glass">
                          Winnipeg Local
                        </Badge>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </nav>
        </div>

        {/* Premium Underline Effect */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </header>

      {/* Spacer for fixed header */}
      <div className="h-20" />
    </>
  );
}