import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/hooks/useCart";
import { Search, Heart, ShoppingBag, Menu } from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { itemCount, toggleCart } = useCart();

  const navigation = [
    { name: "All Crystals", href: "/products" },
    { name: "Crystal Necklaces", href: "/products/crystal-necklaces" },
    { name: "Healing Crystals", href: "/products/healing-crystals" },
    { name: "Wire Wrapped", href: "/products/wire-wrapped" },
    { name: "Contact", href: "/contact" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to products with search query
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="bg-navy text-white sticky top-0 z-50 luxury-shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/">
            <div className="text-2xl font-serif font-bold text-elegant-gold hover:text-yellow-400 transition-colors cursor-pointer">
              Troves & Coves
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <a className={`hover:text-elegant-gold transition-colors ${
                  location === item.href ? 'text-elegant-gold' : ''
                }`}>
                  {item.name}
                </a>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              {isSearchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center">
                  <Input
                    type="text"
                    placeholder="Search jewelry..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-48 bg-white/10 border-white/20 text-white placeholder-gray-400"
                    autoFocus
                    onBlur={() => !searchQuery && setIsSearchOpen(false)}
                  />
                  <Button type="submit" size="sm" variant="ghost" className="ml-2">
                    <Search className="h-4 w-4" />
                  </Button>
                </form>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSearchOpen(true)}
                  className="hover:text-elegant-gold transition-colors"
                >
                  <Search className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Wishlist */}
            <Button
              variant="ghost"
              size="sm"
              className="hover:text-elegant-gold transition-colors"
            >
              <Heart className="h-4 w-4" />
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCart}
              className="hover:text-elegant-gold transition-colors relative"
            >
              <ShoppingBag className="h-4 w-4" />
              {itemCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 bg-deep-burgundy text-white text-xs h-5 w-5 flex items-center justify-center p-0"
                >
                  {itemCount}
                </Badge>
              )}
            </Button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden hover:text-elegant-gold transition-colors">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-navy text-white border-gray-700">
                <div className="flex flex-col space-y-4 mt-8">
                  <Link href="/">
                    <div className="text-xl font-serif font-bold text-elegant-gold mb-8">
                      Troves & Coves
                    </div>
                  </Link>
                  {navigation.map((item) => (
                    <Link key={item.name} href={item.href}>
                      <a className={`block py-2 hover:text-elegant-gold transition-colors ${
                        location === item.href ? 'text-elegant-gold' : ''
                      }`}>
                        {item.name}
                      </a>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
