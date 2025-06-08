import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ruler, Info, Heart } from "lucide-react";

export default function SizeGuide() {
  const necklaceLengths = [
    { name: "Choker", length: "14-16 inches", description: "Sits at the base of your neck, perfect for everyday wear" },
    { name: "Princess", length: "17-19 inches", description: "Classic length that sits just below the collarbone" },
    { name: "Matinee", length: "20-24 inches", description: "Falls at or just above the bust line" },
    { name: "Opera", length: "28-34 inches", description: "Long length perfect for layering or wearing doubled" },
    { name: "Rope", length: "35+ inches", description: "Versatile extra-long length for creative styling" }
  ];

  const braceletSizes = [
    { size: "XS", measurement: "6-6.5 inches", wrist: "Small wrist" },
    { size: "S", measurement: "6.5-7 inches", wrist: "Average small wrist" },
    { size: "M", measurement: "7-7.5 inches", wrist: "Average wrist" },
    { size: "L", measurement: "7.5-8 inches", wrist: "Large wrist" },
    { size: "XL", measurement: "8-8.5 inches", wrist: "Extra large wrist" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-warm via-pearl-cream to-moonstone">
      {/* Header */}
      <section className="relative bg-gradient-to-br from-pearl-cream via-crystal-accents to-pearl-cream text-navy overflow-hidden py-20">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-troves-turquoise to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-skull-turquoise to-transparent" />
        
        <div className="relative container mx-auto px-4 text-center">
          <div className="inline-block px-6 py-2 border border-ornate-frame-gold/20 rounded-lg bg-ornate-frame-gold/5 backdrop-blur-sm mb-6">
            <span className="text-ornate-frame-gold/80 text-sm font-medium tracking-wider uppercase">
              Sacred Guidance
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: 'var(--brand-font-heading)' }}>
            <span className="text-navy">Size Guide</span>
          </h1>
          
          <div className="w-24 h-1 mx-auto mb-6 bg-gradient-to-r from-transparent via-troves-turquoise to-transparent rounded-full" />
          
          <p className="text-navy/80 text-xl max-w-3xl mx-auto leading-relaxed">
            Find your perfect fit for our sacred crystal jewelry. Each piece is crafted to enhance your spiritual journey with optimal comfort and energy flow.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Necklace Size Guide */}
          <Card className="shadow-2xl border border-ornate-frame-gold/20 bg-gradient-to-br from-pearl-cream to-crystal-accents backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-troves-turquoise/10 to-skull-turquoise/10 border-b border-ornate-frame-gold/20">
              <CardTitle className="flex items-center space-x-3 text-troves-turquoise">
                <Ruler className="h-6 w-6 text-ornate-frame-gold" />
                <span className="font-bold text-xl">Necklace Lengths</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {necklaceLengths.map((item) => (
                  <div key={item.name} className="border border-ornate-frame-gold/10 rounded-lg p-4 bg-pearl-cream/50">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-navy">{item.name}</h3>
                      <Badge variant="secondary" className="bg-troves-turquoise/20 text-navy">
                        {item.length}
                      </Badge>
                    </div>
                    <p className="text-navy/70 text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bracelet Size Guide */}
          <Card className="shadow-2xl border border-ornate-frame-gold/20 bg-gradient-to-br from-pearl-cream to-crystal-accents backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-troves-turquoise/10 to-skull-turquoise/10 border-b border-ornate-frame-gold/20">
              <CardTitle className="flex items-center space-x-3 text-troves-turquoise">
                <Heart className="h-6 w-6 text-ornate-frame-gold" />
                <span className="font-bold text-xl">Bracelet Sizes</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {braceletSizes.map((item) => (
                  <div key={item.size} className="border border-ornate-frame-gold/10 rounded-lg p-4 bg-pearl-cream/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="border-troves-turquoise text-navy">
                          {item.size}
                        </Badge>
                        <span className="font-medium text-navy">{item.measurement}</span>
                      </div>
                    </div>
                    <p className="text-navy/70 text-sm">{item.wrist}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Measuring Guide */}
        <Card className="mt-12 shadow-2xl border border-ornate-frame-gold/20 bg-gradient-to-br from-pearl-cream to-crystal-accents backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-troves-turquoise/10 to-skull-turquoise/10 border-b border-ornate-frame-gold/20">
            <CardTitle className="flex items-center space-x-3 text-troves-turquoise">
              <Info className="h-6 w-6 text-ornate-frame-gold" />
              <span className="font-bold text-xl">How to Measure</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-navy mb-4">For Necklaces:</h3>
                <ul className="space-y-2 text-navy/80">
                  <li>• Use a flexible measuring tape or string</li>
                  <li>• Measure around your neck where you want the necklace to sit</li>
                  <li>• Add 2-3 inches for comfortable movement</li>
                  <li>• Consider your preferred neckline and styling</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-navy mb-4">For Bracelets:</h3>
                <ul className="space-y-2 text-navy/80">
                  <li>• Measure your wrist with a measuring tape</li>
                  <li>• Wrap snugly but not tight around wrist bone</li>
                  <li>• Add 0.5-1 inch for comfortable fit</li>
                  <li>• Consider if you prefer loose or snug fit</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 p-4 bg-skull-turquoise/10 rounded-lg border border-ornate-frame-gold/20">
              <h4 className="font-semibold text-navy mb-2">Custom Sizing Available</h4>
              <p className="text-navy/80 text-sm">
                Need a custom size? We offer personalized sizing for all our sacred jewelry pieces. 
                Contact us with your measurements and we'll craft the perfect fit for your spiritual journey.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}