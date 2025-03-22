
import { cn } from '@/lib/utils';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Loader = ({ size = 'md', className }: LoaderProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div className="flex-center">
      <div 
        className={cn(
          "rounded-full border-t-transparent animate-spin border-primary",
          sizeClasses[size],
          className
        )} 
      />
    </div>
  );
};

export default Loader;