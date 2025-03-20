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
  Share2
} from 'lucide-react';
import { dashboardService, UserProfile, Event, Activity } from '@/services/api';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [profile, events, activities] = await Promise.all([
        dashboardService.getUserProfile(),
        dashboardService.getUpcomingEvents(),
        dashboardService.getRecentActivities()
      ]);
      setUserProfile(profile);
      setUpcomingEvents(events);
      setRecentActivities(activities);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
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
      await fetchDashboardData();
      toast.success('Bookmark removed successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove bookmark');
    }
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
                    <CardHeader>
                      <CardTitle>Your Bookmarked Content</CardTitle>
                      <CardDescription>Content you've saved for later</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {userProfile.bookmarks.length === 0 ? (
                        <p className="text-center py-10 text-muted-foreground">
                          No bookmarked content yet
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {userProfile.bookmarks.map((bookmark) => (
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
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="events">
                  <Card>
                    <CardHeader>
                      <CardTitle>Upcoming Cultural Events</CardTitle>
                      <CardDescription>Events you've registered for</CardDescription>
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
                              key={event.id}
                              className="flex items-start gap-4 p-4 border rounded-lg"
                            >
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
    </div>
  );
};

export default Dashboard;
