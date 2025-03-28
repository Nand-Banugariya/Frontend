import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Filter, MapPin, Clock, Calendar, Info, ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth, isSameDay } from 'date-fns';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Festival types
interface Festival {
  id: string;
  name: string;
  date: Date;
  description: string;
  location: string;
  type: string;
  image: string;
  isNational: boolean;
}

// Sample festival data
const festivals: Festival[] = [
  {
    id: '1',
    name: 'Diwali',
    date: new Date(2024, 9, 31), // October 31, 2024
    description: 'The festival of lights celebrates the victory of light over darkness, good over evil, and knowledge over ignorance. Homes are decorated with oil lamps (diyas), colorful rangoli, and fireworks illuminate the night sky.',
    location: 'All across India',
    type: 'Religious',
    image: 'https://images.unsplash.com/photo-1606487485061-99fc8576fb40?q=80&w=1000',
    isNational: true
  },
  {
    id: '2',
    name: 'Holi',
    date: new Date(2025, 2, 14), // March 14, 2025
    description: 'The festival of colors celebrates the eternal love of Radha and Krishna, and the victory of good over evil. People throw colored powders and water at each other, dance to music, and share sweets.',
    location: 'All across India',
    type: 'Religious',
    image: 'https://images.unsplash.com/photo-1576610346372-f3231973214d?q=80&w=1000',
    isNational: true
  },
  {
    id: '3',
    name: 'Durga Puja',
    date: new Date(2024, 9, 10), // October 10, 2024
    description: 'A celebration of the goddess Durga\'s victory over the demon Mahishasura, symbolizing the triumph of good over evil. Elaborate pandals are set up, cultural performances are organized, and the goddess is worshipped with devotion.',
    location: 'Bengal, Assam, Odisha',
    type: 'Religious',
    image: 'https://images.unsplash.com/photo-1664099898167-ffd8f137c372?q=80&w=1000',
    isNational: false
  },
  {
    id: '4',
    name: 'Ganesh Chaturthi',
    date: new Date(2024, 8, 7), // September 7, 2024
    description: 'A festival honoring the elephant-headed deity Ganesha, god of wisdom, prosperity, and good fortune. Clay idols of Ganesha are installed in homes and public pandals, and immersed in water bodies on the final day.',
    location: 'Maharashtra, Telangana, Andhra Pradesh',
    type: 'Religious',
    image: 'https://images.unsplash.com/photo-1599894019794-50339c9ad89c?q=80&w=1000',
    isNational: false
  },
  {
    id: '5',
    name: 'Onam',
    date: new Date(2024, 8, 14), // September 14, 2024
    description: 'A harvest festival celebrated in Kerala, marking the homecoming of the legendary King Mahabali. Elaborate flower carpets (pookalams), boat races, traditional dance forms, and grand feasts (Onasadya) are key elements.',
    location: 'Kerala',
    type: 'Harvest',
    image: 'https://images.unsplash.com/photo-1627911206541-e0a3eac44bf7?q=80&w=1000',
    isNational: false
  },
  {
    id: '6',
    name: 'Pongal',
    date: new Date(2025, 0, 15), // January 15, 2025
    description: 'A four-day harvest festival celebrated in Tamil Nadu, dedicated to the Sun God. Fresh rice is cooked in milk outdoors in an earthen pot, and families decorate their homes with kolam designs and sugarcane.',
    location: 'Tamil Nadu',
    type: 'Harvest',
    image: 'https://images.unsplash.com/photo-1610165637461-e0a3eac44bf7?q=80&w=1000',
    isNational: false
  },
  {
    id: '7',
    name: 'Navratri',
    date: new Date(2024, 9, 3), // October 3, 2024
    description: 'A nine-night festival celebrating the divine feminine, with dancing, music, and colorful decorations. Different forms of Goddess Durga are worshipped, and Garba and Dandiya Raas are popular dance forms performed during this period.',
    location: 'All across India',
    type: 'Religious',
    image: 'https://images.unsplash.com/photo-1636569896494-72e7b52ae340?q=80&w=1000',
    isNational: true
  },
  {
    id: '8',
    name: 'Raksha Bandhan',
    date: new Date(2024, 7, 19), // August 19, 2024
    description: 'A celebration of the bond between brothers and sisters, involving the tying of a protective thread (rakhi) by sisters on their brothers\' wrists. Brothers offer gifts and promise to protect their sisters.',
    location: 'Northern and Western India',
    type: 'Cultural',
    image: 'https://images.unsplash.com/photo-1628508436612-b2ed9b0397c9?q=80&w=1000',
    isNational: false
  },
  {
    id: '9',
    name: 'Republic Day',
    date: new Date(2025, 0, 26), // January 26, 2025
    description: 'National holiday commemorating the adoption of the Constitution of India. The main parade takes place in New Delhi, featuring cultural tableaux, military displays, and school children performances.',
    location: 'All across India',
    type: 'National',
    image: 'https://images.unsplash.com/photo-1612538811006-6d279a3cf541?q=80&w=1000',
    isNational: true
  },
  {
    id: '10',
    name: 'Independence Day',
    date: new Date(2024, 7, 15), // August 15, 2024
    description: 'National holiday celebrating India\'s independence from British rule in 1947. The Prime Minister hoists the national flag at the Red Fort in Delhi, followed by a speech and cultural programs nationwide.',
    location: 'All across India',
    type: 'National',
    image: 'https://images.unsplash.com/photo-1566155119454-2b581dd44c59?q=80&w=1000',
    isNational: true
  },
  {
    id: '11',
    name: 'Baisakhi',
    date: new Date(2025, 3, 13), // April 13, 2025
    description: 'A harvest festival and Sikh New Year celebration, marking the formation of the Khalsa Panth. Gurdwaras are decorated, processions are organized, and traditional folk dances like Bhangra and Gidda are performed.',
    location: 'Punjab, Haryana',
    type: 'Harvest',
    image: 'https://images.unsplash.com/photo-1624085568108-36f584f9dc5e?q=80&w=1000',
    isNational: false
  },
  {
    id: '12',
    name: 'Janmashtami',
    date: new Date(2024, 7, 26), // August 26, 2024
    description: 'A celebration of Lord Krishna\'s birth, featuring devotional songs, dances, and the Dahi Handi ceremony. Temples are decorated, night-long vigils are held, and dramatic reenactments of Krishna\'s childhood are performed.',
    location: 'All across India',
    type: 'Religious',
    image: 'https://images.unsplash.com/photo-1623167439223-577a876ebf68?q=80&w=1000',
    isNational: false
  },
  {
    id: '13',
    name: 'Makar Sankranti',
    date: new Date(2025, 0, 14), // January 14, 2025
    description: 'A harvest festival dedicated to the Sun God, marking the transition of the sun into the zodiac sign of Capricorn. Kite flying, bonfires, and the preparation of sweets made with sesame and jaggery are common traditions.',
    location: 'All across India',
    type: 'Harvest',
    image: 'https://images.unsplash.com/photo-1604154274129-4c5f5223131e?q=80&w=1000',
    isNational: false
  },
  {
    id: '14',
    name: 'Eid al-Fitr',
    date: new Date(2025, 3, 1), // April 1, 2025
    description: 'Celebration marking the end of Ramadan, the holy month of fasting. Muslims offer special prayers, exchange gifts, wear new clothes, and prepare festive meals to share with family and friends.',
    location: 'All across India',
    type: 'Religious',
    image: 'https://images.unsplash.com/photo-1651956532326-33078c4496ce?q=80&w=1000',
    isNational: true
  },
  {
    id: '15',
    name: 'Eid al-Adha',
    date: new Date(2024, 5, 17), // June 17, 2024
    description: 'Also known as Bakrid, this festival of sacrifice commemorates Prophet Ibrahim\'s willingness to sacrifice his son as an act of obedience to God. Prayer services are held, and meat from sacrificed animals is shared with family and those in need.',
    location: 'All across India',
    type: 'Religious',
    image: 'https://images.unsplash.com/photo-1651956531257-8c353667d098?q=80&w=1000',
    isNational: true
  },
  {
    id: '16',
    name: 'Guru Nanak Jayanti',
    date: new Date(2024, 10, 15), // November 15, 2024
    description: 'Celebration of the birth of Guru Nanak, the founder of Sikhism. Akhand Path (continuous reading of the Guru Granth Sahib), processions, langar (community meals), and prayers at Gurdwaras mark the occasion.',
    location: 'All across India, especially Punjab',
    type: 'Religious',
    image: 'https://images.unsplash.com/photo-1619566165478-980961183807?q=80&w=1000',
    isNational: true
  },
  {
    id: '17',
    name: 'Karwa Chauth',
    date: new Date(2024, 9, 20), // October 20, 2024
    description: 'A festival where married women fast from sunrise to moonrise for the safety and longevity of their husbands. Women dress in bridal attire, apply henna on their hands, and break their fast after offering prayers to the moon.',
    location: 'Northern India',
    type: 'Cultural',
    image: 'https://images.pexels.com/photos/5453909/pexels-photo-5453909.jpeg',
    isNational: false
  },
  {
    id: '18',
    name: 'Chhath Puja',
    date: new Date(2024, 10, 7), // November 7, 2024
    description: 'A four-day festival dedicated to the Sun God and Chhathi Maiya. Devotees fast, stand in water for long periods, and offer prayers to the rising and setting sun. Prasad consisting of thekua, fruits, and sugarcane is prepared.',
    location: 'Bihar, Jharkhand, UP, Delhi',
    type: 'Religious',
    image: 'https://images.pexels.com/photos/7701493/pexels-photo-7701493.jpeg',
    isNational: false
  },
  {
    id: '19',
    name: 'Lohri',
    date: new Date(2025, 0, 13), // January 13, 2025
    description: 'A winter harvest festival celebrated primarily by Punjabis. Families gather around a bonfire, throw sesame seeds, jaggery, and popcorn into the fire, sing folk songs, and perform bhangra and gidda dances.',
    location: 'Punjab, Haryana, Delhi',
    type: 'Harvest',
    image: 'https://images.pexels.com/photos/15873627/pexels-photo-15873627/free-photo-of-people-celebrating-lohri-festival.jpeg',
    isNational: false
  },
  {
    id: '20',
    name: 'Buddha Purnima',
    date: new Date(2025, 4, 12), // May 12, 2025
    description: 'Celebration of the birth, enlightenment, and death of Gautama Buddha. Buddhists visit temples, offer prayers, meditate, and participate in processions. Statues of Buddha are bathed, and charitable acts are performed.',
    location: 'All across India',
    type: 'Religious',
    image: 'https://images.unsplash.com/photo-1605138459043-8d2aa3b15220?q=80&w=1000',
    isNational: true
  },
  {
    id: '21',
    name: 'Bihu',
    date: new Date(2025, 3, 14), // April 14, 2025
    description: 'The most important festival of Assam, celebrating the Assamese New Year. Three Bihu festivals are celebrated throughout the year, with Bohag Bihu being the most prominent. Traditional dance, music, and feasts are essential elements.',
    location: 'Assam',
    type: 'Harvest',
    image: 'https://images.pexels.com/photos/10389962/pexels-photo-10389962.jpeg',
    isNational: false
  },
  {
    id: '22',
    name: 'Gudi Padwa',
    date: new Date(2025, 2, 31), // March 31, 2025
    description: 'Maharashtrian New Year celebration. Families hoist a gudi (bamboo stick with cloth, neem leaves, and marigold flowers) outside their homes, draw rangoli, and prepare special dishes like shrikhand and puran poli.',
    location: 'Maharashtra',
    type: 'Cultural',
    image: 'https://images.pexels.com/photos/11358053/pexels-photo-11358053.jpeg',
    isNational: false
  },
  {
    id: '23',
    name: 'Ugadi',
    date: new Date(2025, 2, 31), // March 31, 2025
    description: 'New Year festival celebrated in Andhra Pradesh, Telangana, and Karnataka. Special dishes like Ugadi pachadi (with six different flavors representing the emotions of life) are prepared, and homes are decorated with mango leaves.',
    location: 'Andhra Pradesh, Karnataka, Telangana',
    type: 'Cultural',
    image: 'https://images.pexels.com/photos/10365583/pexels-photo-10365583.jpeg',
    isNational: false
  },
  {
    id: '24',
    name: 'Vishu',
    date: new Date(2025, 3, 14), // April 14, 2025
    description: 'Kerala New Year festival. The highlight is the Vishukkani arrangement (auspicious items like rice, fruits, gold, clothes, and the Konna flower viewed first thing in the morning). Fireworks and feasts are also part of the celebration.',
    location: 'Kerala',
    type: 'Cultural',
    image: 'https://images.pexels.com/photos/7433786/pexels-photo-7433786.jpeg',
    isNational: false
  },
  {
    id: '25',
    name: 'Thrissur Pooram',
    date: new Date(2025, 4, 10), // May 10, 2025
    description: 'One of the most spectacular temple festivals in Kerala. Beautifully decorated elephants, traditional percussion ensembles, parasol exchanges, and fireworks make this a visual and auditory treat.',
    location: 'Kerala',
    type: 'Religious',
    image: 'https://images.pexels.com/photos/12715257/pexels-photo-12715257.jpeg',
    isNational: false
  },
  {
    id: '26',
    name: 'Hemis Festival',
    date: new Date(2024, 6, 21), // July 21, 2024
    description: 'The largest monastic festival in Ladakh, celebrating the birth of Guru Padmasambhava. Mask dances (Cham) performed by monks, colorful costumes, and religious ceremonies draw tourists from around the world.',
    location: 'Ladakh',
    type: 'Religious',
    image: 'https://images.pexels.com/photos/2973485/pexels-photo-2973485.jpeg',
    isNational: false
  },
  {
    id: '27',
    name: 'Pushkar Camel Fair',
    date: new Date(2024, 10, 11), // November 11, 2024
    description: 'One of the world\'s largest camel fairs, combining livestock trading with a religious pilgrimage. Cultural performances, camel races, folk music, and bustling markets create a vibrant atmosphere.',
    location: 'Rajasthan',
    type: 'Cultural',
    image: 'https://images.unsplash.com/photo-1628695323351-a8b6e8f33573?q=80&w=1000',
    isNational: false
  },
  {
    id: '28',
    name: 'Kumbh Mela',
    date: new Date(2025, 0, 13), // January 13, 2025 (Haridwar Kumbh)
    description: 'The world\'s largest religious gathering, held every 12 years at four river bank pilgrimage sites. Millions of Hindus gather to bathe in sacred rivers, listen to religious discourses, and participate in rituals.',
    location: 'Haridwar, Allahabad, Nashik, Ujjain (rotational)',
    type: 'Religious',
    image: 'https://images.unsplash.com/photo-1611516491192-0fb56b7f0ad9?q=80&w=1000',
    isNational: true
  },
  {
    id: '29',
    name: 'Hornbill Festival',
    date: new Date(2024, 11, 1), // December 1, 2024
    description: 'Nagaland\'s premier cultural festival, showcasing the diversity of Naga tribes. Traditional songs, dances, indigenous games, local cuisine, handicrafts, and ceremonies provide glimpses into the rich Naga heritage.',
    location: 'Nagaland',
    type: 'Cultural',
    image: 'https://images.pexels.com/photos/8965202/pexels-photo-8965202.jpeg',
    isNational: false
  },
  {
    id: '30',
    name: 'Ganesh Visarjan',
    date: new Date(2024, 8, 17), // September 17, 2024
    description: 'The culmination of Ganesh Chaturthi, where idols of Lord Ganesha are immersed in water bodies. Processions with music, dancing, and chanting accompany the immersion ceremony, symbolizing Ganesha\'s return to Mount Kailash.',
    location: 'Maharashtra, Gujarat, and other states',
    type: 'Religious',
    image: 'https://images.unsplash.com/photo-1568000606279-e89a03bd3dcd?q=80&w=1000',
    isNational: false
  },
  {
    id: '31',
    name: 'Puri Rath Yatra',
    date: new Date(2024, 6, 7), // July 7, 2024
    description: 'Ancient chariot festival dedicated to Lord Jagannath. Three massive, elaborately decorated wooden chariots carrying Lord Jagannath, Balabhadra, and Subhadra are pulled through the streets of Puri by thousands of devotees.',
    location: 'Odisha',
    type: 'Religious',
    image: 'https://images.unsplash.com/photo-1625905951137-39b1b8482cc9?q=80&w=1000',
    isNational: false
  },
  {
    id: '32',
    name: 'Christmas',
    date: new Date(2024, 11, 25), // December 25, 2024
    description: 'Celebration of the birth of Jesus Christ. Churches hold midnight masses, homes are decorated with Christmas trees and lights, carol singing groups visit neighborhoods, and children receive gifts from Santa Claus.',
    location: 'All across India',
    type: 'Religious',
    image: 'https://images.unsplash.com/photo-1575794149881-d63a56ba3a4e?q=80&w=1000',
    isNational: true
  },
  {
    id: '33',
    name: 'Teej',
    date: new Date(2024, 7, 8), // August 8, 2024
    description: 'Festival celebrated by women for marital bliss, well-being of spouse and children, and good harvest. Women wear green clothes, apply henna, sing, dance, and observe a fast. Swings are set up, and offerings are made to Goddess Parvati.',
    location: 'Rajasthan, UP, Bihar, Haryana',
    type: 'Cultural',
    image: 'https://images.pexels.com/photos/13997232/pexels-photo-13997232.jpeg',
    isNational: false
  },
  {
    id: '34',
    name: 'Goa Carnival',
    date: new Date(2025, 1, 1), // February 1, 2025
    description: 'A legacy of Portuguese rule, this pre-Lent celebration features colorful parades, music, dance, and revelry. King Momo presides over the festivities, and streets come alive with floats, costumes, and Indo-Portuguese cultural displays.',
    location: 'Goa',
    type: 'Cultural',
    image: 'https://images.pexels.com/photos/3687999/pexels-photo-3687999.jpeg',
    isNational: false
  },
  {
    id: '35',
    name: 'Maha Shivaratri',
    date: new Date(2025, 2, 1), // March 1, 2025
    description: 'The great night of Lord Shiva, celebrated with night-long vigils, fasting, meditation, and offering of bel leaves. Temples are adorned, the Shiva Linga is worshipped with milk, honey, and water, and devotional songs are sung.',
    location: 'All across India',
    type: 'Religious',
    image: 'https://images.unsplash.com/photo-1598781606926-37e7a02205d0?q=80&w=1000',
    isNational: true
  },
  {
    id: '36',
    name: 'Losar',
    date: new Date(2025, 1, 22), // February 22, 2025
    description: 'Tibetan New Year celebration observed in Ladakh, Sikkim, and other Himalayan regions. Monasteries host mask dances, homes are cleansed and decorated, traditional food is prepared, and prayers are offered for prosperity.',
    location: 'Ladakh, Sikkim, Himalayan regions',
    type: 'Cultural',
    image: 'https://images.pexels.com/photos/5087409/pexels-photo-5087409.jpeg',
    isNational: false
  },
  {
    id: '37',
    name: 'Bhai Dooj',
    date: new Date(2024, 10, 2), // November 2, 2024
    description: 'Celebration of the bond between brothers and sisters, observed two days after Diwali. Sisters apply tilak on their brothers\' foreheads, pray for their long life, and offer sweets. Brothers give gifts and promise protection.',
    location: 'All across India',
    type: 'Cultural',
    image: 'https://images.pexels.com/photos/6546888/pexels-photo-6546888.jpeg',
    isNational: false
  },
  {
    id: '38',
    name: 'Dussehra',
    date: new Date(2024, 9, 12), // October 12, 2024
    description: 'Celebration of Lord Rama\'s victory over Ravana. Elaborate Ramlila performances culminate in the burning of giant effigies of Ravana, Kumbhakarna, and Meghnad, symbolizing the triumph of good over evil.',
    location: 'All across India',
    type: 'Religious',
    image: 'https://images.unsplash.com/photo-1609843053099-5fa9747a6f8d?q=80&w=1000',
    isNational: true
  },
  {
    id: '39',
    name: 'Gandhiji Jayanti',
    date: new Date(2024, 9, 2), // October 2, 2024
    description: 'National holiday commemorating the birth of Mahatma Gandhi, father of the nation. Prayer meetings, commemoration ceremonies, and initiatives promoting non-violence and cleanliness are organized nationwide.',
    location: 'All across India',
    type: 'National',
    image: 'https://images.unsplash.com/photo-1657101130853-d963f13ab28c?q=80&w=1000',
    isNational: true
  },
  {
    id: '40',
    name: 'Tamil New Year (Puthandu)',
    date: new Date(2025, 3, 14), // April 14, 2025
    description: 'Tamil New Year celebration. Homes are decorated with kolam patterns, mango leaves, and a tray of auspicious items is placed before the deity. Traditional feasts are prepared, and people wear new clothes.',
    location: 'Tamil Nadu',
    type: 'Cultural',
    image: 'https://images.pexels.com/photos/15041162/pexels-photo-15041162/free-photo-of-joyful-women-in-colorful-traditional-saris-celebrating-fest.jpeg',
    isNational: false
  }
];

