import { Shield, Lock, Eye, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Badge {
  icon: React.ReactNode;
  label: string;
}

const trustBadges: Badge[] = [
  {
    icon: <Lock className="w-4 h-4" />,
    label: 'SSL Encrypted',
  },
  {
    icon: <Shield className="w-4 h-4" />,
    label: 'Privacy First',
  },
  {
    icon: <Eye className="w-4 h-4" />,
    label: 'No Data Sharing',
  },
  {
    icon: <CreditCard className="w-4 h-4" />,
    label: 'Secure Payments',
  }
];

interface TrustBadgesProps {
  className?: string;
}

export function TrustBadges({ className }: TrustBadgesProps) {
  return (
    <div className={cn('trust-badges', className)}>
      <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
        {trustBadges.map((badge, index) => (
          <div
            key={index}
            className="flex items-center gap-2 text-gray-500 dark:text-gray-400"
          >
            <span className="text-gray-400 dark:text-gray-500">
              {badge.icon}
            </span>
            <span className="text-sm font-medium">
              {badge.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
