import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Hero() {
  const [, setLocation] = useLocation();

  return (
    <section className="relative bg-navy overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-10 gradient-luxury opacity-90"></div>
      <div 
        className="relative h-screen flex items-center bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')`
        }}
      >
        <div className="container mx-auto px-4 z-20">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6">
              Timeless <span className="text-elegant-gold">Elegance</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
              Discover exquisite jewelry crafted with passion in the heart of Winnipeg. 
              Each piece tells a story of love, commitment, and unparalleled artistry.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="btn-luxury"
                onClick={() => setLocation('/products')}
              >
                Explore Collections
              </Button>
              <Button 
                className="btn-luxury-outline bg-transparent"
                onClick={() => setLocation('/contact')}
              >
                Book Consultation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
