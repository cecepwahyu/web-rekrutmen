"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import MenuBar from "../../../components/MenuBar";
import FooterCopyright from "../../components/FooterCopyright";
import FooterSection from "../../components/FooterSection";
import { ScrollToTopButton } from "../../components/ScrollToTopButton";
import CariKarirButton from "../../components/CariKarirButton";
import LottieAnimation from "../../components/Animations";
import loadingAnimation from '../../../public/animations/loading.json';
import animation404 from '../../../public/animations/404.json';
import { FaUser, FaEnvelope, FaIdCard, FaIdBadge, FaRegCheckSquare, FaMedal, FaCalendar, FaPen, FaMapMarkerAlt, FaPhone, FaGraduationCap, FaHeart, FaBuilding, FaBriefcase, FaBook, FaUsers, FaAddressBook, FaTimes } from 'react-icons/fa';
import Image from 'next/image';
import type { StaticImageData } from 'next/image';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faCheck, faTimes as faTimesIcon, faUser as faUserIcon, faBriefcase as faBriefcaseIcon, faUsers as faUsersIcon, faGraduationCap as faGraduationCapIcon, faAddressBook as faAddressBookIcon, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2'; // Import Swal
import { toast } from 'sonner'; // Import toast from Sonner

const dummyProfilePic: StaticImageData = require('../../../public/images/dummyProfilePic.jpg');

interface ProfileData {
    nama: string;
    email: string;
    noIdentitas: string;
    tempatLahir: string;
    tglLahir: string;
    jnsKelamin: number;
    alamatIdentitas: string;
    desaIdentitas: string;
    kecamatanIdentitas: string;
    kotaIdentitas: string;
    provinsiIdentitas: string;
    alamatDomisili: string;
    desaDomisili: string;
    kecamatanDomisili: string;
    kotaDomisili: string;
    provinsiDomisili: string;
    telp: string;
    pendidikanTerakhir: string;
    statusKawin: string;
    profilePicture?: string;
    tinggi: string;
    berat: string;
    is_final?: boolean;
    isFinal?: boolean;
}

interface PengalamanData {
    namaInstansi: string;
    posisiKerja: string;
    periodeKerja: string;
    deskripsiKerja: string;
    suratPengalamanKerja: string;
}

interface PendidikanData {
    idJenjang: number;
    namaInstitusi: String;
    jurusan: String;
    thnMasuk: String;
    thnLulus: String;
    nilai: String;
    gelar: String;
    achievements: String;
}

interface OrganisasiData {
    namaOrganisasi: String;
    posisiOrganisasi: String;
    periode: String;
    deskripsiKerja: String;
}

interface KontakData {
    namaKontak: String;
    hubKontak: String;
    telpKontak: String;
    emailKontak: String;
    alamatKontak: String;
}

const getIdFromToken = async (token: string): Promise<string | null> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/get-id-peserta`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                Accept: "application/json",
            },
        });

        const data = await response.json();
        if (data.responseCode === "000") {
            return data.data.idPeserta || null;
        } else {
            console.error("Error fetching ID:", data.responseMessage);
            return null;
        }
    } catch (error) {
        console.error("Error fetching ID:", error);
        return null;
    }
};

const updateProfilePicture = async (base64Image: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("No token found in localStorage");
        return;
    }

    const id = await getIdFromToken(token);
    if (!id) {
        console.error("Invalid token");
        return;
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/${id}/update-profile-picture`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                Accept: "application/json",
            },
            body: JSON.stringify({ base64_image: base64Image }),
        });

        const data = await response.json();
        if (data.responseCode === "000") {
            console.log("Profile picture updated successfully");
        } else {
            console.error("Error updating profile picture:", data.responseMessage);
        }
    } catch (error) {
        console.error("Error updating profile picture:", error);
    }
};

