"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faUsers, faSearch } from "@fortawesome/free-solid-svg-icons";
import MenuBar from "../../../components/MenuBar";
import FooterCopyright from "../../components/FooterCopyright";
import FooterSection from "../../components/FooterSection";
import { ScrollToTopButton } from "../../components/ScrollToTopButton";
import CariKarirButton from "../../components/CariKarirButton";
import LottieAnimation from "../../components/Animations";
import animation404 from "../../../public/animations/404.json";
import loadingAnimation from "../../../public/animations/loading.json";
import htmlReactParser from 'html-react-parser';
import Head from "next/head";

const ITEMS_PER_PAGE = 6; // Items per page

interface History {
    idAplikasi: string;
    idPeserta: number;
    namaPeserta: string;
    emailPeserta: string;
    noIdentitasPeserta: string;
    idLowongan: number;
    judulLowongan: string;
    posisiLowongan: string;
    lowonganPeriodeAwal: string;
    lowonganPeriodeAkhir: string;
    tanggalAplikasi: string;
    statusAplikasi: string;
    lastStatusUpdate: string;
    tahunAplikasi: number;
    slug: string;
    status: string;
    isRekrutmen: string;
}

const getIdFromToken = async (token: string): Promise<string | null> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/get-id-peserta`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
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

const Riwayat = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [showScrollToTop, setShowScrollToTop] = useState(false);
    const [histories, setHistories] = useState<History[]>([]); // State for fetched histories
    const [filteredHistories, setFilteredHistories] = useState<History[]>([]); // State for filtered histories
    const [rekrutmenJobs, setRekrutmenJobs] = useState<History[]>([]); // State for Rekrutmen jobs
    const [jobDescJobs, setJobDescJobs] = useState<History[]>([]); // State for Job Desc jobs
    const [currentPage, setCurrentPage] = useState(0); // Current page starts at 0
    const [totalPages, setTotalPages] = useState(0); // Total pages
    const [activeTab, setActiveTab] = useState("Rekrutmen"); // Set default tab to "Rekrutmen"
    const [isLoading, setIsLoading] = useState(true); // State for loading animation
    const [isAuthenticated, setIsAuthenticated] = useState(false); // State for authentication check
    const [searchTerm, setSearchTerm] = useState(""); // State for search term
    const [idPeserta, setIdPeserta] = useState<string | null>(null);
    const router = useRouter();

    // Check if user is authenticated when the page loads
    useEffect(() => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");

            if (!token) {
                router.push("/login");
            } else {
                setIsAuthenticated(true);
                // Fetch idPeserta
                const fetchIdPeserta = async () => {
                    const id = await getIdFromToken(token);
                    setIdPeserta(id);
                };
                fetchIdPeserta();
            }
        }
    }, [router]);

    // Fetch history data from API
    useEffect(() => {
        const fetchHistories = async () => {
            setIsLoading(true); // Show loading animation
            if (typeof window !== "undefined") {
                const token = localStorage.getItem("token"); // Get token from localStorage

                if (!token) {
                    console.error("No token found in localStorage");
                    return; // Exit if no token is found
                }

                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/history/filter?isRekrutmen=true&idPeserta=${idPeserta}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                            Accept: "application/json",
                        },
                    });
                    const data = await response.json();
                    if (data.responseCode === "000") {
                        const allHistories: History[] = data.data; // Assume data.data is an array
                        setHistories(allHistories); // Update histories with fetched data
                        setFilteredHistories(allHistories); // Update filtered histories with fetched data
                        setRekrutmenJobs(allHistories.filter(history => history.status === "1" && history.isRekrutmen)); // Filter for "Aktif" tab
                        setJobDescJobs(allHistories.filter(history => history.status !== "1" && history.isRekrutmen)); // Filter for "Tidak Aktif" tab
                    }
                } catch (error) {
                    console.error("Error fetching history data:", error);
                } finally {
                    setIsLoading(false); // Hide loading animation
                }
            }
        };

        if (isAuthenticated && idPeserta) {
            fetchHistories();
        }
    }, [isAuthenticated, idPeserta]); // Re-fetch histories when isAuthenticated or idPeserta changes

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
            setShowScrollToTop(window.scrollY > 200);
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        const filtered = Array.isArray(histories) ? histories.filter(history =>
            history.judulLowongan.toLowerCase().includes(searchTerm.toLowerCase())
        ) : [];

        if (activeTab === "Rekrutmen") {
            setFilteredHistories(filtered.filter(history => history.status === "1" && history.isRekrutmen));
        } else if (activeTab === "Job Desc") {
            setFilteredHistories(filtered.filter(history => history.status !== "1" && history.isRekrutmen));
        }
    }, [searchTerm, histories, activeTab]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const goToNextPage = () => {
        if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
    };

    const goToPreviousPage = () => {
        if (currentPage > 0) setCurrentPage(currentPage - 1);
    };

    const handleJobClick = (idAplikasi: string) => {
        router.push(`/riwayat/${idAplikasi}`);
    };

    if (!isAuthenticated) {
        return null; // Render nothing until authentication check is complete
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="min-h-screen bg-gray-100 font-sans relative">
                <Head>
                    <title>Karir | Rekrutmen BPD DIY</title>
                </Head>
                <MenuBar />

                <main className="pt-32 bg-gradient-to-r from-[#015CAC] to-[#018ED2] relative z-10 h-80">
                    
                    {/* Adjusted height for blue and white areas */}
                    <div className="bg-white relative z-10 h-32"></div>

                    {/* Section List Pekerjaan */}
                    <div className="flex flex-col justify-center items-center w-full bg-white h-min-[400px] relative z-10 -mt-32 pt-20">
                        <h1 className="text-darkBlue font-semibold text-3xl mt-4 md:mt-2">Riwayat Lamaran Anda</h1>
                        <p className="text-center text-gray-700 mt-4 px-6">
                            Berikut adalah daftar lamaran yang pernah Anda ajukan. Silakan klik untuk melihat detail lamaran:
                        </p>

                        {/* Search Bar */}
                        <div className="flex justify-center mb-4 mt-6 w-full px-4">
                            <div className="relative w-full max-w-md">
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Cari Lamaran..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <FontAwesomeIcon icon={faSearch} className="absolute right-3 top-3 text-gray-400" />
                            </div>
                        </div>

                        {/* Tab Buttons */}
                        <div className="flex justify-center mb-4 mt-6">
                            <button
                                className={`px-4 py-2 mx-2 transition-all duration-300 rounded-lg ${activeTab === "Rekrutmen" ? "bg-darkBlue text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                                onClick={() => setActiveTab("Rekrutmen")}
                            >
                                Aktif
                            </button>
                            <button
                                className={`px-4 py-2 mx-2 transition-all duration-300 rounded-lg ${activeTab === "Job Desc" ? "bg-darkBlue text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                                onClick={() => setActiveTab("Job Desc")}
                            >
                                Tidak Aktif
                            </button>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center items-center mt-10">
                                <LottieAnimation animationData={loadingAnimation} />
                            </div>
                        ) : activeTab === "Rekrutmen" ? (
                            Array.isArray(filteredHistories) && filteredHistories.length === 0 ? (
                                <div className="flex flex-col items-center mt-10">
                                    <div className="w-3/4 sm:w-3/4 lg:w-1/4">
                                        <LottieAnimation animationData={animation404} />
                                    </div>
                                    <p className="text-darkBlue font-bold text-xl sm:text-2xl mt-4 mb-20 text-center">
                                        Tidak ada lamaran
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 gap-8 mt-6 w-11/12 lg:w-3/5 pb-10">
                                        {Array.isArray(filteredHistories) && filteredHistories.map((history: History) => (
                                            <button
                                                key={history.idAplikasi}
                                                className="bg-white shadow-lg rounded-lg p-6 flex flex-col sm:flex-row items-start sm:items-center transform hover:scale-105 transition duration-500 ease-in-out hover:shadow-xl"
                                                onClick={() => handleJobClick(history.idAplikasi)}
                                            >
                                                <div className="w-full text-left">
                                                    <h2 className="text-xl font-bold mb-2 text-darkBlue">
                                                        {history.judulLowongan}
                                                    </h2>
                                                    <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs text-gray-500 space-y-2 sm:space-y-0 sm:space-x-4 mt-2">
                                                        <div className="flex flex-col sm:flex-row items-start sm:items-center">
                                                            <span className="font-semibold">ID Peserta:</span>
                                                            <span className="ml-1">{history.idAplikasi}</span>
                                                        </div>
                                                        <div className="flex flex-col sm:flex-row items-start sm:items-center">
                                                            <span className="font-semibold">Tanggal Melamar:</span>
                                                            <span className="ml-1">
                                                                {new Date(history.tanggalAplikasi).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                                                            </span>
                                                        </div>
                                                        {/* <div className="flex flex-col sm:flex-row items-start sm:items-center">
                                                            <span className="font-semibold">Update Terakhir:</span>
                                                            <span className="ml-1">
                                                                {new Date(history.lastStatusUpdate).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                                                            </span>
                                                        </div> */}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Pagination Buttons */}
                                    <div className="flex justify-center mt-6 space-x-2 mb-8">
                                        {Array.from({ length: totalPages }).map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentPage(index)}
                                                className={`w-8 h-8 flex items-center justify-center rounded-full ${
                                                    index === currentPage
                                                        ? "bg-darkBlue text-white"
                                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                                }`}
                                            >
                                                {index + 1}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )
                        ) : (
                            <div className="flex flex-col justify-center items-center w-full bg-white h-min-[400px] relative z-10 pb-10">
                                {Array.isArray(filteredHistories) && filteredHistories.length === 0 ? (
                                    <div className="flex flex-col items-center mt-10">
                                        <div className="w-3/4 sm:w-3/4 lg:w-1/4">
                                            <LottieAnimation animationData={animation404} />
                                        </div>
                                        <p className="text-darkBlue font-bold text-xl sm:text-2xl mt-4 mb-20 text-center">
                                            Tidak ada lamaran
                                        </p>
                                    </div>
                                ) : (
                                    Array.isArray(filteredHistories) && filteredHistories.map((history: History) => (
                                        <div key={history.idAplikasi} className="w-full md:w-2/3 lg:w-1/2 mt-6 px-4">
                                            <button
                                                className="w-full bg-white shadow-lg rounded-lg p-6 flex flex-col sm:flex-row items-start sm:items-center hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
                                                onClick={() => handleJobClick(history.idAplikasi)}
                                            >
                                                <div className="w-full text-left">
                                                    <h2 className="text-xl font-bold mb-2 text-darkBlue">{history.judulLowongan}</h2>
                                                    <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs text-gray-500 space-y-2 sm:space-y-0 sm:space-x-4 mt-2">
                                                        <div className="flex flex-col sm:flex-row items-start sm:items-center">
                                                            <span className="font-semibold">Nomor Pendaftaran:</span>
                                                            <span className="ml-1">{history.idAplikasi}</span>
                                                        </div>
                                                        <div className="flex flex-col sm:flex-row items-start sm:items-center">
                                                            <span className="font-semibold">Update Terakhir:</span>
                                                            <span className="ml-1">
                                                                {new Date(history.lastStatusUpdate).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    {/* Section Footer */}
                    <FooterSection />

                    {/* Footer Copyright */}
                    <FooterCopyright />
                </main>

                {/* Scroll to Top Button */}
                <ScrollToTopButton />

                {/* Search Button */}
                <CariKarirButton />
            </div>
        </Suspense>
    );
};

export default Riwayat;
