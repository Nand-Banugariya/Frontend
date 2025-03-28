import React, { useState } from 'react';
import { HeritageItem } from './FeaturedSection';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  CircleMarker,
  Polygon,
  Tooltip,
  ZoomControl
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { LatLngTuple } from 'leaflet';

// Fix Leaflet marker icons
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Mapping of historical sites to coordinates
const HISTORICAL_SITES_COORDINATES: Record<string, LatLngTuple> = {
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

// India border coordinates (latitude, longitude format for Leaflet)
const INDIA_BORDER_COORDINATES: LatLngTuple[] = [
  [35.49401, 77.837451],
  [34.321936, 78.912269],
  [33.506198, 78.811086],
  [32.994395, 79.208892],
  [32.48378, 79.176129],
  [32.618164, 78.458446],
  [31.515906, 78.738894],
  [30.882715, 79.721367],
  [30.183481, 81.111256],
  [29.729865, 80.476721],
  [28.79447, 80.088425],
  [28.416095, 81.057203],
  [27.925479, 81.999987],
  [27.364506, 83.304249],
  [27.234901, 84.675018],
  [26.726198, 85.251779],
  [26.630985, 86.024393],
  [26.397898, 87.227472],
  [26.414615, 88.060238],
  [26.810405, 88.174804],
  [27.445819, 88.043133],
  [27.876542, 88.120441],
  [28.086865, 88.730326],
  [27.299316, 88.814248],
  [27.098966, 88.835643],
  [26.719403, 89.744528],
  [26.875724, 90.373275],
  [26.808648, 91.217513],
  [26.83831, 92.033484],
  [27.452614, 92.103712],
  [27.771742, 91.696657],
  [27.896876, 92.503119],
  [28.640629, 93.413348],
  [29.277438, 94.56599],
  [29.031717, 95.404802],
  [29.452802, 96.117679],
  [28.83098, 96.586591],
  [28.411031, 96.248833],
  [28.261583, 97.327114],
  [27.882536, 97.402561],
  [27.699059, 97.051989],
  [27.083774, 97.133999],
  [27.264589, 96.419366],
  [26.573572, 95.124768],
  [26.001307, 95.155153],
  [25.162495, 94.603249],
  [24.675238, 94.552658],
  [23.850741, 94.106742],
  [24.078556, 93.325188],
  [23.043658, 93.286327],
  [22.703111, 93.060294],
  [22.27846, 93.166128],
  [22.041239, 92.672721],
  [23.627499, 92.146035],
  [23.624346, 91.869928],
  [22.985264, 91.706475],
  [23.503527, 91.158963],
  [24.072639, 91.46773],
  [24.130414, 91.915093],
  [24.976693, 92.376202],
  [25.147432, 91.799596],
  [25.132601, 90.872211],
  [25.26975, 89.920693],
  [25.965082, 89.832481],
  [26.014407, 89.355094],
  [26.446526, 88.563049],
  [25.768066, 88.209789],
  [25.238692, 88.931554],
  [24.866079, 88.306373],
  [24.501657, 88.084422],
  [24.233715, 88.69994],
  [23.631142, 88.52977],
  [22.879146, 88.876312],
  [22.055708, 89.031961],
  [21.690588, 88.888766],
  [21.703172, 88.208497],
  [21.495562, 86.975704],
  [20.743308, 87.033169],
  [20.151638, 86.499351],
  [19.478579, 85.060266],
  [18.30201, 83.941006],
  [17.671221, 83.189217],
  [17.016636, 82.192792],
  [16.556664, 82.191242],
  [16.310219, 81.692719],
  [15.951972, 80.791999],
  [15.899185, 80.324896],
  [15.136415, 80.025069],
  [13.835771, 80.233274],
  [13.006261, 80.286294],
  [12.056215, 79.862547],
  [10.357275, 79.857999],
  [10.308854, 79.340512],
  [9.546136, 78.885345],
  [9.216544, 79.18972],
  [8.933047, 78.277941],
  [8.252959, 77.941165],
  [7.965535, 77.539898],
  [8.899276, 76.592979],
  [10.29963, 76.130061],
  [11.308251, 75.746467],
  [11.781245, 75.396101],
  [12.741936, 74.864816],
  [13.992583, 74.616717],
  [14.617222, 74.443859],
  [15.990652, 73.534199],
  [17.92857, 73.119909],
  [19.208234, 72.820909],
  [20.419503, 72.824475],
  [21.356009, 72.630533],
  [20.757441, 71.175273],
  [20.877331, 70.470459],
  [22.089298, 69.16413],
  [22.450775, 69.644928],
  [22.84318, 69.349597],
  [23.691965, 68.176645],
  [24.359134, 68.842599],
  [24.356524, 71.04324],
  [25.215102, 70.844699],
  [25.722229, 70.282873],
  [26.491872, 70.168927],
  [26.940966, 69.514393],
  [27.989196, 70.616496],
  [27.91318, 71.777666],
  [28.961592, 72.823752],
  [29.976413, 73.450638],
  [30.979815, 74.42138],
  [31.692639, 74.405929],
  [32.271105, 75.258642],
  [32.7649, 74.451559],
  [33.441473, 74.104294],
  [34.317699, 73.749948],
  [34.748887, 74.240203],
  [34.504923, 75.757061],
  [34.653544, 76.871722],
  [35.49401, 77.837451]
];

interface MapSectionProps {
  historyItems: HeritageItem[];
}

// Custom marker component
const CustomMarker = ({ 
  item, 
  position, 
  isSelected, 
  onMouseEnter, 
  onMouseLeave 
}: { 
  item: HeritageItem, 
  position: LatLngTuple, 
  isSelected: boolean, 
  onMouseEnter: () => void, 
  onMouseLeave: () => void 
}) => (
  <CircleMarker 
    center={position}
    radius={isSelected ? 8 : 5}
    pathOptions={{
      fillColor: isSelected ? '#ef4444' : '#dc2626',
      color: 'white',
      weight: 2,
      fillOpacity: 0.8,
      opacity: 1
    }}
    eventHandlers={{
      mouseover: onMouseEnter,
      mouseout: onMouseLeave
    }}
  >
    <Tooltip permanent={isSelected} direction="top" className="custom-tooltip">
      <div className="font-semibold">{item.title.split(':')[0]}</div>
    </Tooltip>
  </CircleMarker>
);

const MapSection: React.FC<MapSectionProps> = ({ historyItems }) => {
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  
  // Filter history items with coordinates
  const mappableItems = historyItems.filter(
    item => HISTORICAL_SITES_COORDINATES[item.title]
  );

  return (
    <div className="w-full border rounded-lg overflow-hidden shadow-lg">
      <h3 className="text-xl font-bold p-4 bg-gradient-to-r from-primary/20 to-primary/5 border-b">
        Explore Historical Sites Across India
      </h3>
      
      <div className="relative">
        {/* Map container */}
        <MapContainer 
          center={[20.5937, 78.9629]} 
          zoom={5} 
          style={{ height: '450px', width: '100%' }}
          zoomControl={false}
          className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950"
        >
          {/* Base map layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            className="map-tiles"
          />
          
          {/* Custom ZoomControl position */}
          <ZoomControl position="bottomright" />
          
          {/* India outline */}
          <Polygon 
            positions={INDIA_BORDER_COORDINATES}
            pathOptions={{
              fillColor: '#93c5fd',
              fillOpacity: 0.3,
              weight: 2,
              opacity: 1,
              color: '#3b82f6',
              dashArray: '',
            }}
          />
          
          {/* Historical site markers */}
          {mappableItems.map((item) => {
            const coordinates = HISTORICAL_SITES_COORDINATES[item.title];
            if (coordinates) {
              const isSelected = selectedMarker === item.title;
              return (
                <CustomMarker
                  key={item.id}
                  item={item}
                  position={coordinates}
                  isSelected={isSelected}
                  onMouseEnter={() => setSelectedMarker(item.title)}
                  onMouseLeave={() => setSelectedMarker(null)}
                />
              );
            }
            return null;
          })}
        </MapContainer>
        
        {/* CSS for map styling */}
        <style>{`
          .custom-tooltip {
            background: white;
            border: none;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
          }
          .map-tiles {
            filter: saturate(0.8) contrast(1.1);
          }
        `}</style>
      </div>
      
      {/* Legend section */}
      <div className="p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="text-sm">
          <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Historical Sites:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {historyItems.map(item => {
              const hasCoordinates = HISTORICAL_SITES_COORDINATES[item.title];
              return (
                <div 
                  key={item.id} 
                  className={`flex items-center gap-2 p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                    selectedMarker === item.title 
                      ? 'bg-gray-100 dark:bg-gray-700 shadow-sm' 
                      : ''
                  }`}
                  onMouseEnter={() => setSelectedMarker(item.title)}
                  onMouseLeave={() => setSelectedMarker(null)}
                >
                  <span className={`h-3 w-3 rounded-full ${
                    hasCoordinates 
                      ? 'bg-gradient-to-r from-red-600 to-red-500 shadow-sm' 
                      : 'bg-gray-400'
                  }`}></span>
                  <span className="text-xs font-medium truncate text-gray-700 dark:text-gray-300">{item.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapSection; 