'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        // No token, redirect to login
        router.push('/login');
        return;
      }

      try {
        // Validate token by making a request to the API
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const response = await fetch(`${API_BASE_URL}/v1/insights/user/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          // Token is valid, redirect to dashboard
          router.push('/dashboard');
        } else {
          // Token is invalid, remove it and redirect to login
          localStorage.removeItem('token');
          router.push('/login');
        }
      } catch (error) {
        // Error occurred, redirect to login
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          <p className="text-white/60 text-sm">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return null;
}