// Helper function to determine which regions a festival belongs to
const getRegions = (location: string): string[] => {
  const regions: string[] = [];
  
  // Check for North India
  if (['Punjab', 'Haryana', 'Delhi', 'Uttar Pradesh', 'Uttarakhand', 'Himachal Pradesh', 'Jammu and Kashmir', 'Ladakh', 'Rajasthan']
      .some(region => location.includes(region))) {
    regions.push('North Indian');
  }
  
  // Check for South India
  if (['Tamil Nadu', 'Kerala', 'Karnataka', 'Andhra Pradesh', 'Telangana']
      .some(region => location.includes(region))) {
    regions.push('South Indian');
  }
  
  // Check for East India
  if (['West Bengal', 'Odisha', 'Bihar', 'Jharkhand', 'Bengal', 'Assam']
      .some(region => location.includes(region))) {
    regions.push('East Indian');
  }
  
  // Check for West India
  if (['Maharashtra', 'Gujarat', 'Goa']
      .some(region => location.includes(region))) {
    regions.push('West Indian');
  }
  
  // Check for Northeast India
  if (['Assam', 'Nagaland', 'Manipur', 'Mizoram', 'Tripura', 'Meghalaya', 'Arunachal Pradesh', 'Sikkim']
      .some(region => location.includes(region))) {
    regions.push('Northeast Indian');
  }
  
  // Check for Pan-Indian festivals
  if (location.includes('All across India')) {
    regions.push('Pan-Indian');
  }
  
  return regions.length > 0 ? regions : ['Other'];
};

