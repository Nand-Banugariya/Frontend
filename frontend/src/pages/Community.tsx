import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Filter, Calendar, Bookmark, Search, ThumbsUp, MessageCircle, Share2, Image, Video, Clock, MapPin, LogIn, UserPlus, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { authService, communityService, Post } from '@/services/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Types for community content
type ContentType = 'story' | 'blog' | 'photo' | 'event';

// Format date for display
const formatDate = (dateString: string) => {
  try {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString; // Return original string if there's an error
  }
};

// Format time since post
const getTimeSince = (dateString: string) => {
  try {
    const now = new Date();
    const postDate = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(postDate.getTime())) {
      return 'Unknown time';
    }
    
    const diffMs = now.getTime() - postDate.getTime();
    
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 60) {
      return `${diffMinutes} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else if (diffDays < 30) {
      return `${diffDays} days ago`;
    } else {
      return formatDate(dateString);
    }
  } catch (error) {
    console.error('Error calculating time since:', error);
    return 'Some time ago'; // Fallback
  }
};

// Post card component
const PostCard = ({ post, onDelete }: { post: Post; onDelete: (postId: string) => void }) => {
  const [liked, setLiked] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const hasImages = post.images && post.images.length > 0;
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isOwner = currentUser.id === post.author.id;
  
  const handleEdit = () => {
    if (!post._id && !post.id) {
      toast.error('Invalid post ID');
      return;
    }
    const postId = post._id || post.id;
    navigate(`/dashboard/edit-post/${postId}`);
  };

  const handleDelete = async () => {
    if (!post._id && !post.id) {
      toast.error('Invalid post ID');
      return;
    }

    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        setIsDeleting(true);
        const postId = post._id || post.id;
        await onDelete(postId);
      } catch (error: any) {
        console.error('Delete error:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
      {/* Post header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={post.author.avatar} />
            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium text-sm">{post.author.name}</h4>
            <p className="text-xs text-gray-500">{getTimeSince(post.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            post.contentType === 'story' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
            post.contentType === 'blog' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
            post.contentType === 'photo' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
            'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
          }`}>
            {post.contentType.charAt(0).toUpperCase() + post.contentType.slice(1)}
          </span>
          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDelete} 
                  className="text-red-600"
                  disabled={isDeleting}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      
      {/* Post content */}
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2">{post.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-3">
          {post.content}
        </p>
        
        {post.location && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
            <MapPin size={12} />
            <span>{post.location}</span>
          </div>
        )}
        
        {post.eventDate && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
            <Calendar size={12} />
            <span>{formatDate(post.eventDate)}</span>
          </div>
        )}
      </div>
      
      {/* Post images */}
      {hasImages && (
        <div className={`grid ${post.images!.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-0.5`}>
          {post.images!.map((img, index) => (
            <div 
              key={index} 
              className={`aspect-video overflow-hidden bg-gray-200 ${post.images?.length === 1 ? 'col-span-2' : ''}`}
            >
              <img 
                src={img} 
                alt={`${post.title} - image ${index + 1}`} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Replace with a fallback image on error
                  e.currentTarget.src = "https://placehold.co/600x400/gray/white?text=Image+Not+Available";
                }}
              />
            </div>
          ))}
        </div>
      )}
      
      {/* Post actions */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            className={`flex items-center gap-1 text-xs ${liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
            onClick={() => setLiked(!liked)}
          >
            <ThumbsUp size={14} /> {post.likes + (liked ? 1 : 0)}
          </button>
          <button className="flex items-center gap-1 text-xs text-gray-500">
            <MessageCircle size={14} /> {post.comments}
          </button>
        </div>
        <button className="flex items-center gap-1 text-xs text-gray-500">
          <Share2 size={14} /> Share
        </button>
      </div>
    </div>
  );
};

// Event card component
const EventCard = ({ event }: { event: Post }) => {
  // Check if event has a valid image
  const hasValidImage = event.images && event.images.length > 0 && event.images[0];
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
      <div className="relative">
        <div className="aspect-[3/2] overflow-hidden bg-gray-200">
          {hasValidImage ? (
            <img 
              src={event.images[0]} 
              alt={event.title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                // Replace with a fallback image on error
                e.currentTarget.src = "https://placehold.co/600x400/gray/white?text=Event+Image";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No image available
            </div>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            Event
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2">{event.title}</h3>
        
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Calendar size={14} />
            <span>{formatDate(event.eventDate || event.createdAt)}</span>
          </div>
          
          {event.location && (
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <MapPin size={14} />
              <span>{event.location}</span>
            </div>
          )}
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-3">
          {event.content}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={event.author.avatar} />
              <AvatarFallback>{event.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-xs">{event.author.name}</span>
          </div>
          
          <Button size="sm" variant="outline" className="text-xs">
            Details
          </Button>
        </div>
      </div>
    </div>
  );
};

// Featured post component
const FeaturedPost = ({ post }: { post: Post }) => {
  // Check if post has images before rendering
  const hasValidImage = post.images && post.images.length > 0 && post.images[0];
  
  return (
    <div className="relative overflow-hidden rounded-xl">
      <div className="aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-gray-200">
        {hasValidImage ? (
          <img 
            src={post.images[0]} 
            alt={post.title} 
            className="w-full h-full object-cover brightness-75"
            onError={(e) => {
              // Replace with a fallback image on error
              e.currentTarget.src = "https://placehold.co/600x400/gray/white?text=Image+Not+Available";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image available
          </div>
        )}
      </div>
      
      <div className="absolute inset-0 flex flex-col justify-end p-6 text-white bg-gradient-to-t from-black/70 via-black/30 to-transparent">
        <div className="mb-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm`}>
            Featured {post.contentType.charAt(0).toUpperCase() + post.contentType.slice(1)}
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">{post.title}</h2>
        <p className="text-white/80 mb-4 line-clamp-2 max-w-2xl">
          {post.content}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={post.author.avatar} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{post.author.name}</p>
              <p className="text-xs text-white/70">{getTimeSince(post.createdAt)}</p>
            </div>
          </div>
          
          <Button size="sm" className="bg-white text-black hover:bg-white/90">
            Read More
          </Button>
        </div>
      </div>
    </div>
  );
};

