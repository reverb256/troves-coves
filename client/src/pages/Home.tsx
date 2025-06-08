import { useQuery } from "@tanstack/react-query";
import Hero from "@/components/Hero";
import FeaturesBar from "@/components/FeaturesBar";
import ProductCard from "@/components/ProductCard";
import AIAssistant from "@/components/AIAssistant";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";
import { Star, MapPin, Clock, Phone } from "lucide-react";
import type { ProductWithCategory, Category } from "@shared/schema";

export default function Home() {
  const [, setLocation] = useLocation();

  // Fetch featured products
  const { data: featuredProducts, isLoading: isLoadingProducts } = useQuery<ProductWithCategory[]>({
    queryKey: ['/api/products?featured=true'],
  });

  // Fetch categories
  const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const testimonials = [
    {
      id: 1,
      rating: 5,
      content: "The most beautiful engagement ring and exceptional service. The AI consultation helped us understand every detail before making our decision.",
      author: "Sarah & Michael",
      location: "Winnipeg, MB",
      avatar: "https://images.unsplash.com/photo-1521341957697-b93449760f30?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    },
    {
      id: 2,
      rating: 5,
      content: "Three generations of our family have shopped here. The craftsmanship and personal service are unmatched in Winnipeg.",
      author: "Eleanor W.",
      location: "River Heights, MB",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b332e234?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    },
    {
      id: 3,
      rating: 5,
      content: "The custom design process was seamless. They turned our vision into the most stunning anniversary piece. Truly exceptional artisans.",
      author: "David C.",
      location: "Tuxedo, MB",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <Hero />

      {/* Features Bar */}
      <FeaturesBar />

      {/* Featured Collections */}
      <section className="py-20 bg-warm-cream">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-navy mb-6">
              Featured Collections
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our carefully curated collections, each piece selected for its exceptional beauty and craftsmanship.
            </p>
          </div>

          {isLoadingCategories ? (
            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-80 w-full rounded-lg" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              {categories?.slice(0, 3).map((category) => (
                <Card
                  key={category.id}
                  className="group cursor-pointer overflow-hidden luxury-shadow hover:luxury-shadow-lg transition-all duration-300"
                  onClick={() => setLocation(`/products/${category.slug}`)}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={category.imageUrl || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'}
                      alt={category.name}
                      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-serif font-semibold text-navy mb-2">
                      {category.name}
                    </h3>
                    <p className="text-gray-600">{category.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-navy mb-6">
              Handpicked for You
            </h2>
            <p className="text-xl text-gray-600">Discover our most beloved pieces</p>
          </div>

          {isLoadingProducts ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-64 w-full rounded-lg" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-8 w-1/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts?.map((product) => (
                <ProductCard key={product.id} product={product} featured />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* AI Assistant Section */}
      <AIAssistant />

      {/* Local Winnipeg Section */}
      <section className="py-20 bg-warm-cream">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1528495612343-9ca9f4a4de28?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                alt="Winnipeg Cityscape"
                className="rounded-xl luxury-shadow-lg w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent rounded-xl"></div>
            </div>

            <div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-navy mb-6">
                Proudly <span className="text-elegant-gold">Winnipeg</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                For over three decades, we've been part of Winnipeg's story. From the Exchange District 
                to Osborne Village, our jewelry has marked life's most precious moments for Manitoba families.
              </p>

              <div className="space-y-6 mb-8">
                <div className="flex items-center space-x-4">
                  <MapPin className="text-elegant-gold text-xl w-5 h-5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-lg">Downtown Showroom</div>
                    <div className="text-gray-600">123 Main Street, Exchange District</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Clock className="text-elegant-gold text-xl w-5 h-5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-lg">By Appointment</div>
                    <div className="text-gray-600">Private consultations available</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Phone className="text-elegant-gold text-xl w-5 h-5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-lg">(204) 555-GEMS</div>
                    <div className="text-gray-600">Speak with our jewelry experts</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  className="bg-navy text-white hover:bg-rich-blue"
                  onClick={() => setLocation('/contact')}
                >
                  Visit Our Showroom
                </Button>
                <Button 
                  variant="outline" 
                  className="border-navy text-navy hover:bg-navy hover:text-white"
                >
                  Virtual Tour
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-navy mb-6">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600">Trusted by Winnipeg families for generations</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="bg-warm-cream luxury-shadow">
                <CardContent className="p-8">
                  <div className="text-elegant-gold text-2xl mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="inline w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                  <div className="flex items-center space-x-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold">{testimonial.author}</div>
                      <div className="text-sm text-gray-600">{testimonial.location}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
