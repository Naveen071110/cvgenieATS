
import { Shield, Lock, Eye, CreditCard, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Badge {
  icon: React.ReactNode;
  label: string;
  description: string;
  link?: string;
}

const trustBadges: Badge[] = [
  {
    icon: <Lock className="w-6 h-6" />,
    label: 'SSL Secured',
    description: 'Your data is encrypted and secure',
    link: '#'
  },
  {
    icon: <Shield className="w-6 h-6" />,
    label: 'Privacy Protected',
    description: 'We never share your personal information',
    link: '/privacy'
  },
  
  {
    icon: <Eye className="w-6 h-6" />,
    label: 'No Data Sharing',
    description: 'Your resume data stays private and secure',
    link: '/privacy'
  },
  {
    icon: <CreditCard className="w-6 h-6" />,
    label: 'Secure Payments',
    description: 'Powered by industry-leading payment security',
    link: '#'
  }
];

interface TrustBadgesProps {
  className?: string;
}

export function TrustBadges({ className }: TrustBadgesProps) {
  return (
    <div className={cn('trust-badges', className)}>
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-white dark:text-white mb-2">
          Trusted & Secure
        </h3>
        <p className="text-gray-300 dark:text-gray-300 text-sm">
          Your privacy and security are our top priorities
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-center max-w-4xl mx-auto">
        {trustBadges.map((badge, index) => (
          <div
            key={index}
            className="group relative"
          >
            <div className="flex flex-col items-center p-4 bg-gray-800 dark:bg-gray-800 rounded-lg border border-gray-700 dark:border-gray-700 hover:border-primary/30 dark:hover:border-blue-500/30 hover:shadow-md transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 dark:bg-blue-900/30 rounded-lg mb-3 text-primary dark:text-blue-400 group-hover:bg-primary/20 dark:group-hover:bg-blue-900/40 transition-colors">
                {badge.icon}
              </div>
              <span className="text-sm font-medium text-white dark:text-white text-center">
                {badge.label}
              </span>
            </div>
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
              {badge.description}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
