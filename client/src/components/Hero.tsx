export default function Hero() {
  return (
    <section
      className="relative bg-navy overflow-hidden"
      role="banner"
      aria-label="Hero Section"
    >
      {/* Floating crystal elements */}
      <div className="absolute w-2 h-2 bg-elegant-gold rounded-full top-10 left-10 animate-pulse"></div>
      <div className="absolute w-2 h-2 bg-elegant-gold rounded-full top-1/2 left-1/3 animate-pulse"></div>
      <div className="absolute w-2 h-2 bg-elegant-gold rounded-full bottom-10 right-10 animate-pulse"></div>
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
              Troves <span className="text-elegant-gold">& Coves</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
              Sacred crystal jewelry and healing gemstone talismans in Winnipeg.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/products"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 btn-luxury"
              >
                Browse our crystal jewelry
              </a>
              <a
                href="/about"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 btn-luxury-outline bg-transparent"
              >
                Learn more about our spiritual story
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
