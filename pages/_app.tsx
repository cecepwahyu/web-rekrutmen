// pages/_app.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../src/components/Layout'; // Ensure this path is correct

// Create a simple loading spinner component
const LoadingSpinner = () => (
  <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
    <div className="w-16 h-16 border-4 border-t-4 border-blue-600 rounded-full animate-spin"></div>
  </div>
);

function MyApp({ Component, pageProps }: any) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Start loading when the route changes, and stop when it's complete
  useEffect(() => {
    const handleStart = (url: string) => {
      setIsLoading(true); // Show loading spinner when route starts changing
    };
    const handleComplete = (url: string) => {
      setIsLoading(false); // Hide loading spinner when route change completes
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete); // Handle route change errors

    // Cleanup event listeners
    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <>
      {isLoading && <LoadingSpinner />} {/* Show loading spinner when page is loading */}
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;
