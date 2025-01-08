import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DesktopNavLinks from './DesktopNavLinks';
import MobileMenuButton from './MobileMenuButton';
import Router from 'next/router';

const MenuBar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const hasToken = false;

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const handleRouteChangeStart = () => {
            setIsLoading(true);
        };

        const handleRouteChangeComplete = () => {
            setIsLoading(false);
        };

        Router.events.on('routeChangeStart', handleRouteChangeStart);
        Router.events.on('routeChangeComplete', handleRouteChangeComplete);
        Router.events.on('routeChangeError', handleRouteChangeComplete);

        return () => {
            Router.events.off('routeChangeStart', handleRouteChangeStart);
            Router.events.off('routeChangeComplete', handleRouteChangeComplete);
            Router.events.off('routeChangeError', handleRouteChangeComplete);
        };
    }, []);

    const handleDrawerToggle = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    const handleProfileDropdownToggle = () => {
        setIsProfileDropdownOpen(!isProfileDropdownOpen);
    };

    const handleMenuClick = (path: string) => {
        Router.push(path);
    };

    const handleSignOut = () => {
        // Add sign-out logic here
    };

    return (
        <header
            className={`fixed top-0 left-0 w-full transition-all duration-300 ${
                isScrolled ? "bg-white py-2 shadow-xl" : "bg-transparent py-4"
            } z-50`}
        >
            <nav className="container mx-auto flex justify-between items-center px-4">
                {/* Logo Section */}
                <div
                    className={`pl-4 sm:pl-24 ${isScrolled ? "text-darkBlue" : "text-white"}`}
                    style={{ width: "300px", height: "auto" }}
                >
                    <Link href="/" legacyBehavior>
                        <a>
                            <Image
                                src={isScrolled ? "/images/Logo_Color.png" : "/images/Logo_Monochrome.png"}
                                alt="BPD Logo"
                                width={150}
                                height={50}
                                priority
                                style={{ width: "auto", height: "auto" }}
                            />
                        </a>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden sm:flex relative py-6">
                    <DesktopNavLinks />
                </div>

                {/* Mobile Navigation */}
                <div className="sm:hidden flex items-center">
                    <MobileMenuButton onClick={handleDrawerToggle} isScrolled={isScrolled} />
                </div>
            </nav>

            {/* Mobile Drawer */}
            {isDrawerOpen && (
                <div className="absolute top-0 left-0 w-full h-screen bg-white z-40 flex flex-col">
                    <div className="flex justify-between items-center px-4 py-4">
                        <Image
                            src="/images/Logo_Color.png"
                            alt="BPD Logo"
                            width={150}
                            height={50}
                            priority
                            style={{ width: "auto", height: "auto" }}
                        />
                        <button
                            onClick={handleDrawerToggle}
                            className="text-darkBlue text-2xl focus:outline-none"
                        >
                            &times; {/* Close Button */}
                        </button>
                    </div>
                    <ul className="flex flex-col items-center justify-center space-y-6 mt-8">
                        <li>
                            <a
                                className="text-darkBlue text-lg hover:text-blue-500"
                                onClick={() => handleMenuClick("/")}
                            >
                                Home
                            </a>
                        </li>
                        <li>
                            <a
                                className="text-darkBlue text-lg hover:text-blue-500"
                                onClick={() => handleMenuClick("/karir")}
                            >
                                Karir
                            </a>
                        </li>
                        <li>
                            <a
                                className="text-darkBlue text-lg hover:text-blue-500"
                                onClick={() => handleMenuClick("/info-artikel")}
                            >
                                Info & Artikel
                            </a>
                        </li>
                        {hasToken && (
                            <>
                                <li>
                                    <a
                                        className="text-darkBlue text-lg hover:text-blue-500"
                                        onClick={() => handleMenuClick("/riwayat")}
                                    >
                                        Riwayat
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className="text-darkBlue text-lg hover:text-blue-500"
                                        onClick={() => handleMenuClick("/pengumuman")}
                                    >
                                        Pengumuman
                                    </a>
                                </li>
                                <li className="relative">
                                    <button
                                        className="text-darkBlue text-lg hover:text-blue-500"
                                        onClick={handleProfileDropdownToggle}
                                    >
                                        Akun
                                    </button>
                                    {isProfileDropdownOpen && (
                                        <ul className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50">
                                            <li>
                                                <a
                                                    className="block px-4 py-2 text-darkBlue hover:bg-gray-100"
                                                    onClick={() => handleMenuClick("/profil")}
                                                >
                                                    Profil
                                                </a>
                                            </li>
                                            <li>
                                                <button
                                                    className="block w-full text-left px-4 py-2 text-darkBlue hover:bg-gray-100"
                                                    onClick={handleSignOut}
                                                >
                                                    Keluar
                                                </button>
                                            </li>
                                        </ul>
                                    )}
                                </li>
                            </>
                        )}
                        {!hasToken && (
                            <li>
                                <a
                                    className="text-darkBlue text-lg hover:text-blue-500"
                                    onClick={() => handleMenuClick("/login")}
                                >
                                    Login
                                </a>
                            </li>
                        )}
                    </ul>
                </div>
            )}
            {isLoading && (
                <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
                    <div className="loader"></div>
                </div>
            )}
        </header>
    );
};

export default MenuBar;
