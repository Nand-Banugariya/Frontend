import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { featuredItems, HeritageItem } from '@/components/FeaturedSection';
import { ChevronLeft, MapPin, Calendar, BookmarkPlus, BookmarkCheck, Share2, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { dashboardService } from '@/services/api';
import { toast } from 'sonner';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icons
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Mapping of historical sites to coordinates [lat, lng]
const HISTORICAL_SITES_COORDINATES: Record<string, [number, number]> = {
  "The Majestic Taj Mahal": [27.1751, 78.0422],
  "The Sacred City of Varanasi": [25.3176, 83.0065],
  "The Magnificent Meenakshi Temple": [9.9252, 78.1198],
  "The Temples of Khajuraho": [24.8518, 79.9199],
  "The Jagannath Temple of Puri": [19.8050, 85.8186],
  "The Red Fort of Delhi": [28.6562, 77.2410],
  "Hampi: The Ancient City": [15.3350, 76.4755],
  "Ellora Caves: A Marvel of Rock-Cut Architecture": [20.0258, 75.1770],
  "Jaisalmer Fort: The Golden Fortress": [26.9157, 70.9262]
};

// This component will fetch the user's location and handle directions
const DirectionsMap = ({ destination, locationName }: { destination: [number, number], locationName: string }) => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [direction, setDirection] = useState<string | null>(null);
  const [route, setRoute] = useState<[number, number][]>([]);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          
          // Calculate straight-line distance (in km)
          const distanceKm = calculateDistance(latitude, longitude, destination[0], destination[1]);
          setDistance(distanceKm);
          
          // Calculate direction
          const dir = getDirection(latitude, longitude, destination[0], destination[1]);
          setDirection(dir);
          
          // Create a simple route (for demo purposes)
          // In a real app, you'd use a routing API (like Mapbox, Google, or OpenStreetMap)
          generateSimpleRoute([latitude, longitude], destination);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError("Could not access your location. Please enable location services.");
          
          // Set a default location (India center) for demo purposes
          setUserLocation([20.5937, 78.9629]);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser");
      // Set a default location (India center) for demo purposes
      setUserLocation([20.5937, 78.9629]);
    }
  }, [destination]);
  
  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return Math.round(distance * 10) / 10;
  };
  
  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };
  
  // Get cardinal direction
  const getDirection = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const dLon = lon2 - lon1;
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    const brng = Math.atan2(y, x) * 180 / Math.PI;
    
    // Convert bearing to cardinal direction
    const directions = ['North', 'Northeast', 'East', 'Southeast', 'South', 'Southwest', 'West', 'Northwest'];
    const index = Math.round(((brng + 360) % 360) / 45) % 8;
    return directions[index];
  };
  
  // Generate a simple route (for demo purposes)
  const generateSimpleRoute = (start: [number, number], end: [number, number]) => {
    // For a real app, you would use a routing API here
    // This is a simplified example creating a route with a few intermediate points
    
    // Calculate intermediate points
    const numPoints = 5; // Number of intermediate points
    const routePoints: [number, number][] = [start];
    
    for (let i = 1; i < numPoints; i++) {
      const ratio = i / numPoints;
      const lat = start[0] + ratio * (end[0] - start[0]);
      const lng = start[1] + ratio * (end[1] - start[1]);
      
      // Add some randomness to make the route look more natural
      const jitter = 0.02; // Amount of randomness
      const randomLat = lat + (Math.random() - 0.5) * jitter;
      const randomLng = lng + (Math.random() - 0.5) * jitter;
      
      routePoints.push([randomLat, randomLng]);
    }
    
    routePoints.push(end);
    setRoute(routePoints);
  };
  
  // Component to fit the map to the route bounds
  const FitBounds = ({ positions }: { positions: [number, number][] }) => {
    const map = useMap();
    
    useEffect(() => {
      if (positions.length > 0) {
        const bounds = L.latLngBounds(positions.map(pos => L.latLng(pos[0], pos[1])));
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }, [map, positions]);
    
    return null;
  };
  
  if (!userLocation) {
    return (
      <div className="h-[350px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="animate-pulse text-center text-gray-500">Loading map...</div>
      </div>
    );
  }
  
  const allPositions = userLocation ? [userLocation, ...route, destination] : [destination];
  
  return (
    <div className="space-y-3">
      <div className="h-[350px] rounded-lg overflow-hidden">
        <MapContainer
          center={destination}
          zoom={10}
          style={{ height: "100%", width: "100%" }}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {userLocation && (
            <Marker position={userLocation}>
              <Popup>
                Your current location
              </Popup>
            </Marker>
          )}
          
          <Marker position={destination}>
            <Popup>
              {locationName}
            </Popup>
          </Marker>
          
          {route.length > 0 && (
            <Polyline 
              positions={[userLocation, ...route, destination]} 
              color="#3b82f6"
              weight={4}
              opacity={0.7}
              dashArray="8, 12"
            />
          )}
          
          <FitBounds positions={allPositions} />
        </MapContainer>
      </div>
      
      {locationError ? (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg text-sm text-yellow-700 dark:text-yellow-400">
          {locationError}
        </div>
      ) : (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-primary" /> 
              <span className="font-medium">{locationName}</span>
            </div>
            {distance && (
              <div className="flex items-center gap-2">
                <Navigation size={16} className="text-primary" />
                <span>
                  {distance} km {direction && `(${direction})`}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const RelatedItem = ({ item }: { item: HeritageItem }) => (
  <Link to={`/heritage/${item.id}`} className="block group">
    <div className="overflow-hidden rounded-lg">
      <img 
        src={item.imageSrc} 
        alt={item.title} 
        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>
    <h4 className="mt-2 font-medium text-sm group-hover:text-primary transition-colors">{item.title}</h4>
    <p className="text-xs text-gray-500">{item.category}</p>
  </Link>
);

const HeritageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<HeritageItem | null>(null);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [relatedItems, setRelatedItems] = useState<HeritageItem[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Find the item based on ID parameter
    const itemId = parseInt(id || '0');
    const foundItem = featuredItems.find(item => item.id === itemId);
    
    if (foundItem) {
      setItem(foundItem);
      
      // Get coordinates for historical site
      const coords = HISTORICAL_SITES_COORDINATES[foundItem.title];
      if (coords) {
        setCoordinates(coords);
      }
      
      // Get related items from the same category
      const related = featuredItems
        .filter(i => i.category === foundItem.category && i.id !== foundItem.id)
        .slice(0, 3);
      
      setRelatedItems(related);
      
      // Check if item is bookmarked
      const checkBookmark = async () => {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const bookmarks = await dashboardService.getBookmarks();
            setIsBookmarked(bookmarks.includes(foundItem.title));
          } catch (error) {
            console.error('Error fetching bookmarks:', error);
          }
        }
      };
      
      checkBookmark();
    }
    
    setIsLoading(false);
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [id]);
  
  // Handle bookmark functionality
  const handleBookmark = async () => {
    if (!item) return;
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to bookmark items');
      return;
    }
    
    try {
      const itemId = item.title;
      
      await dashboardService.addBookmark(itemId);
      
      setIsBookmarked(true);
      toast.success(`"${item.title}" added to your bookmarks`);
    } catch (error: any) {
      console.error('Bookmark error:', error);
      toast.error(error.message || 'Failed to add bookmark');
    }
  };
  
  // Handle share functionality
  const handleShare = () => {
    if (navigator.share && item) {
      navigator.share({
        title: item.title,
        text: item.description,
        url: window.location.href,
      })
      .catch((error) => {
        console.error('Error sharing:', error);
        toast.info('Sharing feature coming soon!');
      });
    } else {
      toast.info('Sharing feature coming soon!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto py-20 px-4 flex items-center justify-center">
          <div className="animate-pulse">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto py-20 px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Heritage Item Not Found</h2>
          <p className="mb-6">The heritage item you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/explore" 
            className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium inline-flex items-center gap-2"
          >
            <ChevronLeft size={18} /> Back to Explore
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Generate random "facts" for demonstration purposes
  const randomYearStart = Math.floor(Math.random() * 1000) + 100;
  const randomYearEnd = randomYearStart + Math.floor(Math.random() * 500);
  const randomFacts = [
    `Built during the ${randomYearStart}-${randomYearEnd} period`,
    `Visited by over ${Math.floor(Math.random() * 900) + 100}K tourists annually`,
    `Covers an area of ${Math.floor(Math.random() * 90) + 10} acres`,
    `Features ${Math.floor(Math.random() * 50) + 5} distinct architectural elements`,
    `Recognized as a UNESCO site in ${1980 + Math.floor(Math.random() * 40)}`,
  ];
  
  // Random selection of 3 facts
  const displayFacts = [...randomFacts].sort(() => 0.5 - Math.random()).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative">
        {/* Hero Image */}
        <div className="w-full h-[50vh] md:h-[60vh] overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/50 z-10"></div>
          <img 
            src={item.imageSrc} 
            alt={item.title} 
            className="w-full h-full object-cover object-center"
          />
          
          {/* Back Link - Absolute positioned over the hero image */}
          <div className="absolute top-4 left-4 z-20">
            <Link 
              to="/explore" 
              className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg font-medium text-white hover:bg-white/20 transition-colors flex items-center gap-2"
            >
              <ChevronLeft size={18} /> Back
            </Link>
          </div>
          
          {/* Category Badge */}
          <div className="absolute top-4 right-4 z-20">
            <span className="px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium">
              {item.category}
            </span>
          </div>
          
          {/* Title Container */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-20">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-2">
                {item.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-white/80 text-sm">
                <span className="flex items-center gap-1">
                  <MapPin size={14} className="opacity-70" /> 
                  India
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} className="opacity-70" /> 
                  Historical Heritage
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="py-10 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mb-6">
            <Button 
              variant="outline" 
              size="sm" 
              className={`rounded-full px-4 ${isBookmarked ? 'bg-primary text-white' : ''}`}
              onClick={handleBookmark}
            >
              {isBookmarked ? (
                <><BookmarkCheck size={16} className="mr-2" /> Bookmarked</>
              ) : (
                <><BookmarkPlus size={16} className="mr-2" /> Bookmark</>
              )}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full px-4"
              onClick={handleShare}
            >
              <Share2 size={16} className="mr-2" /> Share
            </Button>
          </div>
          
          {/* Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-serif font-bold mb-4">About</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {item.description}
            </p>
            
            {/* Extended description - this would normally come from a database */}
            <div className="mt-4 space-y-4">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {item.category === 'History' ? (
                  <>
                    This magnificent historical site stands as a testament to India's rich architectural heritage and cultural significance. 
                    Visitors from around the world are drawn to its timeless beauty and the stories embedded in its walls.
                    The intricate details of its construction reveal the sophisticated craftsmanship and artistic vision of its creators.
                  </>
                ) : item.category === 'Art & Craft' ? (
                  <>
                    This exquisite art form represents centuries of artistic tradition passed down through generations of skilled artisans.
                    Each piece tells a unique story, often depicting mythological tales, everyday life, or the natural world through a distinctive visual language.
                    The techniques and motifs have evolved over time while maintaining their cultural roots and authenticity.
                  </>
                ) : item.category === 'Festivals' ? (
                  <>
                    This vibrant celebration brings communities together in a display of cultural richness and shared tradition.
                    The festival has deep historical and religious significance, marking important seasonal changes or commemorating mythological events.
                    Participants engage in various rituals, feasting, music, and dance, creating a multisensory experience that strengthens social bonds.
                  </>
                ) : item.category === 'Music & Dance' ? (
                  <>
                    This classical performance art form has a structured technique and expressive qualities that have evolved over centuries.
                    It combines rhythmic movements, facial expressions, and hand gestures to convey complex narratives and emotions.
                    Students undergo years of rigorous training to master the intricate choreography and subtle nuances of this distinguished tradition.
                  </>
                ) : (
                  <>
                    This cultural treasure exemplifies the diversity and richness of India's heritage, connecting past and present through living tradition.
                    Its continued relevance in contemporary society speaks to the adaptive nature of cultural practices and their importance in identity formation.
                    Efforts to preserve and promote this aspect of heritage ensure that future generations can appreciate and learn from these valuable cultural expressions.
                  </>
                )}
              </p>
            </div>
          </div>
          
          {/* Map and Directions Section - NEW SECTION */}
          {coordinates && (
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold mb-4">Location & Directions</h2>
              <DirectionsMap destination={coordinates} locationName={item.title} />
              
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                <p>The route shown is approximate. For accurate directions, please use a navigation app.</p>
              </div>
            </div>
          )}
          
          {/* Quick Facts */}
          <div className="mb-8">
            <h2 className="text-2xl font-serif font-bold mb-4">Quick Facts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {displayFacts.map((fact, index) => (
                <div 
                  key={index} 
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700"
                >
                  <p className="text-sm text-gray-700 dark:text-gray-300">{fact}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Image Gallery - added new section */}
          <div className="mb-12">
            <h2 className="text-2xl font-serif font-bold mb-4">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {/* Generate a few similar images using the main image with slight adjustments */}
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <img src={item.imageSrc} alt={`${item.title} - Image 1`} className="w-full h-full object-cover" />
              </div>
              
              {/* For demo purposes, we'll use the same image with different cropping/filters */}
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <img 
                  src={item.imageSrc} 
                  alt={`${item.title} - Image 2`} 
                  className="w-full h-full object-cover object-right-top brightness-105"
                />
              </div>
              
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <img 
                  src={item.imageSrc} 
                  alt={`${item.title} - Image 3`} 
                  className="w-full h-full object-cover object-left-bottom contrast-105"
                />
              </div>
              
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <img 
                  src={item.imageSrc} 
                  alt={`${item.title} - Image 4`} 
                  className="w-full h-full object-cover object-bottom saturate-110"
                />
              </div>
            </div>
          </div>
          
          {/* Related Items */}
          {relatedItems.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-serif font-bold mb-4">You May Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {relatedItems.map(related => (
                  <RelatedItem key={related.id} item={related} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default HeritageDetail; 