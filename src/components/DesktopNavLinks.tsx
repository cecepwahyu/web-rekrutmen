import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
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
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import HomeIcon from './HomeIcon';

function DesktopNavLinks() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hasToken, setHasToken] = useState(typeof window !== 'undefined' && !!localStorage.getItem('token'));
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  const getInitials = (name: string) => {
    if (!name) return '';
    const nameParts = name.split(' ');
    if (nameParts.length === 1) {
      return nameParts[0][0]?.toUpperCase() || '';
    }
    const firstInitial = nameParts[0][0];
    const lastInitial = nameParts[nameParts.length - 1][0];
    return (firstInitial + lastInitial).toUpperCase();
  };

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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem('name');
      if (storedName) {
        setName(storedName);
      }

      const fetchProfileData = async () => {
        const token = localStorage.getItem('token');
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/get-id-peserta`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          const result = await response.json();
          if (result.responseCode === '000') {
            const idPeserta = result.data.idPeserta;
            const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/peserta-info/${idPeserta}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            });
            const profileData = await profileResponse.json();
            if (profileData.responseCode === '000') {
              setName(profileData.data.nama);
              setProfilePicture(profileData.data.profilePicture || '');
              localStorage.setItem('name', profileData.data.nama);
            }
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchProfileData();
    }
  }, []);

  const handleProfileDropdownToggle = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleSignOut = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }, 500);
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const handleLinkClick = (href: string) => {
    setLoading(true);
    setTimeout(() => {
      window.location.href = href;
    }, 500);
  };

  const handleProfileClick = (href: string) => {
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
                <Avatar className={`w-8 h-8 mr-2 border-2 ${isScrolled ? 'border-darkBlue' : 'border-white'}`}>
                  {profilePicture ? (
                  <AvatarImage src={profilePicture} alt="User Avatar" />
                  ) : (
                  <AvatarFallback className="text-darkBlue">
                  {getInitials(name) || '-'}
                  </AvatarFallback>
                  )}
                </Avatar>
                <div className="mr-4">
                  <div className="font-semibold">{name || '-'}</div>
                </div>
                <FontAwesomeIcon
                    icon={faAngleDown}
                    className={`transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                  />
                </div>
              </button>
              {isProfileDropdownOpen && (
              <ul className="absolute mt-2 w-48 bg-white shadow-lg rounded-md z-50">
                <li>
                  <button
                    className="block w-full text-left px-4 py-2 text-darkBlue hover:bg-gray-100 hover:rounded-md flex items-center"
                    onClick={() => handleProfileClick('/profil')}
                  >
                    <FontAwesomeIcon icon={faUserCircle} className="mr-2" />
                    Profil
                  </button>
                </li>
                <li>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        className="block w-full text-left px-4 py-2 text-darkBlue hover:bg-gray-100 hover:rounded-md flex items-center"
                      >
                        <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                        Keluar
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you sure you want to log out?</DialogTitle>
                        <DialogDescription>
                          This action will log you out of your account.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <button
                          className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors duration-200"
                          onClick={() => setShowLogoutConfirm(false)}
                        >
                          Batal
                        </button>
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200"
                          onClick={handleSignOut}
                        >
                          Keluar
                        </button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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