// Helper function to get the primary region for a festival
const getPrimaryRegion = (location: string): string => {
  const regions = getRegions(location);
  
  // Prefer specific regions over Pan-Indian
  if (regions.includes('North Indian') && regions.includes('Pan-Indian')) {
    return 'North Indian';
  }
  if (regions.includes('South Indian') && regions.includes('Pan-Indian')) {
    return 'South Indian';
  }
  if (regions.includes('East Indian') && regions.includes('Pan-Indian')) {
    return 'East Indian';
  }
  if (regions.includes('West Indian') && regions.includes('Pan-Indian')) {
    return 'West Indian';
  }
  if (regions.includes('Northeast Indian') && regions.includes('Pan-Indian')) {
    return 'Northeast Indian';
  }
  
  // Return the first region available
  return regions[0];
};

const filterOptions = [
  { value: 'all', label: 'All Festivals' },
  { value: 'Religious', label: 'Religious' },
  { value: 'Harvest', label: 'Harvest' },
  { value: 'Cultural', label: 'Cultural' },
  { value: 'National', label: 'National' },
  { value: 'national-holidays', label: 'National Holidays' },
  { value: 'north-india', label: 'North Indian' },
  { value: 'south-india', label: 'South Indian' },
  { value: 'east-india', label: 'East Indian' },
  { value: 'west-india', label: 'West Indian' },
  { value: 'northeast-india', label: 'Northeast Indian' }
];

const FestivalCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(null);
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [festivalDialogOpen, setFestivalDialogOpen] = useState(false);
  
  // Function to filter festivals
  const filteredFestivals = festivals.filter(festival => {
    if (filter === 'all') return true;
    if (filter === 'national-holidays') return festival.isNational;
    if (filter === 'north-india') {
      return ['Punjab', 'Haryana', 'Delhi', 'Uttar Pradesh', 'Uttarakhand', 'Himachal Pradesh', 'Jammu and Kashmir', 'Ladakh', 'Rajasthan']
        .some(region => festival.location.includes(region));
    }
    if (filter === 'south-india') {
      return ['Tamil Nadu', 'Kerala', 'Karnataka', 'Andhra Pradesh', 'Telangana']
        .some(region => festival.location.includes(region));
    }
    if (filter === 'east-india') {
      return ['West Bengal', 'Odisha', 'Bihar', 'Jharkhand', 'Bengal', 'Assam']
        .some(region => festival.location.includes(region));
    }
    if (filter === 'west-india') {
      return ['Maharashtra', 'Gujarat', 'Goa']
        .some(region => festival.location.includes(region));
    }
    if (filter === 'northeast-india') {
      return ['Assam', 'Nagaland', 'Manipur', 'Mizoram', 'Tripura', 'Meghalaya', 'Arunachal Pradesh', 'Sikkim']
        .some(region => festival.location.includes(region));
    }
    return festival.type === filter;
  });

  // Get festivals for current month
  const currentMonthFestivals = filteredFestivals.filter(festival => 
    isSameMonth(festival.date, currentMonth)
  );

  // Get days of current month
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  // Handle next/previous month navigation
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Handle opening festival details
  const handleOpenFestival = (festival: Festival) => {
    setSelectedFestival(festival);
    setFestivalDialogOpen(true);
  };

  // Get festivals for a specific day
  const getFestivalsForDay = (day: Date) => {
    return filteredFestivals.filter(festival => isSameDay(festival.date, day));
  };

  // Handle reminder toggle
  const handleToggleReminder = (festivalId: string) => {
    toast.success('Reminder set for this festival');
    // In a real app, this would connect to a backend to save the reminder for the user
  };

  // Get all upcoming festivals (sorted by date)
  const upcomingFestivals = [...filteredFestivals]
    .filter(festival => festival.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-serif font-bold mb-4 mt-10">Indian Festival Calendar</h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Explore India's rich cultural tapestry through its vibrant festivals and celebrations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Filter className="mr-2 h-5 w-5" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {filterOptions.map(option => (
                      <Button
                        key={option.value}
                        variant={filter === option.value ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => setFilter(option.value)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Info className="mr-2 h-5 w-5" />
                    Upcoming Festivals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingFestivals.slice(0, 4).map(festival => (
                      <div key={festival.id} className="flex items-start space-x-3">
                        <div className="bg-primary/10 p-2 rounded-md">
                          <CalendarIcon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{festival.name}</h4>
                          <p className="text-xs text-gray-500">
                            {format(festival.date, 'MMMM d, yyyy')}
                          </p>
                          <div className="flex items-center mt-1 flex-wrap gap-1">
                            <Badge variant="outline" className="text-xs">{festival.type}</Badge>
                            <Badge variant="secondary" className="text-xs">{getPrimaryRegion(festival.location)}</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full text-xs" onClick={() => setViewMode('list')}>
                    View All Festivals
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div className="lg:col-span-3">
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">
                      <Tabs defaultValue="calendar" onValueChange={(value) => setViewMode(value as 'calendar' | 'list')}>
                        <TabsList>
                          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
                          <TabsTrigger value="list">List View</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </CardTitle>
                    {viewMode === 'calendar' && (
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="icon" onClick={handlePrevMonth}>
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="font-medium">
                          {format(currentMonth, 'MMMM yyyy')}
                        </span>
                        <Button variant="outline" size="icon" onClick={handleNextMonth}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  {viewMode === 'calendar' ? (
                    <>
                      {/* Calendar grid */}
                      <div className="grid grid-cols-7 mb-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                          <div key={day} className="text-center text-sm font-medium py-2">
                            {day}
                          </div>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-7 gap-1">
                        {/* Add empty cells for days before the start of the month */}
                        {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, index) => (
                          <div key={`empty-start-${index}`} className="p-2 min-h-[80px]"></div>
                        ))}
                        
                        {/* Calendar days */}
                        {daysInMonth.map(day => {
                          const dayFestivals = getFestivalsForDay(day);
                          const isCurrentDay = isToday(day);
                          
                          return (
                            <div 
                              key={day.toString()}
                              className={cn(
                                "p-1 min-h-[80px] border rounded-md transition-colors",
                                isCurrentDay ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary/50",
                                dayFestivals.length > 0 ? "bg-orange-50 dark:bg-orange-950/20" : ""
                              )}
                            >
                              <div className="text-right mb-1">
                                <span className={cn(
                                  "inline-block rounded-full w-7 h-7 text-center leading-7 text-sm",
                                  isCurrentDay ? "bg-primary text-white" : ""
                                )}>
                                  {day.getDate()}
                                </span>
                              </div>
                              
                              {dayFestivals.length > 0 && (
                                <div className="space-y-1">
                                  {dayFestivals.map(festival => (
                                    <button
                                      key={festival.id}
                                      className="w-full text-left text-xs p-1 rounded bg-orange-100 dark:bg-orange-900/30 hover:bg-orange-200 dark:hover:bg-orange-800/30 transition-colors truncate"
                                      onClick={() => handleOpenFestival(festival)}
                                    >
                                      {festival.name}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                        
                        {/* Add empty cells for days after the end of the month */}
                        {Array.from({ length: 6 - endOfMonth(currentMonth).getDay() }).map((_, index) => (
                          <div key={`empty-end-${index}`} className="p-2 min-h-[80px]"></div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="space-y-4">
                      {upcomingFestivals.length > 0 ? (
                        upcomingFestivals.map(festival => (
                          <Card key={festival.id} className="overflow-hidden">
                            <div className="flex flex-col md:flex-row">
                              <div className="md:w-1/4 h-40 md:h-auto relative">
                                <img 
                                  src={festival.image} 
                                  alt={festival.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="p-4 md:w-3/4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-bold text-lg">{festival.name}</h3>
                                    <div className="flex items-center text-sm text-gray-500 mt-1">
                                      <Calendar className="h-4 w-4 mr-1" />
                                      {format(festival.date, 'MMMM d, yyyy')}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500 mt-1">
                                      <MapPin className="h-4 w-4 mr-1" />
                                      {festival.location}
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-end gap-1">
                                    <Badge>{festival.type}</Badge>
                                    {festival.isNational && <Badge variant="outline">National Holiday</Badge>}
                                  </div>
                                </div>
                                
                                <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                                  {festival.description}
                                </p>
                                
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {getRegions(festival.location).map(region => (
                                    <Badge key={region} variant="secondary" className="text-xs">{region}</Badge>
                                  ))}
                                </div>
                                
                                <div className="flex justify-between items-center mt-4">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => handleOpenFestival(festival)}
                                  >
                                    View Details
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleToggleReminder(festival.id)}
                                  >
                                    <PlusCircle className="h-4 w-4 mr-1" />
                                    Set Reminder
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <div className="inline-block p-3 rounded-full bg-primary/10 mb-4">
                            <Calendar className="h-6 w-6 text-primary" />
                          </div>
                          <h3 className="text-xl font-medium mb-2">No festivals found</h3>
                          <p className="text-gray-500">
                            Try changing your filter selection or explore different months.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {viewMode === 'calendar' && currentMonthFestivals.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Festivals in {format(currentMonth, 'MMMM yyyy')}</CardTitle>
                    <CardDescription>
                      {currentMonthFestivals.length} festival{currentMonthFestivals.length !== 1 ? 's' : ''} this month
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {currentMonthFestivals.map(festival => (
                        <div key={festival.id} className="flex items-start space-x-4">
                          <div className="bg-primary/10 p-3 rounded-full">
                            <Calendar className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{festival.name}</h4>
                                <p className="text-sm text-gray-500">{format(festival.date, 'MMMM d, yyyy')}</p>
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                <Badge>{festival.type}</Badge>
                                {festival.isNational && <Badge variant="outline" className="text-xs">National Holiday</Badge>}
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-1 mt-2">
                              {getRegions(festival.location).map(region => (
                                <Badge key={region} variant="secondary" className="text-xs">{region}</Badge>
                              ))}
                            </div>
                            
                            <Button 
                              variant="link" 
                              className="p-0 h-auto text-sm"
                              onClick={() => handleOpenFestival(festival)}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      
      {/* Festival Detail Dialog */}
      <Dialog open={festivalDialogOpen} onOpenChange={setFestivalDialogOpen}>
        <DialogContent className="max-w-3xl">
          {selectedFestival && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedFestival.name}</DialogTitle>
                <DialogDescription>
                  <div className="flex items-center mt-2 space-x-4">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      {format(selectedFestival.date, 'MMMM d, yyyy')}
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      {selectedFestival.location}
                    </div>
                    <Badge>{selectedFestival.type}</Badge>
                    {selectedFestival.isNational && <Badge variant="outline">National Holiday</Badge>}
                  </div>
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <div className="rounded-lg overflow-hidden">
                    <img 
                      src={selectedFestival.image}
                      alt={selectedFestival.name}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  
                  <div className="flex justify-between mt-4">
                    <Button variant="outline" onClick={() => handleToggleReminder(selectedFestival.id)}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Set Reminder
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">About the Festival</h3>
                    <p className="text-gray-600">{selectedFestival.description}</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Region</h3>
                    <div className="flex flex-wrap gap-2">
                      {getRegions(selectedFestival.location).map(region => (
                        <Badge key={region} variant="secondary">{region}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Traditions & Customs</h3>
                    <p className="text-gray-600">
                      This festival is celebrated with great enthusiasm across its regions.
                      Families gather to share meals, exchange gifts, and participate in cultural activities.
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Cultural Significance</h3>
                    <p className="text-gray-600">
                      The festival holds profound cultural and spiritual significance,
                      connecting people to their heritage and traditions through generations.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default FestivalCalendar; 