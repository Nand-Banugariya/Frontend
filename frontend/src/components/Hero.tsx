
import { ChevronRight, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 px-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10 opacity-5">
        <div className="absolute w-96 h-96 rounded-full bg-saffron blur-3xl top-1/4 -left-48 animate-float"></div>
        <div className="absolute w-96 h-96 rounded-full bg-india-green blur-3xl bottom-1/4 -right-48 animate-float animate-delay-300"></div>
        <div className="absolute w-48 h-48 rounded-full bg-royal-blue blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-float animate-delay-200"></div>
      </div>

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 bg-pattern-light opacity-30 -z-10"></div>

      <div className="max-w-7xl mx-auto">
        <div className={`staggered-fade-in space-y-6 text-center max-w-4xl mx-auto ${isVisible ? 'visible' : 'invisible'}`}>
          <div className="inline-block px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-2">
            Discover the Soul of India
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight">
            Experience India's
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-saffron via-navy to-india-green block mt-2">
              Living Heritage
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Journey through centuries of traditions, arts, festivals, and stories that shape the cultural tapestry of Bhārat.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href="#explore"
              className="px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium flex items-center gap-2 transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
            >
              Explore Now <ChevronRight size={18} />
            </a>
            <a
              href="#stories"
              className="px-8 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary rounded-lg font-medium flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
            >
              Discover Stories <ChevronRight size={18} />
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center opacity-70 hover:opacity-100 transition-opacity cursor-pointer animate-bounce">
          <span className="text-sm font-medium mb-2">Scroll to Discover</span>
          <ChevronDown size={24} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
