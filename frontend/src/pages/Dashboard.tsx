import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar, 
  Award, 
  BookOpen, 
  MapPin, 
  MessageSquare, 
  Heart, 
  Upload, 
  Settings, 
  User, 
  Clock, 
  BarChart2,
  Plus,
  Trash2,
  Share2,
  Edit,
  X,
  ExternalLink
} from 'lucide-react';
import { dashboardService, heritageService, UserProfile, Event, Activity, NewEvent } from '@/services/api';
import { toast } from 'sonner';
import { featuredItems, HeritageItem } from '@/components/FeaturedSection';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({});
  const [isAddInterestOpen, setIsAddInterestOpen] = useState(false);
  const [newInterest, setNewInterest] = useState('');
  
  // Event state variables
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isEditEventMode, setIsEditEventMode] = useState(false);
  const [currentEventId, setCurrentEventId] = useState<string | null>(null);
  const [eventFormData, setEventFormData] = useState<NewEvent>({
    name: '',
    date: '',
    location: '',
    description: '',
    category: ''
  });

  const [bookmarkedItems, setBookmarkedItems] = useState<HeritageItem[]>([]);

  useEffect(() => {
    fetchDashboardData();
    fetchBookmarkedItems();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      // Log the token for debugging
      const token = localStorage.getItem('token');
      console.log('User token:', token);
      
      const [profile, events, activities] = await Promise.all([
        dashboardService.getUserProfile(),
        dashboardService.getUpcomingEvents(),
        dashboardService.getRecentActivities()
      ]);
      console.log('Raw events from backend:', events);
      
      // Transform events to match frontend structure if needed
      const transformedEvents = Array.isArray(events) ? events.map(event => ({
        id: event._id || event.id, // Use MongoDB _id as id if available
        _id: event._id || event.id,
        name: event.name,
        date: event.date,
        location: event.location,
        description: event.description,
        category: event.category,
        createdBy: event.createdBy
      })) : [];
      
      console.log('Transformed events:', transformedEvents);
      
      setUserProfile(profile);
      setUpcomingEvents(transformedEvents); 
      setRecentActivities(activities);
    } catch (error: any) {
      console.error('Dashboard data fetch error:', error);
      toast.error(error.message || 'Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBookmarkedItems = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const items = await heritageService.getBookmarkedItems();
        setBookmarkedItems(items);
      }
    } catch (error) {
      console.error('Error fetching bookmarked items:', error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      if (!userProfile) return;
      const updatedProfile = await dashboardService.updateUserProfile(editedProfile);
      setUserProfile(updatedProfile);
      setIsEditingProfile(false);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      
      toast.error(error.message || 'Failed to update profile');
    }
  };

  const handleAddInterest = async () => {
    try {
      if (!userProfile || !newInterest) return;
      const updatedInterests = [...userProfile.interests, newInterest];
      const updatedProfile = await dashboardService.updateUserProfile({
        interests: updatedInterests
      });
      setUserProfile(updatedProfile);
      setNewInterest('');
      setIsAddInterestOpen(false);
      toast.success('Interest added successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add interest');
    }
  };

  const handleRemoveInterest = async (interest: string) => {
    try {
      if (!userProfile) return;
      const updatedInterests = userProfile.interests.filter(i => i !== interest);
      const updatedProfile = await dashboardService.updateUserProfile({
        interests: updatedInterests
      });
      setUserProfile(updatedProfile);
      toast.success('Interest removed successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove interest');
    }
  };

  const handleRemoveBookmark = async (itemId: string) => {
    try {
      await dashboardService.removeBookmark(itemId);
      // Update both the user profile and bookmarked items
      await fetchDashboardData();
      await fetchBookmarkedItems();
      toast.success('Bookmark removed successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove bookmark');
    }
  };

  const handleCreateEvent = async () => {
    try {
      console.log('Creating event with data:', eventFormData);
      const newEvent = await dashboardService.createEvent(eventFormData);
      console.log('Created event:', newEvent);
      setIsEventDialogOpen(false);
      fetchDashboardData();
      resetEventForm();
      toast.success('Event created successfully');
    } catch (error: any) {
      console.error('Event creation error:', error);
      toast.error(error.message || 'Failed to create event');
    }
  };

  const handleUpdateEvent = async () => {
    try {
      if (!currentEventId) return;
      console.log('Updating event with ID:', currentEventId);
      await dashboardService.updateEvent(currentEventId, eventFormData);
      setIsEventDialogOpen(false);
      fetchDashboardData();
      resetEventForm();
      toast.success('Event updated successfully');
    } catch (error: any) {
      console.error('Event update error:', error);
      toast.error(error.message || 'Failed to update event');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const actualId = typeof eventId === 'object' ? (eventId as any)._id : eventId;
      console.log('Deleting event with ID:', actualId);
      await dashboardService.deleteEvent(actualId);
      fetchDashboardData();
      toast.success('Event deleted successfully');
    } catch (error: any) {
      console.error('Event deletion error:', error);
      toast.error(error.message || 'Failed to delete event');
    }
  };

  const handleEventFormChange = (field: keyof NewEvent, value: string) => {
    setEventFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const openCreateEventDialog = () => {
    setIsEditEventMode(false);
    setCurrentEventId(null);
    resetEventForm();
    setIsEventDialogOpen(true);
  };

  const openEditEventDialog = (event: Event) => {
    console.log('Opening edit dialog for event:', event);
    setIsEditEventMode(true);
    setCurrentEventId(event._id || event.id); // Use _id if available (MongoDB ID from backend)
    setEventFormData({
      name: event.name,
      date: event.date,
      location: event.location,
      description: event.description,
      category: event.category
    });
    setIsEventDialogOpen(true);
  };

  const resetEventForm = () => {
    setEventFormData({
      name: '',
      date: '',
      location: '',
      description: '',
      category: ''
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!userProfile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-64 space-y-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex flex-col items-center space-y-3 py-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={userProfile.avatar} />
                      <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                        {userProfile.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-lg">{userProfile.username}</h3>
                      <p className="text-sm text-muted-foreground">{userProfile.email}</p>
                    </div>
                    <div className="flex gap-2 flex-wrap justify-center">
                      {userProfile.interests.map((interest) => (
                        <span key={interest} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="space-y-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab('profile')}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab('bookmarks')}
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Bookmarks
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab('contributions')}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Contributions
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab('events')}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Events
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab('achievements')}
                >
                  <Award className="mr-2 h-4 w-4" />
                  Achievements
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab('activity')}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Activity
                </Button>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-1">
              <Tabs value={activeTab} className="space-y-6">
                <TabsContent value="profile" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Cultural Profile</CardTitle>
                      <CardDescription>View and update your profile information</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium mb-1">Username</p>
                            {isEditingProfile ? (
                              <Input
                                value={editedProfile.username || userProfile.username}
                                onChange={(e) => setEditedProfile({ ...editedProfile, username: e.target.value })}
                              />
                            ) : (
                              <p>{userProfile.username}</p>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-1">Email</p>
                            {isEditingProfile ? (
                              <Input
                                value={editedProfile.email || userProfile.email}
                                onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                              />
                            ) : (
                              <p>{userProfile.email}</p>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium">Cultural Interests</p>
                            <Dialog open={isAddInterestOpen} onOpenChange={setIsAddInterestOpen}>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="rounded-full">
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Interest
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Add New Interest</DialogTitle>
                                  <DialogDescription>
                                    Add a new cultural interest to your profile
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="interest">Interest</Label>
                                    <Input
                                      id="interest"
                                      value={newInterest}
                                      onChange={(e) => setNewInterest(e.target.value)}
                                      placeholder="e.g., Classical Music"
                                    />
                                  </div>
                                  <Button onClick={handleAddInterest} className="w-full">
                                    Add Interest
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {userProfile.interests.map((interest) => (
                              <span key={interest} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-2">
                                {interest}
                                <button
                                  onClick={() => handleRemoveInterest(interest)}
                                  className="hover:text-destructive"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="pt-4">
                          {isEditingProfile ? (
                            <div className="flex gap-2">
                              <Button onClick={handleUpdateProfile}>Save Changes</Button>
                              <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <Button onClick={() => setIsEditingProfile(true)}>Edit Profile</Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="bookmarks">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Your Bookmarked Content</CardTitle>
                        <CardDescription>Heritage items you've saved for later</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {userProfile.bookmarks.length === 0 ? (
                        <p className="text-center py-10 text-muted-foreground">
                          No bookmarked content yet. Explore the homepage to find cultural content to bookmark.
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {bookmarkedItems.length > 0 ? (
                            bookmarkedItems.map((item) => (
                              <div
                                key={item.title}
                                className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                              >
                                <div className="flex-shrink-0 h-16 w-16 rounded overflow-hidden">
                                  <img 
                                    src={item.imageSrc} 
                                    alt={item.title} 
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium">{item.title}</h4>
                                  <p className="text-sm text-muted-foreground line-clamp-1">
                                    {item.description}
                                  </p>
                                  <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                                    {item.category}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-1"
                                    onClick={() => window.open(item.href, '_blank')}
                                  >
                                    <ExternalLink size={14} />
                                    View
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveBookmark(item.title)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))
                          ) : (
                            // Fallback to just showing the bookmark IDs if we couldn't load the details
                            userProfile.bookmarks.map((bookmark) => (
                              <div
                                key={bookmark}
                                className="flex items-center justify-between p-4 border rounded-lg"
                              >
                                <div>
                                  <h4 className="font-medium">{bookmark}</h4>
                                  <p className="text-sm text-muted-foreground">Added to bookmarks</p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveBookmark(bookmark)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="events">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Upcoming Cultural Events</CardTitle>
                        <CardDescription>Events you've registered or created</CardDescription>
                      </div>
                      <Button onClick={openCreateEventDialog}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Event
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {upcomingEvents.length === 0 ? (
                        <p className="text-center py-10 text-muted-foreground">
                          No upcoming events
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {upcomingEvents.map((event) => (
                            <div
                              key={event.id || event._id}
                              className="flex items-start justify-between gap-4 p-4 border rounded-lg"
                            >
                              <div className="flex gap-4">
                                <Calendar className="h-5 w-5 text-primary mt-1" />
                                <div>
                                  <h4 className="font-medium">{event.name}</h4>
                                  <p className="text-sm text-muted-foreground">{event.description}</p>
                                  <div className="flex items-center gap-4 mt-2 text-sm">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-4 w-4" />
                                      {event.date}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <MapPin className="h-4 w-4" />
                                      {event.location}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="icon" onClick={() => openEditEventDialog(event)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" onClick={() => handleDeleteEvent(event._id || event.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="activity">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Your recent interactions and contributions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {recentActivities.length === 0 ? (
                        <p className="text-center py-10 text-muted-foreground">
                          No recent activity
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {recentActivities.map((activity) => (
                            <div
                              key={activity.id}
                              className="flex items-start gap-4 p-4 border rounded-lg"
                            >
                              {activity.type === 'bookmark' && <Heart className="h-5 w-5 text-primary mt-1" />}
                              {activity.type === 'comment' && <MessageSquare className="h-5 w-5 text-primary mt-1" />}
                              {activity.type === 'share' && <Share2 className="h-5 w-5 text-primary mt-1" />}
                              <div>
                                <p className="text-sm">
                                  {activity.type === 'bookmark' && 'Bookmarked'}
                                  {activity.type === 'comment' && 'Commented on'}
                                  {activity.type === 'share' && 'Shared'}
                                  {' '}
                                  <span className="font-medium">{activity.item}</span>
                                </p>
                                <p className="text-sm text-muted-foreground">{activity.date}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="achievements">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Achievements</CardTitle>
                      <CardDescription>Badges and milestones you've earned</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {userProfile.badges.length === 0 ? (
                        <p className="text-center py-10 text-muted-foreground">
                          No achievements yet
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {userProfile.badges.map((badge) => (
                            <div
                              key={badge}
                              className="flex items-center gap-4 p-4 border rounded-lg"
                            >
                              <Award className="h-8 w-8 text-primary" />
                              <div>
                                <h4 className="font-medium">{badge}</h4>
                                <p className="text-sm text-muted-foreground">
                                  Earned through cultural exploration
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="contributions">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Contributions</CardTitle>
                      <CardDescription>Content you've shared with the community</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {userProfile.contributions.length === 0 ? (
                        <p className="text-center py-10 text-muted-foreground">
                          No contributions yet
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {userProfile.contributions.map((contribution) => (
                            <div
                              key={contribution}
                              className="flex items-start gap-4 p-4 border rounded-lg"
                            >
                              <Upload className="h-5 w-5 text-primary mt-1" />
                              <div>
                                <h4 className="font-medium">{contribution}</h4>
                                <p className="text-sm text-muted-foreground">
                                  Shared with the community
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />

      {/* Event Dialog for Create/Edit */}
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEditEventMode ? 'Edit Event' : 'Create New Event'}</DialogTitle>
            <DialogDescription>
              {isEditEventMode 
                ? 'Make changes to the event details' 
                : 'Enter details for your new cultural event'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="event-name">Event Name</Label>
              <Input 
                id="event-name" 
                value={eventFormData.name} 
                onChange={(e) => handleEventFormChange('name', e.target.value)} 
                placeholder="Enter event name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="event-date">Date</Label>
              <Input 
                id="event-date"
                type="date"
                value={eventFormData.date}
                onChange={(e) => handleEventFormChange('date', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="event-location">Location</Label>
              <Input 
                id="event-location" 
                value={eventFormData.location} 
                onChange={(e) => handleEventFormChange('location', e.target.value)} 
                placeholder="Enter location"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="event-category">Category</Label>
              <Input 
                id="event-category" 
                value={eventFormData.category} 
                onChange={(e) => handleEventFormChange('category', e.target.value)} 
                placeholder="e.g. Festival, Performance, Workshop"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="event-description">Description</Label>
              <Textarea 
                id="event-description" 
                value={eventFormData.description} 
                onChange={(e) => handleEventFormChange('description', e.target.value)} 
                placeholder="Describe the event"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEventDialogOpen(false)}>Cancel</Button>
            <Button onClick={isEditEventMode ? handleUpdateEvent : handleCreateEvent}>
              {isEditEventMode ? 'Save Changes' : 'Create Event'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
