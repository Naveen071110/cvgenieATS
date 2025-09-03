
import { cn } from '@/lib/utils';

// Mock company data - in a real app, these would be actual company logos
const companies = [
  { name: 'Google', logo: '🔍' },
  { name: 'Microsoft', logo: '🪟' },
  { name: 'Apple', logo: '🍎' },
  { name: 'Amazon', logo: '📦' },
  { name: 'Netflix', logo: '🎬' },
  { name: 'Adobe', logo: '🎨' },
  { name: 'Spotify', logo: '🎵' },
  { name: 'Uber', logo: '🚗' },
  { name: 'Airbnb', logo: '🏠' },
  { name: 'Slack', logo: '💬' }
];

interface CompanyLogosProps {
  className?: string;
}

export function CompanyLogos({ className }: CompanyLogosProps) {
  return (
    <div className={cn('company-logos overflow-hidden', className)}>
      <div className="relative">
        {/* Gradient overlays for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10"></div>
        
        {/* Scrolling container */}
        <div className="flex animate-marquee">
          {/* First set of logos */}
          <div className="flex items-center space-x-4 md:space-x-6">
            {companies.map((company, index) => (
              <div
                key={`first-${index}`}
                className="flex-shrink-0 flex flex-col items-center p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300 min-w-0"
                title={company.name}
              >
                <div className="text-3xl md:text-4xl mb-2">
                  {company.logo}
                </div>
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  {company.name}
                </span>
              </div>
            ))}
          </div>
          
          {/* Duplicate set for seamless loop */}
          <div className="flex items-center space-x-4 md:space-x-6 ml-4 md:ml-6">
            {companies.map((company, index) => (
              <div
                key={`second-${index}`}
                className="flex-shrink-0 flex flex-col items-center p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300 min-w-0"
                title={company.name}
              >
                <div className="text-3xl md:text-4xl mb-2">
                  {company.logo}
                </div>
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  {company.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
