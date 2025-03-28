import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      
      {/* Featured Art Section */}
      <section id="arts" className="py-20 px-4 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-2">
              Artistic Excellence
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Traditional Arts & Crafts</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover the masterpieces created by skilled artisans, passed down through generations as a testament to India's creative heritage.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="animated-border p-6">
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx6IX1qermL3Bx94GVcVFgrtNVeVRdXPrJAQ&s" 
                alt="Traditional Indian Art" 
                className="rounded-lg shadow-lg w-full h-[400px] object-cover"
              />
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-serif font-bold heading-decoration">The Living Canvas</h3>
              <p className="text-gray-600 dark:text-gray-300">
                India's artistic traditions are as diverse as its landscapes, with each region developing unique styles that reflect local culture, history, and beliefs. From the intricate miniature paintings of Rajasthan to the bold Madhubani art of Bihar, these creative expressions tell stories of gods, heroes, everyday life, and cosmic truths.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Artisans across the country continue to practice these ancient techniques, keeping alive traditions that date back thousands of years. Many of these art forms serve not just an aesthetic purpose but also hold deep spiritual and cultural significance.
              </p>
              <div className="pt-4">
                <a 
                  href="#more-arts" 
                  className="px-6 py-2.5 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-lg font-medium transition-colors"
                >
                  Explore Art Forms
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Festival Highlights */}
      <section id="festivals" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-2">
              Celebrations & Traditions
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Festival Highlights</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Experience the joy, colors, and spiritual significance of India's diverse festivals that mark the rhythm of life.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="cultural-card animate-scaleIn" style={{ animationDelay: '0.1s' }}>
              <div className="relative overflow-hidden aspect-[5/3] rounded-t-xl">
                <img 
                  src="https://dims.apnews.com/dims4/default/a563f6c/2147483647/strip/false/crop/4500x3001+0+0/resize/1486x991!/quality/90/?url=https%3A%2F%2Fassets.apnews.com%2F8f%2F90%2F7895d6e91470dba7c6ccb2d5a4da%2F5a9cb53123a84899a0f3b7a9dc9cc2a5" 
                  alt="Holi Festival" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 bg-white/90 dark:bg-black/70 rounded-full text-xs font-medium">
                    March
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl font-bold mb-2">Holi: Festival of Colors</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  A vibrant celebration marking the arrival of spring, where people come together to throw colored powders, dance, and enjoy festive treats.
                </p>
              </div>
            </div>
            
            <div className="cultural-card animate-scaleIn" style={{ animationDelay: '0.2s' }}>
              <div className="relative overflow-hidden aspect-[5/3] rounded-t-xl">
                <img 
                  src="https://cdn.dnaindia.com/sites/default/files/styles/full/public/2021/11/04/1003926-diwali-ani.jpg" 
                  alt="Diwali Festival" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 bg-white/90 dark:bg-black/70 rounded-full text-xs font-medium">
                    October/November
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl font-bold mb-2">Diwali: Festival of Lights</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  India's most luminous celebration, symbolizing the victory of light over darkness with oil lamps, fireworks, and family gatherings.
                </p>
              </div>
            </div>
            
            <div className="cultural-card animate-scaleIn" style={{ animationDelay: '0.3s' }}>
              <div className="relative overflow-hidden aspect-[5/3] rounded-t-xl">
                <img 
                  src="https://theholidaysdestination.com/wp-content/uploads/2022/02/Onam-Festival.jpg" 
                  alt="Onam Festival" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 bg-white/90 dark:bg-black/70 rounded-full text-xs font-medium">
                    August/September
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl font-bold mb-2">Onam: Harvest Festival</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Kerala's grand harvest festival featuring elaborate flower carpets (pookalams), boat races, traditional dance, and sumptuous feasts.
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <a 
              href="#all-festivals" 
              className="px-6 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary rounded-lg font-medium shadow-md hover:shadow-lg transition-all inline-block"
            >
              View All Festivals
            </a>
          </div>
        </div>
      </section>
      
      {/* Quote Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-saffron/5 to-india-green/5">
        <div className="max-w-4xl mx-auto text-center">
          <blockquote className="text-2xl md:text-3xl font-serif italic font-medium text-gray-700 dark:text-gray-200">
            "India is the cradle of the human race, the birthplace of human speech, the mother of history, the grandmother of legend, and the great-grandmother of tradition."
          </blockquote>
          <cite className="block mt-4 text-lg font-medium text-gray-500">- Mark Twain</cite>
        </div>
      </section>
      
      {/* Newsletter */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl p-8 md:p-12 shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">Stay Connected with our Cultural Journey</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Subscribe to receive updates on new cultural stories, upcoming festivals, and heritage preservation efforts.
              </p>
            </div>
            
            <form className="max-w-xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white dark:bg-gray-800"
                  required
                />
                <button 
                  type="submit" 
                  className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors shadow-md shadow-primary/20"
                >
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">
                By subscribing, you agree to our Privacy Policy and consent to receive cultural updates via email.
              </p>
            </form>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
