import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CulturalCard from './CulturalCard';
import MapSection from './MapSection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { UserPlus, LogIn, BookmarkPlus, Share2, BookmarkCheck } from 'lucide-react';
import { authService, dashboardService } from '@/services/api';
import { toast } from 'sonner';

export const categories = [
  'All',
  'Art & Craft',
  'Festivals',
  'Cuisine',
  'Music & Dance',
  'History'
];

export interface HeritageItem {
  id: number;
  title: string;
  description: string;
  imageSrc: string;
  category: string;
  href: string;
}

export const featuredItems: HeritageItem[] = [
  {
    id: 1,
    title: 'The Art of Madhubani',
    description: 'Explore the intricate patterns and vibrant colors of Madhubani painting, a traditional art form from Bihar.',
    imageSrc: 'https://d35l77wxi0xou3.cloudfront.net/opencart/image/productFromFeb2020/Traditional%20Madhubani%20Painting1615964610-600x600.jpg',
    category: 'Art & Craft',
    href: '#art'
  },
  {
    id: 2,
    title: 'Festival of Lights: Diwali',
    description: 'Discover the meaning behind the traditions and celebrations of India\'s most luminous festival.',
    imageSrc: 'https://cdn.dnaindia.com/sites/default/files/styles/full/public/2021/11/04/1003926-diwali-ani.jpg',
    category: 'Festivals',
    href: '#festivals'
  },
  {
    id: 4,
    title: 'Classical Bharatanatyam',
    description: 'Learn about one of India\'s oldest classical dance forms, known for its grace, expression, and spirituality.',
    imageSrc: 'https://karnatakatourism.org/wp-content/uploads/2020/05/Dane.jpg',
    category: 'Music & Dance',
    href: '#music'
  },
  {
    id: 5,
    title: 'The Majestic Taj Mahal',
    description: 'Explore the history, architecture, and eternal love story behind this iconic wonder of the world.',
    imageSrc: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1964&auto=format&fit=crop',
    category: 'History',
    href: '#history'
  },
  {
    id: 6,
    title: "The Sacred City of Varanasi",
    "description": "Discover the ancient city of Varanasi, where the Ganges River flows and spirituality comes alive. Learn about its ghats, temples, and the profound Hindu rituals that define this sacred place.",
    imageSrc: "https://t4.ftcdn.net/jpg/04/08/25/05/360_F_408250543_MVaEVGeWxb4FiFy7mEGKj8nfYkwoAZON.jpg?q=80&w=2070&auto=format&fit=crop",
    category: "History",
    href: "#history"
  },
  {
    id: 7,
    title: "The Magnificent Meenakshi Temple",
    description: "Explore the stunning Meenakshi Temple in Madurai, dedicated to Goddess Parvati. Admire its intricate carvings, towering gopurams, and the rich cultural heritage of Tamil Nadu.",
    imageSrc: "https://media.tacdn.com/media/attractions-splice-spp-674x446/13/cd/65/14.jpg?q=80&w=1932&auto=format&fit=crop",
    category: "History",
    href: "#history"
  },
  {
    id: 8,
    title: "The Temples of Khajuraho",
    description: "Marvel at the exquisite temples of Khajuraho, renowned for their erotic sculptures and intricate artistry. Learn about their historical and cultural significance.",
    imageSrc: "https://t4.ftcdn.net/jpg/02/85/43/37/360_F_285433744_iUcC83UYSfOuJjtXIiWiUbjWezGWlTbJ.jpg?q=80&w=1978&auto=format&fit=crop",
    category: "History",
    href: "#history"
  },
  {
    id: 9,
    title: "The Jagannath Temple of Puri",
    "description": "Visit the iconic Jagannath Temple in Puri, Odisha. Learn about its history, the annual Rath Yatra festival, and its significance in Hindu culture.",
    imageSrc: "https://i.pinimg.com/736x/a9/20/0d/a9200d2079ff66d583f09d59263feeb8.jpg?q=80&w=1932&auto=format&fit=crop",
    category: "History",
    href: "#history"
  },
  {
    id: 10,
    title: 'Warli Folk Painting',
    description: 'Discover the simple yet profound tribal art form that uses basic geometric shapes to depict daily life.',
    imageSrc: 'https://www.aprearthouse.com/cdn/shop/articles/sagar-yende-and-prof.-ravi-poovaiah-idc-iit-bombay-2-1702462104540_1200x-1703152291702.jpg?v=1703152300',
    category: 'Art & Craft',
    href: '#art'
  },
  // Additional entries for each category
  // Art & Craft
  {
    id: 11,
    title: 'Phad Painting of Rajasthan',
    description: 'Immerse yourself in the storytelling art of Phad, which depicts epic narratives on scrolls.',
    imageSrc: 'https://5.imimg.com/data5/KE/XP/MY-8086796/phad-painting-500x500.jpg',
    category: 'Art & Craft',
    href: '#art'
  },
  {
    id: 12,
    title: 'Patachitra of Odisha',
    description: 'Explore the ancient art of Patachitra, known for its intricate details and mythological themes.',
    imageSrc: 'https://umaid.art/wp-content/uploads/2022/08/pattachitra-6.jpg',
    category: 'Art & Craft',
    href: '#art'
  },
  {
    id: 13,
    title: 'Kalamkari Art',
    description: 'Discover the elegant hand-painted and block-printed textiles from Andhra Pradesh.',
    imageSrc: 'https://kotart.in/cdn/shop/files/CanvasAS68719.jpg?v=1721717182',
    category: 'Art & Craft',
    href: '#art'
  },
  {
    id: 14,
    title: 'Tanjore Painting',
    description: 'Experience the richness of Tanjore paintings, famous for their surface richness and compact composition.',
    imageSrc: 'https://img1.wsimg.com/isteam/ip/bd95d888-15fd-4e22-9514-3b3e7856faa7/d1fc0d4d-12eb-4019-a7aa-f00566d84891.jpg',
    category: 'Art & Craft',
    href: '#art'
  },
  // Festivals
  {
    id: 15,
    title: 'Holi: Festival of Colors',
    description: 'Celebrate the vibrant festival of Holi, marking the arrival of spring and the triumph of good over evil.',
    imageSrc: 'https://dims.apnews.com/dims4/default/a563f6c/2147483647/strip/false/crop/4500x3001+0+0/resize/1486x991!/quality/90/?url=https%3A%2F%2Fassets.apnews.com%2F8f%2F90%2F7895d6e91470dba7c6ccb2d5a4da%2F5a9cb53123a84899a0f3b7a9dc9cc2a5',
    category: 'Festivals',
    href: '#festivals'
  },
  {
    id: 16,
    title: 'Onam: Harvest Festival of Kerala',
    description: 'Learn about Onam, a ten-day festival celebrated with grand feasts, boat races, and traditional dances.',
    imageSrc: 'https://theholidaysdestination.com/wp-content/uploads/2022/02/Onam-Festival.jpg',
    category: 'Festivals',
    href: '#festivals'
  },
  {
    id: 17,
    title: 'Durga Puja: Worship of the Goddess',
    description: 'Experience the grandeur of Durga Puja, a festival honoring the victory of Goddess Durga over Mahishasura.',
    imageSrc: 'https://media.istockphoto.com/id/1590058545/photo/hindu-priests-worshipping-goddess-durga-with-panchapradip-chamor-and-fan-ashtami-puja-aarati.jpg?s=612x612&w=0&k=20&c=d-8gW0ofLZdSnqkLBc1yFPv8mdeS3mZsT3koLt8hKY8=',
    category: 'Festivals',
    href: '#festivals'
  },
  {
    id: 18,
    title: 'Pongal: A Tamil Harvest Festival',
    description: 'Celebrate Pongal, a four-day harvest festival in Tamil Nadu, with traditional rituals and delicacies.',
    imageSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjH3ceEKp1r-BPtcRfl_wd0iD_S3WerC7WbA&s',
    category: 'Festivals',
    href: '#festivals'
  },
  // Cuisine
  // Music & Dance
  {
    id: 23,
    title: 'Kathak: The Dance of Storytellers',
    description: 'Learn about Kathak, a classical dance form known for its intricate footwork and expressive gestures.',
    imageSrc: 'https://www.hercircle.in/hcm/EngageImage/5F0D2024-9AB9-41B4-A03A-24D43C9A7E1A/D/CD3A279E-915B-4DBA-9FED-CAFA0DD4C469.jpg',
    category: 'Music & Dance',
    href: '#music'
  },
  {
    id: 24,
    title: 'The Rhythms of Bhangra',
    description: 'Feel the energetic beats of Bhangra, a lively folk dance from Punjab.',
    imageSrc: 'https://covers.stocktune.com/public/1/f/0/1f0d88a0-d5a8-4004-b758-90bad44d418d_large/vibrant-punjab-dance-beats-stocktune.jpg',
    category: 'Music & Dance',
    href: '#music'
  },
  // History
  {
    id: 27,
    title: 'The Red Fort of Delhi',
    description: 'Uncover the history of the Red Fort, a symbol of India\'s rich past and architectural brilliance.',
    imageSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfbqyPvAW9u0__Y4PcmaTO8LbNjkNL6RyRFg&s',
    category: 'History',
    href: '#history'
  },
  {
    id: 28,
    title: 'Hampi: The Ancient City',
    description: 'Visit the ruins of Hampi, a UNESCO World Heritage site that was once a prosperous kingdom.',
    imageSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPGB4fpVJodjvSVQZ6_ZUDLbp1HqF5l1sbPw&s',
    category: 'History',
    href: '#history'
  },
  {
    id: 29,
    title: 'Ellora Caves: A Marvel of Rock-Cut Architecture',
    description: 'Explore the Ellora Caves, a testament to India\'s rock-cut architectural prowess.',
    imageSrc: 'https://www.indiathatwas.com/wp-content/uploads/2012/12/DSC04843.jpg',
    category: 'History',
    href: '#history'
  },
  {
    id: 30,
    title: 'Jaisalmer Fort: The Golden Fortress',
    description: 'Discover the grandeur of Jaisalmer Fort, a living fort that stands tall in the Thar Desert.',
    imageSrc: 'https://www.trawell.in/admin/images/upload/825652759Jaisalmer_Fort_Main.jpg',
    category: 'History',
    href: '#history'
  }
];


