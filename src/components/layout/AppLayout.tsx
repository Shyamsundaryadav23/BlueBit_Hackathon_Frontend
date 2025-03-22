// src/components/layout/AppLayout.tsx
import { ReactNode } from 'react';
import { Header } from './Header';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';

interface AppLayoutProps {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
  hideHeader?: boolean;
}

const AppLayout = ({ children, className, fullWidth = false, hideHeader = false }: AppLayoutProps) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const shouldHideHeader = hideHeader || isHomePage;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {!shouldHideHeader && <Header />}
      <main
        className={cn(
          "flex-1 py-6",
          fullWidth ? "" : "container mx-auto px-4",
          className
        )}
      >
        {children}
      </main>
      {/* Footer can be added here if needed */}
    </div>
  );
};

export default AppLayout;
