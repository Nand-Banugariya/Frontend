
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CulturalCardProps {
  title: string;
  description: string;
  imageSrc: string;
  href: string;
  category: string;
  className?: string;
  index?: number;
}

const CulturalCard = ({
  title,
  description,
  imageSrc,
  href,
  category,
  className,
  index = 0,
}: CulturalCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={cn(
        'cultural-card',
        `animate-fadeIn animate-delay-${index * 100}`,
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <a href={href} className="block h-full">
        <div className="relative overflow-hidden aspect-[4/3] rounded-t-xl">
          <img
            src={imageSrc}
            alt={title}
            className={cn(
              "w-full h-full object-cover transition-transform duration-700",
              isHovered ? "scale-110" : "scale-100"
            )}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1.5 bg-white/90 dark:bg-black/70 rounded-full text-xs font-medium">
              {category}
            </span>
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="font-serif text-xl font-bold mb-2">{title}</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
            {description}
          </p>
          <div className={cn(
            "flex items-center text-primary font-medium text-sm transition-all",
            isHovered ? "translate-x-1" : "translate-x-0"
          )}>
            Explore <ArrowRight size={16} className="ml-1" />
          </div>
        </div>
      </a>
    </div>
  );
};

export default CulturalCard;