const fetchMaxAvatarSize = async (): Promise<number | null> => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("No token found in localStorage");
        return null;
    }

    const id = await getIdFromToken(token);
    if (!id) {
        console.error("Invalid token");
        return null;
    }
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/referensi/value?refGroup1=MAX_AVATAR_SIZE`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          Accept: "application/json",
        },
      });
  
      const data = await response.json();
      if (data.responseCode === "000" && data.data.length > 0) {
        return parseInt(data.data[0].refCode, 10);
      } else {
        console.error("Error fetching max avatar size:", data.responseMessage);
        return null;
      }
    } catch (error) {
      console.error("Error fetching max avatar size:", error);
      return null;
    }
  };

const Profile = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [showScrollToTop, setShowScrollToTop] = useState(false);
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [pengalamanData, setPengalamanData] = useState<PengalamanData[]>([]);
    const [pendidikanData, setPendidikanData] = useState<PendidikanData[]>([]);
    const [organisasiData, setOrganisasiData] = useState<OrganisasiData[]>([]);
    const [kontakData, setKontakData] = useState<KontakData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false); // State for dialog
    const [newProfilePicture, setNewProfilePicture] = useState<string | null>(null); // State for new profile picture
    const [isFinal, setIsFinal] = useState(false); // State for is_final
    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false); // State for AlertDialog
    const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false); // State for Change Password Dialog
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        specialChar: false,
    });
    const [dialogMessage, setDialogMessage] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false); // State for redirecting
    const [isFileErrorDialogOpen, setIsFileErrorDialogOpen] = useState(false); // State for file error dialog
    const [fileErrorMessage, setFileErrorMessage] = useState("");
    const [maxAvatarSize, setMaxAvatarSize] = useState<number | null>(null);

    const showDialog = (message: string) => {
        setDialogMessage(message);
        setDialogOpen(true);
    };

    const router = useRouter(); // Initialize useRouter

    const handleChangeProfilePicture = () => {
        setIsDialogOpen(true); // Open dialog directly
    };

    useEffect(() => {
        const getMaxAvatarSize = async () => {
          const size = await fetchMaxAvatarSize();
          setMaxAvatarSize(size ?? null); // Ensure null is set explicitly
        };
    
        getMaxAvatarSize();
      }, []);

    const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const fileType = file.type;
            const fileSize = file.size / 1024; // Convert size to KB
            if (maxAvatarSize && fileSize > maxAvatarSize) {
                setFileErrorMessage(`Ukuran file maksimal adalah ${maxAvatarSize >= 1024 ? (maxAvatarSize / 1024).toFixed(1) + 'MB' : maxAvatarSize + 'KB'}. Silakan pilih file yang lebih kecil.`);
                setIsFileErrorDialogOpen(true);
                return;
            }
            if (fileType === "image/png" || fileType === "image/jpeg") {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64Image = reader.result as string;
                    setNewProfilePicture(base64Image);
                };
                reader.readAsDataURL(file);
            } else {
                setFileErrorMessage('Silakan pilih file gambar yang valid (PNG atau JPG).');
                setIsFileErrorDialogOpen(true);
            }
        }
    };

    const handleSaveProfilePicture = async () => {
        if (newProfilePicture) {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found in localStorage");
                return;
            }

            const id = await getIdFromToken(token);
            if (!id) {
                console.error("Invalid token");
                return;
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/${id}/update-profile-picture`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                        Accept: "application/json",
                    },
                    body: JSON.stringify({ base64_image: newProfilePicture }),
                });

                const data = await response.json();
                if (data.responseCode === "000") {
                    console.log("Profile picture updated successfully");
                    setProfilePicture(newProfilePicture);
                    router.push("/profil");
                } else {
                    console.error("Error updating profile picture:", data.responseMessage);
                }
            } catch (error) {
                console.error("Error updating profile picture:", error);
            } finally {
                setIsDialogOpen(false); // Close dialog after saving
            }
        }
    };

    const handleFinalisasiDataClick = async () => {
        setIsAlertDialogOpen(true); // Open AlertDialog
    };

    const handleConfirmFinalisasi = async () => {
        const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found in localStorage");
                return;
            }

            const id = await getIdFromToken(token);
            if (!id) {
                console.error("Invalid token");
                return;
            }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/${id}/set-is-final`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            const data = await response.json();
            if (data.responseCode === "000") {
                setIsFinal(true);
                alert("Data berhasil difinalisasi");
            } else {
                console.error("Error finalizing data:", data.responseMessage);
            }
        } catch (error) {
            console.error("Error finalizing data:", error);
        } finally {
            setIsAlertDialogOpen(false); // Close AlertDialog
        }
    };

    const handleChangePassword = () => {
        setIsChangePasswordDialogOpen(true); // Open Change Password Dialog
    };

    const checkPasswordStrength = (password: string) => {
        setPasswordStrength({
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        });
    };

    const isPasswordStrong = () => {
        return Object.values(passwordStrength).every(Boolean);
    };

    const handleSaveNewPassword = async () => {
        if (newPassword !== confirmNewPassword) {
            showDialog("New password and confirm password do not match");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found in localStorage");
            return;
        }

        const id = await getIdFromToken(token);
        if (!id) {
            console.error("Invalid token");
            return;
        }

        if (!profileData?.email) {
            console.error("No email found in profile data");
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/change-password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    email: profileData.email,
                    currentPassword,
                    newPassword,
                    confirmPassword: confirmNewPassword,
                }),
            });

            const data = await response.json();
            if (data.responseCode === "000") {
                toast.success("Password changed successfully", {
                    style: {
                        background: 'white',
                        color: 'green',
                    },
                });
                setIsChangePasswordDialogOpen(false); // Close dialog after saving
            } else {
                showDialog(data.responseMessage || "An error occurred while changing the password.");
            }
        } catch (error) {
            console.error("Error changing password:", error);
            showDialog("An error occurred while changing the password.");
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem("token");

            if (!token) {
                router.push("/login"); // Redirect to login page if no token is found
            } else {
                setIsAuthenticated(true);
            }
        }
    }, [router]);

    useEffect(() => {
        const fetchProfileData = async () => {
            setIsLoading(true);
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("No token found in localStorage");
                setIsLoading(false);
                return;
            }

            const id = await getIdFromToken(token);
            if (!id) {
                console.error("Invalid token");
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json", // Ensure Content-Type is set
                        "Authorization": `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });

                const data = await response.json();
                if (data.responseCode === "000") {
                    setProfileData(data.data);
                    setIsFinal(data.data.isFinal); // Set isFinal state
                    if (data.data.profilePicture) {
                        setProfilePicture(data.data.profilePicture);
                    }
                } else {
                    //console.error("Error fetching data:", data.responseMessage);
                    setProfileData(null); // Set profile data to null if not found
                }
            } catch (error) {
                console.error("Error fetching profile data:", error);
                setProfileData(null); // Set profile data to null if error occurs
            } finally {
                setIsLoading(false);
            }
        };

       if (isAuthenticated) {
             fetchProfileData();
        }
    }, [currentPage, isAuthenticated]);

    useEffect(() => {
        const fetchPengalamanData = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("No token found in localStorage");
                return;
            }

            const id = await getIdFromToken(token);
            if (!id) {
                console.error("Invalid token");
                return;
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/pengalaman/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json", // Ensure Content-Type is set
                        "Authorization": `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });

                const data = await response.json();
                if (data.responseCode === "000" && data.data) {
                    setPengalamanData(data.data);
                } else if (data.responseCode === "404") {
                    console.log("Data not found");
                    setPengalamanData([]); // Set pengalaman data to null if not found
                } else {
                    //console.error("Error fetching data:", data.responseMessage);
                    setPengalamanData([]); // Set pengalaman data to null if not found
                }
            } catch (error) {
                console.error("Error fetching pengalaman data:", error);
                setPengalamanData([]); // Set pengalaman data to null if error occurs
            }
        };

        if (isAuthenticated) {
            fetchPengalamanData();
        }
    }, [currentPage, isAuthenticated]);

    useEffect(() => {
        const fetchPendidikanData = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("No token found in localStorage");
                return;
            }

            const id = await getIdFromToken(token);
            if (!id) {
                console.error("Invalid token");
                return;
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/pendidikan/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json", // Ensure Content-Type is set
                        "Authorization": `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });

                const data = await response.json();
                if (data.responseCode === "000") {
                    setPendidikanData(data.data);
                } else {
                    //console.error("Error fetching data:", data.responseMessage);
                    setPendidikanData([]); // Set pendidikan data to null if not found
                }
            } catch (error) {
                //console.error("Error fetching pendidikan data:", error);
                setPendidikanData([]); // Set pendidikan data to null if error occurs
            }
        };

        if (isAuthenticated) {
            fetchPendidikanData();
        }
    }, [currentPage, isAuthenticated]);

    useEffect(() => {
        const fetchOrganisasiData = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("No token found in localStorage");
                return;
            }

            const id = await getIdFromToken(token);
            if (!id) {
                console.error("Invalid token");
                return;
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/organisasi/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json", // Ensure Content-Type is set
                        "Authorization": `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });

                const data = await response.json();
                if (data.responseCode === "000") {
                    setOrganisasiData(data.data);
                } else {
                    //console.error("Error fetching data:", data.responseMessage);
                    setOrganisasiData([]); // Set organisasi data to null if not found
                }
            } catch (error) {
                console.error("Error fetching organisasi data:", error);
                setOrganisasiData([]); // Set organisasi data to null if error occurs
            }
        };

        if (isAuthenticated) {
            fetchOrganisasiData();
        }
    }, [currentPage, isAuthenticated]);

    useEffect(() => {
        const fetchKontakData = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("No token found in localStorage");
                return;
            }

            const id = await getIdFromToken(token);
            if (!id) {
                console.error("Invalid token");
                return;
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/kontak/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json", // Ensure Content-Type is set
                        "Authorization": `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });

                const kontakDataResponse = await response.json();
                if (kontakDataResponse.responseCode === "000") {
                    setKontakData(kontakDataResponse.data);
                } else {
                    //console.error("Error fetching data:", kontakDataResponse.responseMessage);
                    setKontakData([]); // Set kontak data to null if not found
                }
            } catch (error) {
                console.error("Error fetching kontak data:", error);
                setKontakData([]); // Set kontak data to null if error occurs
            }
        };

        if (isAuthenticated) {
            fetchKontakData();
        }
    }, [currentPage, isAuthenticated]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
            if (window.scrollY > 200) {
                setShowScrollToTop(true);
            } else {
                setShowScrollToTop(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleUpdateDataClick = () => {
        setIsRedirecting(true); // Set redirecting state to true
        router.push('/profil/edit'); // Redirect to edit profile page
    };

    if (!isAuthenticated) {
        return null;
    }

    // if (isRedirecting) {
    //     return (
    //         <div className="flex justify-center items-center min-h-screen">
    //             <p>Loading...</p>
    //         </div>
    //     );
    // }

    return (
        <div className="min-h-screen bg-gray-100 font-sans relative">
            {/* Dialog for previewing new profile picture */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <button style={{ display: 'none' }}></button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ubah Foto Profil</DialogTitle>
                        <DialogDescription>
                            Pilih foto yang akan Anda jadikan foto profil (PNG atau JPG, maksimal {maxAvatarSize ? (maxAvatarSize >= 1024 ? (maxAvatarSize / 1024).toFixed(1) + 'MB' : maxAvatarSize + 'KB') : '...'}).
                        </DialogDescription>
                    </DialogHeader>
                    <input 
                        type="file" 
                        accept="image/png, image/jpeg" // Restrict file types
                        onChange={handleProfilePictureChange} 
                        className="mb-4"
                    />
                    <DialogFooter>
                        <button
                            onClick={handleSaveProfilePicture} // Save profile picture
                            className="bg-darkBlue text-white py-2 px-4 rounded transition duration-300 ease-in-out transform hover:bg-blue-400"
                        >
                            Simpan
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
                <AlertDialogTrigger asChild>
                    <button style={{ display: 'none' }}></button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Finalisasi Data</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin memfinalisasi data? Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setIsAlertDialogOpen(false)}>
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmFinalisasi}>
                            Ya, Finalisasi
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            {/* Dialog for changing password */}
            <Dialog open={isChangePasswordDialogOpen} onOpenChange={setIsChangePasswordDialogOpen}>
                <DialogTrigger asChild>
                    <button style={{ display: 'none' }}></button>
                </DialogTrigger>
                <DialogContent className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-darkBlue">Ubah Password</DialogTitle>
                        <DialogDescription className="text-gray-600">Masukkan kata sandi saat ini dan kata sandi baru Anda untuk mengubah kata sandi Anda.</DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 space-y-4">
                        <div className="relative">
                            <input 
                                type={showCurrentPassword ? "text" : "password"} 
                                placeholder="Password Saat Ini" 
                                value={currentPassword} 
                                onChange={(e) => setCurrentPassword(e.target.value)} 
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                            >
                                <FontAwesomeIcon icon={showCurrentPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="Password Baru" 
                                value={newPassword} 
                                onChange={(e) => {
                                    setNewPassword(e.target.value);
                                    checkPasswordStrength(e.target.value);
                                }} 
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                            >
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>
                        <div className="mt-2 space-y-2 rounded-md bg-blue-50/50 p-3 text-sm">
                            <div className="flex items-center gap-2">
                                {passwordStrength.length ? (
                                    <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                                ) : (
                                    <FontAwesomeIcon icon={faTimesIcon} className="text-red-500" />
                                )}
                                <p>Minimal 8 karakter</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {passwordStrength.uppercase ? (
                                    <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                                ) : (
                                    <FontAwesomeIcon icon={faTimesIcon} className="text-red-500" />
                                )}
                                <p>Minimal 1 huruf kapital</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {passwordStrength.lowercase ? (
                                    <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                                ) : (
                                    <FontAwesomeIcon icon={faTimesIcon} className="text-red-500" />
                                )}
                                <p>Minimal 1 huruf kecil</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {passwordStrength.number ? (
                                    <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                                ) : (
                                    <FontAwesomeIcon icon={faTimesIcon} className="text-red-500" />
                                )}
                                <p>Minimal 1 angka</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {passwordStrength.specialChar ? (
                                    <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                                ) : (
                                    <FontAwesomeIcon icon={faTimesIcon} className="text-red-500" />
                                )}
                                <p>Minimal 1 karakter khusus</p>
                            </div>
                        </div>
                        <div className="relative">
                            <input 
                                type={showConfirmPassword ? "text" : "password"} 
                                placeholder="Konfirmasi Password Baru" 
                                value={confirmNewPassword} 
                                onChange={(e) => setConfirmNewPassword(e.target.value)} 
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                            >
                                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>
                    </div>
                    <DialogFooter className="mt-6 flex justify-end space-x-4">
                        <button
                            onClick={() => setIsChangePasswordDialogOpen(false)}
                            className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:bg-gray-300"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleSaveNewPassword} // Save new password
                            className={`bg-darkBlue text-white py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:bg-blue-400 ${!isPasswordStrong() ? 'cursor-not-allowed opacity-50' : ''}`}
                            disabled={!isPasswordStrong()}
                        >
                            Simpan
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="font-normal">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold">Info</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 flex items-center">
                        {dialogMessage && (
                            <span>{dialogMessage}</span>
                        )}
                    </div>
                    <DialogFooter>
                        <button
                            onClick={() => setDialogOpen(false)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
                        >
                            OK
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={isFileErrorDialogOpen} onOpenChange={setIsFileErrorDialogOpen}>
                <DialogContent className="font-normal">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold">Error</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 flex items-center">
                        {fileErrorMessage && (
                            <span>{fileErrorMessage}</span>
                        )}
                    </div>
                    <DialogFooter>
                        <button
                            onClick={() => setIsFileErrorDialogOpen(false)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
                        >
                            OK
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <MenuBar />
            <main className="pt-28 bg-gradient-to-r from-[#015CAC] to-[#018ED2] relative z-10">
                <div className="bg-white relative z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                        {/* <defs>
                            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" style={{ stopColor: '#015CAC', stopOpacity: 1 }} />
                                <stop offset="100%" style={{ stopColor: '#018ED2', stopOpacity: 1 }} />
                            </linearGradient>
                        </defs> */}
                        {/* <path fill="url(#grad1)"
                            d="M0,0L120,10.7C240,21,480,43,720,48C960,53,1200,43,1320,37.3L1440,32L1440,0L1320,0C1200,0,960,0,720,0C480,0,240,0,120,0L0,0Z">
                        </path> */}
                    </svg>
                </div>

                <div className="flex flex-col justify-center items-center w-full bg-white h-min-[400px] relative z-10 -mt-32">
                    <h1 className="text-darkBlue font-semibold text-3xl mt-4 md:mt-2">Profil Pribadi</h1>
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mt-4 flex justify-between items-center" role="alert">
                        <div>
                            <p className="font-bold">Perhatian</p>
                            <p>Anda diwajibkan untuk melengkapi data diri Anda untuk dapat melamar pekerjaan.</p>
                        </div>
                        <button onClick={() => {
                            const alertBox = document.querySelector('.bg-yellow-100');
                            if (alertBox) {
                                (alertBox as HTMLElement).style.display = 'none';
                            }
                        }} className="text-yellow-700 font-bold ml-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    <br />
                    <p className="font-sans text-base font-normal leading-relaxed text-gray-800 text-center px-6 md:px-32 lg:px-56">
                        Berikut adalah informasi profil:
                    </p>

                    {isLoading ? (
                        <div className="flex justify-center items-center mt-10">
                            <LottieAnimation animationData={loadingAnimation} />
                        </div>
                    ) : profileData ? (
                        <div className="mt-6 w-11/12 lg:w-4/5 flex flex-col space-y-6">
                            <div className="flex flex-col lg:flex-row items-center lg:items-start">
                                {/* Section Profile Picture */}
                                <div className="w-full lg:w-1/4 bg-white shadow-lg flex flex-col justify-center items-center mb-6 lg:mb-0 p-4 rounded-lg relative">
                                    <div className="w-3/4 lg:w/full h-48 bg-gray-300 flex justify-center items-center rounded-lg overflow-hidden relative">
                                        {profilePicture ? (
                                            <Image
                                                src={profilePicture}
                                                alt="Profile Preview"
                                                width={500}
                                                height={500}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-gray-500">3x4 Foto</span>
                                        )}
                                        <button 
                                            onClick={handleChangeProfilePicture} 
                                            className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105 group"
                                        >
                                            <FontAwesomeIcon icon={faPencilAlt} className="text-darkBlue" />
                                        </button>
                                    </div>
                                    <input 
                                        type="file" 
                                        id="profilePictureInput" 
                                        style={{ display: 'none' }} 
                                        onChange={handleProfilePictureChange} 
                                    />
                                    <button 
                                        onClick={handleUpdateDataClick} 
                                        className={`mt-4 w-full py-2 px-6 rounded-lg shadow-lg transition duration-300 transform ${isFinal ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-darkBlue text-white hover:bg-blue-400'}`}
                                        disabled={isFinal}
                                    >
                                        Update Data
                                    </button>
                                    <button 
                                        onClick={handleChangePassword} 
                                        className="mt-4 w-full bg-darkBlue text-white py-2 px-6 rounded-lg transition duration-300 ease-in-out transform hover:bg-blue-400"
                                    >
                                        Ubah Password
                                    </button>
                                </div>

                                {/* Section Profile Data */}
                                <div className="w-full lg:w-3/4 bg-white shadow-lg rounded-lg p-6 lg:ml-6">
                                    <div className="flex items-center mb-4">
                                        <div className="bg-blue-100 p-2 rounded-lg mr-2">
                                            <FontAwesomeIcon icon={faUserIcon} className="text-darkBlue" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-darkBlue">Informasi Personal</h2>
                                    </div>
                                    {profileData.nama && (
                                        <div className="flex items-center mb-2">
                                            <FaUser className="mr-2 text-darkBlue" />
                                            <p><strong>Nama:</strong> {profileData.nama}</p>
                                        </div>
                                    )}
                                    {profileData.email && (
                                        <div className="flex items-center mb-2">
                                            <FaEnvelope className="mr-2 text-darkBlue" />
                                            <p><strong>Email:</strong> {profileData.email}</p>
                                        </div>
                                    )}
                                    {profileData.noIdentitas && (
                                        <div className="flex items-center mb-2">
                                            <FaIdCard className="mr-2 text-darkBlue" />
                                            <p><strong>No Identitas:</strong> {profileData.noIdentitas}</p>
                                        </div>
                                    )}
                                    {profileData.tempatLahir && (
                                        <div className="flex items-center mb-2">
                                            <FaMapMarkerAlt className="mr-2 text-darkBlue" />
                                            <p><strong>Tempat Lahir:</strong> {profileData.tempatLahir}</p>
                                        </div>
                                    )}
                                    {profileData.tglLahir && (
                                        <div className="flex items-center mb-2">
                                            <FaMapMarkerAlt className="mr-2 text-darkBlue" />
                                            <p><strong>Tanggal Lahir:</strong> {new Date(profileData.tglLahir).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                        </div>
                                    )}
                                    {profileData.jnsKelamin && (
                                    //{profileData.jnsKelamin !== undefined && (
                                        <div className="flex items-center mb-2">
                                            <FaUser className="mr-2 text-darkBlue" />
                                            <p><strong>Jenis Kelamin:</strong> {profileData.jnsKelamin === 1 ? 'Laki-laki' : profileData.jnsKelamin === 2 ? 'Perempuan' : 'Tidak Diketahui'}</p>
                                        </div>
                                    )}
                                    {profileData.alamatIdentitas && (
                                        <div className="flex items-center mb-2">
                                            <FaMapMarkerAlt className="mr-2 text-darkBlue" />
                                            <p><strong>Alamat Identitas:</strong> {profileData.alamatIdentitas}, {profileData.desaIdentitas}, {profileData.kecamatanIdentitas}, {profileData.kotaIdentitas}, {profileData.provinsiIdentitas}</p>
                                        </div>
                                    )}
                                    {profileData.alamatDomisili && (
                                        <div className="flex items-center mb-2">
                                            <FaMapMarkerAlt className="mr-2 text-darkBlue" />
                                            <p><strong>Alamat Domisili:</strong> {profileData.alamatDomisili}, {profileData.desaDomisili}, {profileData.kecamatanDomisili}, {profileData.kotaDomisili}, {profileData.provinsiDomisili}</p>
                                        </div>
                                    )}
                                    {profileData.telp && (
                                        <div className="flex items-center mb-2">
                                            <FaPhone className="mr-2 text-darkBlue" />
                                            <p><strong>Telepon:</strong> {profileData.telp}</p>
                                        </div>
                                    )}
                                    {profileData.pendidikanTerakhir && (
                                        <div className="flex items-center mb-2">
                                            <FaGraduationCap className="mr-2 text-darkBlue" />
                                            <p><strong>Pendidikan Terakhir:</strong> {Number(profileData.pendidikanTerakhir) === 4 ? 'S1' : Number(profileData.pendidikanTerakhir) === 5 ? 'S2' : Number(profileData.pendidikanTerakhir) === 6 ? 'S3' : profileData.pendidikanTerakhir}</p>
                                        </div>
                                    )}
                                    {profileData.statusKawin && (
                                        <div className="flex items-center mb-2">
                                            <FaHeart className="mr-2 text-darkBlue" />
                                            <p><strong>Status Kawin:</strong></p>
                                            <p className="ml-2">{profileData.statusKawin === '1' ? 'Lajang' : profileData.statusKawin === '2' ? 'Menikah' : 'Tidak Diketahui'}</p>
                                        </div>
                                    )}
                                    {profileData.tinggi && (
                                        <div className="flex items-center mb-2">
                                            <FaUser className="mr-2 text-darkBlue" />
                                            <p><strong>Tinggi Badan:</strong> {profileData.tinggi} cm</p>
                                        </div>
                                    )}
                                    {profileData.berat && (
                                        <div className="flex items-center mb-2">
                                            <FaUser className="mr-2 text-darkBlue" />
                                            <p><strong>Berat Badan:</strong> {profileData.berat} kg</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
                                {/* Section Pengalaman Kerja */}
                                <div className="w-full lg:w-1/2 bg-white shadow-lg rounded-lg p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="bg-blue-100 p-2 rounded-lg mr-2">
                                            <FontAwesomeIcon icon={faBriefcaseIcon} className="text-darkBlue" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-darkBlue text-center">Pengalaman Kerja</h2>
                                    </div>
                                    {pengalamanData.length > 0 ? (
                                        pengalamanData.map((pengalaman, index) => (
                                            <div key={index} className="mb-4 border-b border-gray-300 pb-4">
                                                <h3 className="text-xl font-semibold mb-2 text-blue-400">Pengalaman Kerja {index + 1}</h3>
                                                <div className="flex items-center mb-2">
                                                    <FaBuilding className="mr-2 text-darkBlue" />
                                                    <p><strong>Nama Instansi:</strong> {pengalaman.namaInstansi || '-'}</p>
                                                </div>
                                                <div className="flex items-center mb-2">
                                                    <FaBriefcase className="mr-2 text-darkBlue" />
                                                    <p><strong>Posisi Kerja:</strong> {pengalaman.posisiKerja || '-'}</p>
                                                </div>
                                                <div className="flex items-center mb-2">
                                                    <FaCalendar className="mr-2 text-darkBlue" />
                                                    <p><strong>Periode Kerja:</strong> {pengalaman.periodeKerja ? `${new Date(pengalaman.periodeKerja.split(' to ')[0]).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })} s/d ${new Date(pengalaman.periodeKerja.split(' to ')[1]).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}` : '-'}</p>
                                                </div>
                                                <div className="flex items-center mb-2">
                                                    <FaPen className="mr-2 text-darkBlue" />
                                                    <p><strong>Deskripsi Kerja:</strong> {pengalaman.deskripsiKerja || '-'}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 text-base sm:text-lg mt-4 mb-20 text-center font-light">
                                            Data pengalaman kerja belum dilengkapi
                                        </p>
                                    )}
                                </div>

                                {/* Section Pengalaman Organisasi */}
                                <div className="w-full lg:w-1/2 bg-white shadow-lg rounded-lg p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="bg-blue-100 p-2 rounded-lg mr-2">
                                            <FontAwesomeIcon icon={faUsersIcon} className="text-darkBlue" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-darkBlue text-center">Pengalaman Organisasi</h2>
                                    </div>
                                    {organisasiData.length > 0 ? (
                                        organisasiData.map((organisasi, index) => (
                                            <div key={index} className="mb-4 border-b border-gray-300 pb-4">
                                                <h3 className="text-xl font-semibold mb-2 text-blue-400">Pengalaman Organisasi {index + 1}</h3>
                                                <div className="flex items-center mb-2">
                                                    <FaUsers className="mr-2 text-darkBlue" />
                                                    <p><strong>Nama Organisasi:</strong> {organisasi.namaOrganisasi || '-'}</p>
                                                </div>
                                                <div className="flex items-center mb-2">
                                                    <FaIdBadge className="mr-2 text-darkBlue" />
                                                    <p><strong>Posisi:</strong> {organisasi.posisiOrganisasi || '-'}</p>
                                                </div>
                                                <div className="flex items-center mb-2">
                                                    <FaCalendar className="mr-2 text-darkBlue" />
                                                    <p><strong>Periode:</strong> {organisasi.periode ? `${new Date(organisasi.periode.split(' to ')[0]).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })} s/d ${new Date(organisasi.periode.split(' to ')[1]).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}` : '-'}</p>
                                                </div>
                                                <div className="flex items-center mb-2">
                                                    <FaPen className="mr-2 text-darkBlue" />
                                                    <p><strong>Deskripsi Kerja:</strong> {organisasi.deskripsiKerja || '-'}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 text-base sm:text-lg mt-4 mb-20 text-center font-light">
                                            Data riwayat organisasi belum dilengkapi
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
                                {/* Section Riwayat Pendidikan */}
                                <div className="w-full lg:w-1/2 bg-white shadow-lg rounded-lg p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="bg-blue-100 p-2 rounded-lg mr-2">
                                            <FontAwesomeIcon icon={faGraduationCapIcon} className="text-darkBlue" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-darkBlue text-center">Riwayat Pendidikan</h2>
                                    </div>
                                    {pendidikanData.length > 0 ? (
                                        pendidikanData.map((pendidikan, index) => (
                                            <div key={index} className="mb-4 border-b border-gray-300 pb-4">
                                                <h3 className="text-xl font-semibold mb-2 text-blue-500 text-blue-500">Pendidikan {index + 1}</h3>
                                                <div className="flex items-center mb-2">
                                                    <FaBook className="mr-2 text-darkBlue" />
                                                    <p><strong>Jenjang Pendidikan:</strong> {Number(pendidikan.idJenjang) === 1 ? 'SD' : Number(pendidikan.idJenjang) === 2 ? 'SMP' : Number(pendidikan.idJenjang) === 3 ? 'SMA' : Number(pendidikan.idJenjang) === 4 ? 'S1' : Number(pendidikan.idJenjang) === 5 ? 'S2' : Number(pendidikan.idJenjang) === 6 ? 'S3' : pendidikan.idJenjang || '-'}</p>
                                                </div>
                                                <div className="flex items-center mb-2">
                                                    <FaBook className="mr-2 text-darkBlue" />
                                                    <p><strong>Nama Instansi:</strong> {pendidikan.namaInstitusi || '-'}</p>
                                                </div>
                                                <div className="flex items-center mb-2">
                                                    <FaUser className="mr-2 text-darkBlue" />
                                                    <p><strong>Jurusan:</strong> {pendidikan.jurusan || '-'}</p>
                                                </div>
                                                <div className="flex items-center mb-2">
                                                    <FaCalendar className="mr-2 text-darkBlue" />
                                                    <p><strong>Periode Pendidikan:</strong> {pendidikan.thnMasuk || '-'} s/d {pendidikan.thnLulus || '-'}</p>
                                                </div>
                                                <div className="flex items-center mb-2">
                                                    <FaRegCheckSquare className="mr-2 text-darkBlue" />
                                                    <p><strong>Nilai:</strong> {pendidikan.nilai || '-'}</p>
                                                </div>
                                                <div className="flex items-center mb-2">
                                                    <FaGraduationCap className="mr-2 text-darkBlue" />
                                                    <p><strong>Gelar:</strong> {pendidikan.gelar || '-'}</p>
                                                </div>
                                                <div className="flex items-center mb-2">
                                                    <FaMedal className="mr-2 text-darkBlue" />
                                                    <p><strong>Penghargaan:</strong> {pendidikan.achievements || '-'}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 text-base sm:text-lg mt-4 mb-20 text-center font-light">
                                            Data riwayat pendidikan belum dilengkapi
                                        </p>
                                    )}
                                </div>

                                {/* Section Kontak Kerabat */}
                                <div className="w-full lg:w-1/2 bg-white shadow-lg rounded-lg p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="bg-blue-100 p-2 rounded-lg mr-2">
                                            <FontAwesomeIcon icon={faAddressBookIcon} className="text-darkBlue" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-darkBlue text-center">Data Keluarga</h2>
                                    </div>
                                    {kontakData.length > 0 ? (
                                        kontakData.map((kontak, index) => (
                                            <div key={index} className="mb-4 border-b border-gray-300 pb-4">
                                                <h3 className="text-xl font-semibold mb-2 text-blue-400">Anggota Keluarga {index + 1}</h3>
                                                <div className="flex items-center mb-2">
                                                    <FaAddressBook className="mr-2 text-darkBlue" />
                                                    <p><strong>Nama:</strong> {kontak.namaKontak}</p>
                                                </div>
                                                <div className="flex items-center mb-2">
                                                    <FaUser className="mr-2 text-darkBlue" />
                                                    <p><strong>Hubungan Keluarga:</strong> {kontak.hubKontak || '-'}</p>
                                                </div>
                                                <div className="flex items-center mb-2">
                                                    <FaPhone className="mr-2 text-darkBlue" />
                                                    <p><strong>No Telepon:</strong> {kontak.telpKontak}</p>
                                                </div>
                                                <div className="flex items-center mb-2">
                                                    <FaEnvelope className="mr-2 text-darkBlue" />
                                                    <p><strong>Email:</strong> {kontak.emailKontak}</p>
                                                </div>
                                                <div className="flex items-center mb-2">
                                                    <FaMapMarkerAlt className="mr-2 text-darkBlue" />
                                                    <p><strong>Alamat:</strong> {kontak.alamatKontak}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 text-base sm:text-lg mt-4 mb-20 text-center font-light">
                                            Data kontak belum dilengkapi
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center mt-10">
                            <div className="w-3/4 sm:w-3/4 lg:w-1/4">
                                <LottieAnimation animationData={animation404} />
                            </div>
                            <p className="text-darkBlue font-bold text-xl sm:text-2xl mt-4 mb-20 text-center">
                                Data profil tidak ditemukan
                            </p>
                        </div>
                    )}

                    <br />
                </div>

                <FooterSection />
                <FooterCopyright />
            </main>

            <ScrollToTopButton />
            <CariKarirButton />
        </div>
    );
};

export default Profile;