// Main component
const Community: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [posts, setPosts] = useState<Post[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Post[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authActiveTab, setAuthActiveTab] = useState('login');
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const navigate = useNavigate();
  
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
      setIsAuthLoading(true);
      await authService.login(data.email, data.password);
      setIsAuthOpen(false);
      toast.success('Login successful!');
      setIsLoggedIn(true);
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleRegister = async (data: any) => {
    try {
      setIsAuthLoading(true);
      await authService.register(data.name, data.email, data.password);
      setIsAuthOpen(false);
      toast.success('Registration successful!');
      setIsLoggedIn(true);
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsAuthLoading(false);
    }
  };
  
  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);
  
  // Function to fetch all data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all posts
      const allPosts = await communityService.getPosts(activeTab === 'all' ? undefined : activeTab);
      setPosts(allPosts.posts);
      
      // Fetch featured posts
      const featured = await communityService.getFeaturedPosts();
      setFeaturedPosts(featured);
      
      // Fetch upcoming events
      const events = await communityService.getUpcomingEvents();
      setUpcomingEvents(events);
    } catch (error) {
      console.error('Error fetching community data:', error);
      toast.error('Failed to load community content');
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch posts and events from API
  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // Function to handle post deletion
  const handleDeletePost = async (postId: string) => {
    try {
      await communityService.deletePost(postId);
      // Refresh all data after successful deletion
      await fetchData();
      toast.success('Post deleted successfully');
    } catch (error: any) {
      console.error('Error deleting post:', error);
      toast.error(error.response?.data?.message || 'Failed to delete post. Please try again.');
      throw error; // Re-throw the error to be caught by the PostCard component
    }
  };

  // Filter posts based on active tab
  const filteredPosts = posts.filter(post => {
    if (activeTab === 'all') return true;
    return post.contentType === activeTab;
  });
  
  // Function to handle tab changes and fetch filtered posts
  const handleTabChange = async (value: string) => {
    setActiveTab(value);
    
    try {
      setIsLoading(true);
      
      // If tab is "all", fetch all posts, otherwise get filtered posts
      if (value === 'all') {
        const allPosts = await communityService.getPosts();
        setPosts(allPosts.posts);
      } else {
        const filteredPosts = await communityService.getPosts(value);
        setPosts(filteredPosts.posts);
      }
    } catch (error) {
      console.error('Error fetching filtered posts:', error);
      toast.error('Failed to load filtered content');
    } finally {
      setIsLoading(false);
    }
  };

  try {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Navbar />
        
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-12 px-4 mt-16">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4">Cultural Community</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              Share your cultural experiences, photos, and stories. Connect with fellow enthusiasts and explore India's rich heritage together.
            </p>
            
            {isLoggedIn ? (
              <Link to="/dashboard">
                <Button size="lg" className="gap-2">
                  Share Your Story <Image size={18} />
                </Button>
              </Link>
            ) : (
              <div className="space-y-2">
                <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="gap-2">
                      <LogIn size={18} /> Sign In to Contribute
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Welcome to Bhārat Dharohar</DialogTitle>
                      <DialogDescription>
                        Sign in to access your cultural journey preferences, bookmarks, and more.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <Tabs defaultValue="login" className="mt-4">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login" onClick={() => setAuthActiveTab('login')}>Login</TabsTrigger>
                        <TabsTrigger value="register" onClick={() => setAuthActiveTab('register')}>Register</TabsTrigger>
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
                            <Button type="submit" className="w-full" disabled={isAuthLoading}>
                              {isAuthLoading ? 'Signing in...' : 'Sign In'}
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
                            <Button type="submit" className="w-full" disabled={isAuthLoading}>
                              {isAuthLoading ? 'Creating account...' : 'Create Account'}
                            </Button>
                          </form>
                        </Form>
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>
                <p className="text-sm text-gray-500">Join our community to share your cultural stories and experiences</p>
              </div>
            )}
          </div>
        </section>
        
        {/* Featured Post */}
        {featuredPosts.length > 0 && (
          <section className="py-8 px-4">
            <div className="max-w-7xl mx-auto">
              <FeaturedPost post={featuredPosts[0]} />
            </div>
          </section>
        )}
        
        {/* Main Content */}
        <section className="py-10 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Posts Feed */}
            <div className="lg:col-span-2 space-y-8">
              {/* Tabs for filtering */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold">Explore Content</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-8 gap-1">
                        <Filter size={14} /> Filter
                      </Button>
                      <div className="relative">
                        <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
                        <Input placeholder="Search..." className="pl-8 h-8 w-[150px]" />
                      </div>
                    </div>
                  </div>
                  
                  <TabsList className="grid grid-cols-5 mb-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="story">Stories</TabsTrigger>
                    <TabsTrigger value="blog">Blogs</TabsTrigger>
                    <TabsTrigger value="photo">Photos</TabsTrigger>
                    <TabsTrigger value="event">Events</TabsTrigger>
                  </TabsList>
                  
                  {isLoading ? (
                    <div className="flex justify-center py-10">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <>
                      <TabsContent value="all" className="space-y-0 mt-0">
                        {filteredPosts.length === 0 ? (
                          <div className="text-center py-10">
                            <p className="text-gray-500">No posts found</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {filteredPosts.map(post => (
                              <PostCard key={post.id} post={post} onDelete={handleDeletePost} />
                            ))}
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="story" className="space-y-0 mt-0">
                        {filteredPosts.length === 0 ? (
                          <div className="text-center py-10">
                            <p className="text-gray-500">No stories found</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {filteredPosts.map(post => (
                              <PostCard key={post.id} post={post} onDelete={handleDeletePost} />
                            ))}
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="blog" className="space-y-0 mt-0">
                        {filteredPosts.length === 0 ? (
                          <div className="text-center py-10">
                            <p className="text-gray-500">No blogs found</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {filteredPosts.map(post => (
                              <PostCard key={post.id} post={post} onDelete={handleDeletePost} />
                            ))}
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="photo" className="space-y-0 mt-0">
                        {filteredPosts.length === 0 ? (
                          <div className="text-center py-10">
                            <p className="text-gray-500">No photos found</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {filteredPosts.map(post => (
                              <PostCard key={post.id} post={post} onDelete={handleDeletePost} />
                            ))}
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="event" className="space-y-0 mt-0">
                        {filteredPosts.length === 0 ? (
                          <div className="text-center py-10">
                            <p className="text-gray-500">No events found</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {filteredPosts.map(post => (
                              <PostCard key={post.id} post={post} onDelete={handleDeletePost} />
                            ))}
                          </div>
                        )}
                      </TabsContent>
                    </>
                  )}
                </Tabs>
              </div>
            </div>
            
            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Events */}
              {upcomingEvents.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="font-bold flex items-center gap-2">
                      <Calendar size={16} /> Upcoming Events
                    </h3>
                  </div>
                  {isLoading ? (
                    <div className="flex justify-center py-10">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <div className="p-4 space-y-4">
                      {upcomingEvents.slice(0, 3).map(event => (
                        <EventCard key={event.id} event={event} />
                      ))}
                      {upcomingEvents.length > 3 && (
                        <Button variant="ghost" className="w-full text-sm" size="sm">
                          View All Events
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {/* Categories */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                  <h3 className="font-bold">Popular Categories</h3>
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="rounded-full">Historical Sites</Button>
                    <Button variant="outline" size="sm" className="rounded-full">Traditional Arts</Button>
                    <Button variant="outline" size="sm" className="rounded-full">Festivals</Button>
                    <Button variant="outline" size="sm" className="rounded-full">Cuisine</Button>
                    <Button variant="outline" size="sm" className="rounded-full">Music & Dance</Button>
                    <Button variant="outline" size="sm" className="rounded-full">Architecture</Button>
                    <Button variant="outline" size="sm" className="rounded-full">Textiles</Button>
                    <Button variant="outline" size="sm" className="rounded-full">Rituals</Button>
                  </div>
                </div>
              </div>
              
              {/* Call to Action */}
              <div className="bg-gradient-to-r from-primary/20 to-primary/5 rounded-lg p-6 text-center">
                <h3 className="font-bold text-lg mb-2">Share Your Heritage Story</h3>
                <p className="text-sm mb-4">Your cultural experiences and knowledge enrich our community.</p>
                {isLoggedIn ? (
                  <Link to="/dashboard">
                    <Button size="sm">Create Post</Button>
                  </Link>
                ) : (
                  <Button size="sm" onClick={() => setIsAuthOpen(true)}>
                    Sign In to Post
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>
        
        <Footer />
      </div>
    );
  } catch (error) {
    console.error('Error rendering Community component:', error);
    
    // If we hit a render error, show a fallback UI
    if (!hasError) {
      setHasError(true);
    }
    
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <Navbar />
        <div className="max-w-md mx-auto text-center mt-20 p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong</h1>
          <p className="mb-6">We're having trouble loading the community page. Please try again later.</p>
          <Link to="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }
};

export default Community; 