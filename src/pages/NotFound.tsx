// src/components/pages/NotFound.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 text-center bg-white rounded shadow-md">
        <h1 className="mb-4 text-6xl font-bold text-red-500">404</h1>
        <h2 className="mb-6 text-2xl">Page Not Found</h2>
        <p className="mb-6 text-gray-600">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/dashboard" 
          className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
        >
          Return Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;