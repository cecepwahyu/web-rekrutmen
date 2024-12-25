import Link from 'next/link';
import { useState, useEffect, useRef, RefObject } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faSignOutAlt, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
  } from "@/components/ui/navigation-menu"
import HomeIcon from '../src/components/HomeIcon';

function DesktopNavLinks() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

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
    const token = localStorage.getItem('token');
    setHasToken(!!token);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProfileDropdownToggle = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleLinkClick = (href: string) => {
    setLoading(true);
    setTimeout(() => {
      window.location.href = href;
    }, 500);
  };

  const linkStyle = isScrolled
    ? 'text-darkBlue hover:underline'
    : 'text-white hover:underline hover:text-white';

  return (
    <NavigationMenu>
      <NavigationMenuList className="flex pr-24 space-x-4">
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink
              className={`flex items-center font-semibold py-2 px-2 custom-underline ${linkStyle}`}
              onClick={() => handleLinkClick('/')}
            >
              <HomeIcon fill={isScrolled ? 'darkblue' : 'white'} />
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/karir" legacyBehavior passHref>
            <NavigationMenuLink
              className={`font-semibold py-2 px-2 custom-underline ${linkStyle}`}
              onClick={() => handleLinkClick('/karir')}
            >
              Karir
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/info-artikel" legacyBehavior passHref>
            <NavigationMenuLink
              className={`font-semibold py-2 px-2 custom-underline ${linkStyle}`}
              onClick={() => handleLinkClick('/info-artikel')}
            >
              Info & Artikel
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        {hasToken ? (
          <>
            <NavigationMenuItem>
              <Link href="/riwayat" legacyBehavior passHref>
                <NavigationMenuLink
                  className={`font-semibold py-2 px-2 custom-underline ${linkStyle}`}
                  onClick={() => handleLinkClick('/riwayat')}
                >
                  Riwayat
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/pengumuman" legacyBehavior passHref>
                <NavigationMenuLink
                  className={`font-semibold py-2 px-2 custom-underline ${linkStyle}`}
                  onClick={() => handleLinkClick('/pengumuman')}
                >
                  Pengumuman
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem ref={dropdownRef}>
              <button
              className={`font-semibold py-2 px-2 ${linkStyle}`}
              onClick={handleProfileDropdownToggle}
              >
                <div className="flex items-center text-right">
                <Avatar className="w-8 h-8 mr-2">
                  <AvatarImage src="/path-to-avatar-image.jpg" alt="User Avatar" />
                  <AvatarFallback className="text-darkBlue">AU</AvatarFallback>
                </Avatar>
                <div className="mr-4 ml-2">
                  <div className="font-semibold">John Doe</div>
                </div>
                <FontAwesomeIcon
                    icon={isProfileDropdownOpen ? faAngleUp : faAngleDown}
                    className={`ml-2 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                  />
                </div>
              </button>
              {isProfileDropdownOpen && (
              <ul className="absolute mt-2 w-48 bg-white shadow-lg rounded-md z-50">
                <li>
                  <Link href="/profil" legacyBehavior passHref>
                    <a className="block px-4 py-2 text-darkBlue hover:bg-gray-100 hover:rounded-md flex items-center">
                      <FontAwesomeIcon icon={faUserCircle} className='mr-2'/>
                      <span className="ml-2">Profil</span>
                    </a>
                  </Link>
                </li>
                <li>
                  <button
                    className="block w-full text-left px-4 py-2 text-darkBlue hover:bg-gray-100 hover:rounded-md flex items-center"
                    onClick={handleSignOut}
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className='mr-2'/>
                    <span className="ml-2">Keluar</span>
                  </button>
                </li>
              </ul>
              )}
            </NavigationMenuItem>
          </>
        ) : (
          <NavigationMenuItem>
            <Link href="/login" legacyBehavior passHref>
              <NavigationMenuLink
                className={`font-semibold py-2 px-2 custom-underline ${linkStyle}`}
                onClick={() => handleLinkClick('/login')}
              >
                Login
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
      {loading && <div className="fixed top-0 left-0 w-full h-1 bg-blue-500 animate-pulse"></div>}
    </NavigationMenu>
  );
}

export default DesktopNavLinks;
