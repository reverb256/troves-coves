import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Facebook, Instagram, Youtube, MapPin, Clock, Phone, Mail } from "lucide-react";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // Mock newsletter subscription
    toast({
      title: "Thank you for subscribing!",
      description: "You'll receive updates about our latest collections and exclusive events.",
    });
    setEmail("");
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  const collections = [
    { name: "Engagement Rings", href: "/products/engagement" },
    { name: "Wedding Bands", href: "/products/heritage" },
    { name: "Necklaces", href: "/products" },
    { name: "Earrings", href: "/products" },
    { name: "Bracelets", href: "/products" },
    { name: "Custom Design", href: "/contact" },
  ];

  const customerCare = [
    { name: "Size Guide", href: "#" },
    { name: "Jewelry Care", href: "#" },
    { name: "Warranty", href: "#" },
    { name: "Returns & Exchanges", href: "#" },
    { name: "Financing", href: "#" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <footer className="bg-background border-t pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* Newsletter Section */}
        <div className="mb-12 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-foreground">Stay Connected</h2>
            <p className="text-xl text-foreground-muted mb-8">
              Be the first to discover new collections and exclusive events
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-input border-border text-foreground placeholder-muted-foreground focus:border-primary"
                required
              />
              <Button 
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
              >
                Subscribe
              </Button>
            </form>
            
            <p className="text-sm text-muted-foreground mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="text-2xl font-serif font-bold text-primary mb-6">
              Troves & Coves
            </div>
            <p className="text-foreground-muted mb-6">
              Winnipeg's premier destination for luxury jewelry, serving our community with 
              exceptional craftsmanship since 1990.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Button
                    key={social.label}
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-primary transition-colors p-2"
                    asChild
                  >
                    <a href={social.href} aria-label={social.label}>
                      <Icon className="h-5 w-5" />
                    </a>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Collections */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-foreground">Collections</h3>
            <ul className="space-y-3">
              {collections.map((item) => (
                <li key={item.name}>
                  <Link href={item.href}>
                    <a className="text-foreground-muted hover:text-primary transition-colors">
                      {item.name}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-foreground">Customer Care</h3>
            <ul className="space-y-3">
              {customerCare.map((item) => (
                <li key={item.name}>
                  <Link href={item.href}>
                    <a className="text-foreground-muted hover:text-primary transition-colors">
                      {item.name}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-foreground">Visit Us</h3>
            <div className="space-y-4 text-foreground-muted">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-foreground">Downtown Showroom</div>
                  <div>123 Main Street</div>
                  <div>Winnipeg, MB R3B 1A5</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <div>
                  <div className="font-medium text-foreground">(204) 555-GEMS</div>
                  <div className="text-sm">Speak with our jewelry experts</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <div>
                  <div className="font-medium text-foreground">info@trovesandcoves.ca</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-foreground">Hours</div>
                  <div>Mon-Sat: 10AM-6PM</div>
                  <div>Sun: By Appointment</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-muted-foreground text-sm mb-4 md:mb-0">
              © 2024 Troves & Coves. All rights reserved. | 
              <a href="#" className="hover:text-primary transition-colors ml-1">Privacy Policy</a> | 
              <a href="#" className="hover:text-primary transition-colors ml-1">Terms of Service</a>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-muted-foreground text-sm">Secure payments powered by</span>
              <div className="flex space-x-2 text-muted-foreground">
                <span className="text-2xl">💳</span>
                <span className="text-sm">Visa, Mastercard, Amex, PayPal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
