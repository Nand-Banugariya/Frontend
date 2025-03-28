import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div className="space-y-6 max-w-md">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold">Page Not Found</h2>
          <p className="text-gray-600">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/">
              <Button>Back to Home</Button>
            </Link>
            <Link to="/explore">
              <Button variant="outline">Explore Content</Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
