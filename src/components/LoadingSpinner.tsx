import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

const LoadingSpinner = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50 transition-opacity duration-300 opacity-100">
      <div className="border-4 border-t-4 border-gray-300 border-solid rounded-full w-16 h-16 animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner;