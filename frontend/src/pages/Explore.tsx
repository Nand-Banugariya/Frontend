import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MapSection from '@/components/MapSection';
import { featuredItems, categories, HeritageItem } from '@/components/FeaturedSection';
import CulturalCard from '@/components/CulturalCard';
import { Button } from '@/components/ui/button';
import { BookmarkPlus, BookmarkCheck, Share2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { dashboardService } from '@/services/api';

const ExplorePage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [userBookmarks, setUserBookmarks] = useState<string[]>([]);
  
  // Filter items based on selected category
  const filteredItems = activeCategory === 'All' 
    ? featuredItems 
    : featuredItems.filter(item => item.category === activeCategory);
    
  // Filter history items for the map
  const historyItems = featuredItems.filter(item => item.category === 'History');
  
  // Item interaction handlers
  const handleBookmark = async (item: HeritageItem) => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to bookmark items');
      return;
    }
    
    try {
      // Format the item as a JSON string to store in bookmarks
      const itemId = `${item.title}`;
      
      await dashboardService.addBookmark(itemId);
      
      // Update local state to show bookmark is active
      setUserBookmarks(prev => [...prev, itemId]);
      
      toast.success(`"${item.title}" added to your bookmarks`);
    } catch (error: any) {
      console.error('Bookmark error:', error);
      toast.error(error.message || 'Failed to add bookmark');
    }
  };

  const isItemBookmarked = (itemTitle: string): boolean => {
    return userBookmarks.includes(itemTitle);
  };

  const handleShare = (itemId: number) => {
    // Will implement sharing functionality
    toast.info('Sharing feature coming soon!');
  };

  // Load user bookmarks if logged in
  useEffect(() => {
    const fetchUserBookmarks = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const bookmarks = await dashboardService.getBookmarks();
          setUserBookmarks(bookmarks);
        } catch (error) {
          console.error('Error fetching bookmarks:', error);
        }
      }
    };
    
    fetchUserBookmarks();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Explore India's Heritage</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover the rich cultural tapestry of India through its historical landmarks, artistic traditions, and vibrant celebrations.
          </p>
        </div>
      </div>
      
      {/* Map Section */}
      <section className="py-16 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <span className="inline-block px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-2">
              Interactive Map
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Historical Heritage Sites of India</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Explore the geographical distribution of India's magnificent historical landmarks.
            </p>
          </div>
          <MapSection historyItems={historyItems} />
        </div>
      </section>
      
      {/* Category Tabs & Cards Section */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <span className="inline-block px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-2">
              Featured Highlights
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Cultural Treasures</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Immerse yourself in the vivid tapestry of India's diverse cultural heritage through these curated experiences.
            </p>
          </div>
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredItems.map((item, index) => (
              <div key={item.id} className="relative group">
                <CulturalCard
                  title={item.title}
                  description={item.description}
                  imageSrc={item.imageSrc}
                  href={item.href}
                  category={item.category}
                  index={index}
                  id={item.id}
                />
                {/* Action buttons */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className={`rounded-full p-2 h-8 w-8 ${isItemBookmarked(item.title) ? 'bg-primary text-white' : ''}`}
                    title={isItemBookmarked(item.title) ? 'Bookmarked' : 'Bookmark'}
                    onClick={() => handleBookmark(item)}
                  >
                    {isItemBookmarked(item.title) ? (
                      <BookmarkCheck size={16} />
                    ) : (
                      <BookmarkPlus size={16} />
                    )}
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="rounded-full p-2 h-8 w-8" 
                    title="Share"
                    onClick={() => handleShare(item.id)}
                  >
                    <Share2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default ExplorePage; 