const FeaturedSection = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [userBookmarks, setUserBookmarks] = useState<string[]>([]);

  const filteredItems = activeCategory === 'All' 
    ? featuredItems 
    : featuredItems.filter(item => item.category === activeCategory);

  // Forms for login/signup
  const loginForm = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });
  const registerForm = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  });

  const handleLogin = async (data: any) => {
    try {
      setIsLoading(true);
      const response = await authService.login(data.email, data.password);
      setIsAuthOpen(false);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: any) => {
    try {
      setIsLoading(true);
      const response = await authService.register(data.name, data.email, data.password);
      setIsAuthOpen(false);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Item interaction handlers (to be connected to backend later)
  const handleBookmark = async (item: typeof featuredItems[0]) => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to bookmark items');
      setIsAuthOpen(true);
      setActiveTab('login');
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
    console.log('Share item:', itemId);
    // Will implement sharing functionality
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

  // Filter history items for the map
  const historyItems = featuredItems.filter(item => item.category === 'History');

  return (
    <section id="explore" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <span className="inline-block px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-2">
            Featured Highlights
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Discover India&apos;s Cultural Treasures</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Immerse yourself in the vivid tapestry of India&apos;s diverse cultural heritage through these curated experiences.
          </p>
          
          {/* Auth Buttons - For future backend integration */}
          <div className="mt-5 flex justify-center gap-3">
            <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <LogIn size={16} />
                  Sign In
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Welcome Back</DialogTitle>
                  <DialogDescription>
                    Sign in to access your cultural journey preferences, bookmarks, and more.
                  </DialogDescription>
                </DialogHeader>
                
                <Tabs defaultValue="login" className="mt-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login" onClick={() => setActiveTab('login')}>Login</TabsTrigger>
                    <TabsTrigger value="register" onClick={() => setActiveTab('register')}>Register</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login" className="space-y-4 py-2">
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                        <FormField
                          control={loginForm.control}
                          name="email"
                          rules={{ required: 'Email is required' }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="you@example.com" type="email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={loginForm.control}
                          name="password"
                          rules={{ required: 'Password is required' }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="••••••••" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full" disabled={isLoading}>
                          {isLoading ? 'Signing in...' : 'Sign In'}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                  
                  <TabsContent value="register" className="space-y-4 py-2">
                    <Form {...registerForm}>
                      <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                        <FormField
                          control={registerForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input placeholder="Choose a username" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="you@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="••••••••" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full" disabled={isLoading}>
                          {isLoading ? 'Creating account...' : 'Create Account'}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="default" className="gap-2">
                  <UserPlus size={16} />
                  Join Now
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>Create Your Cultural Profile</SheetTitle>
                  <SheetDescription>
                    Tell us about your interests to get personalized cultural experiences
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-6">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Select Your Cultural Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        category !== 'All' && (
                          <Button 
                            key={category} 
                            variant="outline" 
                            size="sm" 
                            className="rounded-full"
                          >
                            {category}
                          </Button>
                        )
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Preferred Language</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="rounded-full">English</Button>
                      <Button variant="outline" size="sm" className="rounded-full">Hindi</Button>
                      <Button variant="outline" size="sm" className="rounded-full">Tamil</Button>
                      <Button variant="outline" size="sm" className="rounded-full">Bengali</Button>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button className="w-full">Save Preferences</Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
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
              {/* Action buttons that will connect to backend */}
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

        {/* Map Section - Added new section */}
        {(activeCategory === 'All' || activeCategory === 'History') && (
          <div className="mt-20">
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
        )}
      </div>
    </section>
  );
};

export default FeaturedSection;
