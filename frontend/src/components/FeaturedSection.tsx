import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CulturalCard from './CulturalCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { UserPlus, LogIn, BookmarkPlus, Share2 } from 'lucide-react';
import { authService } from '@/services/api';
import { toast } from 'sonner';

const categories = [
  'All',
  'Art & Craft',
  'Festivals',
  'Cuisine',
  'Music & Dance',
  'History'
];

const featuredItems = [
  {
    id: 1,
    title: 'The Art of Madhubani',
    description: 'Explore the intricate patterns and vibrant colors of Madhubani painting, a traditional art form from Bihar.',
    imageSrc: 'https://images.unsplash.com/photo-1590214074323-fd5649874bee?q=80&w=1964&auto=format&fit=crop',
    category: 'Art & Craft',
    href: '#art'
  },
  {
    id: 2,
    title: 'Festival of Lights: Diwali',
    description: 'Discover the meaning behind the traditions and celebrations of India\'s most luminous festival.',
    imageSrc: 'https://images.unsplash.com/photo-1605369572399-05d8d64a0f6e?q=80&w=2070&auto=format&fit=crop',
    category: 'Festivals',
    href: '#festivals'
  },
  {
    id: 3,
    title: 'The Flavors of South India',
    description: 'A journey through the distinctive spices, ingredients, and cooking methods of South Indian cuisine.',
    imageSrc: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=2070&auto=format&fit=crop',
    category: 'Cuisine',
    href: '#cuisine'
  },
  {
    id: 4,
    title: 'Classical Bharatanatyam',
    description: 'Learn about one of India\'s oldest classical dance forms, known for its grace, expression, and spirituality.',
    imageSrc: 'https://images.unsplash.com/photo-1503612061115-ef40ed808997?q=80&w=1964&auto=format&fit=crop',
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
    imageSrc: 'https://images.unsplash.com/photo-1623053789916-0ba4c36987a3?q=80&w=1974&auto=format&fit=crop',
    category: 'Art & Craft',
    href: '#art'
  },
];

const FeaturedSection = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);

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
  const handleBookmark = (itemId: number) => {
    console.log('Bookmark item:', itemId);
    // Will save bookmark to user profile in backend
  };

  const handleShare = (itemId: number) => {
    console.log('Share item:', itemId);
    // Will implement sharing functionality
  };

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
              />
              {/* Action buttons that will connect to backend */}
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="rounded-full p-2 h-8 w-8" 
                  title="Bookmark"
                  onClick={() => handleBookmark(item.id)}
                >
                  <BookmarkPlus size={16} />
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
  );
};

export default FeaturedSection;
