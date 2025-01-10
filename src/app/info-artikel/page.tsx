"use client";

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faTag } from "@fortawesome/free-solid-svg-icons";
import MenuBar from "../../../components/MenuBar";
import FooterCopyright from "../../components/FooterCopyright";
import FooterSection from "../../components/FooterSection";
import { ScrollToTopButton } from "../../components/ScrollToTopButton";
import CariKarirButton from "../../components/CariKarirButton";
import animation404 from '../../../public/animations/404.json';
import loadingAnimation from '../../../public/animations/loading.json';
import LottieAnimation from "../../components/Animations";


const InfoArtikel = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [showScrollToTop, setShowScrollToTop] = useState(false);
    const [articles, setArticles] = useState([]); // Articles state
    const [currentPage, setCurrentPage] = useState(0); // Current page starts at 0
    const [totalPages, setTotalPages] = useState(0); // Total pages
    const [isLoading, setIsLoading] = useState(true); // State for loading animation
    const [isAuthenticated, setIsAuthenticated] = useState(false); // State for authentication  
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem("token");

            if (!token) {
                router.push("/login");
            } else {
                setIsAuthenticated(true);
            }
        }
    }, [router]);

    useEffect(() => {
        const fetchArticle = async () => {
            setIsLoading(true); // Show loading animation

            if (typeof window === "undefined") {
                setIsLoading(false); // Set loading to false if not in the browser
                return; // Exit if not in the browser
            }

            const token = localStorage.getItem("token");

            if (!token) {
                console.error("No token found in localStorage");
                return; // Exit if no token is found
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/artikel/paginated?page=${currentPage}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });

                const data = await response.json();
                if (data.responseCode === "000") {
                    setArticles(data.data.content); // Set the current page's articles
                    setTotalPages(data.data.totalPages); // Set total pages
                } else {
                    console.error("Error fetching data:", data.message);
                }
            } catch (error) {
                console.error("Error fetching article data:", error);
            } finally {
                setIsLoading(false); // Hide loading animation
            }
        };

        if (isAuthenticated) {
            fetchArticle();
        }
    }, [currentPage, isAuthenticated]); // Re-fetch articles when currentPage changes

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

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100 font-sans relative">
            <MenuBar />
            <main className="pt-28 bg-gradient-to-r from-[#015CAC] to-[#018ED2] relative z-10">
                {/* <div className="container w-full mx-auto px-4 py-8 h-auto">
                    <div className="flex flex-wrap">
                        <div className="w-full md:w-1/2 md:pl-20 flex items-center justify-center text-white">
                            <div className="p-8 rounded-lg text-center md:text-left">
                                <h1 className="text-4xl font-bold mb-4">Info & Artikel</h1>
                                <p>Dapatkan informasi dan artikel terbaru dari <br /> <b>Bank BPD DIY</b></p>
                                <br />
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 px-4">
                            <div className="rounded-lg relative z-0">
                                <Image
                                    src="/images/magang.png"
                                    alt="Info & Artikel"
                                    width={800}
                                    height={600}
                                    className="w-[460px] h-auto rounded-lg object-contain pb-10"
                                />
                            </div>
                        </div>
                    </div>
                </div> */}
                <div className="bg-white relative z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                        <defs>
                            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" style={{ stopColor: '#015CAC', stopOpacity: 1 }} />
                                <stop offset="100%" style={{ stopColor: '#018ED2', stopOpacity: 1 }} />
                            </linearGradient>
                        </defs>
                        <path fill="url(#grad1)"
                            d="M0,0L120,10.7C240,21,480,43,720,48C960,53,1200,43,1320,37.3L1440,32L1440,0L1320,0C1200,0,960,0,720,0C480,0,240,0,120,0L0,0Z"></path>
                    </svg>
                </div>

                <div className="flex flex-col justify-center items-center w-full bg-white h-min-[400px] relative z-10 -mt-32">
                    <h1 className="text-darkBlue font-semibold text-3xl mt-4 md:mt-2">Info & Artikel Terbaru</h1>
                    <br />
                    <p className="font-sans text-base font-normal leading-relaxed text-gray-800 text-center px-6 md:px-32 lg:px-56">
                        Berikut adalah informasi dan artikel terbaru dari Bank BPD DIY:
                    </p>

                    {isLoading ? (
                        <div className="flex justify-center items-center mt-10">
                            <LottieAnimation animationData={loadingAnimation} />
                        </div>
                    ) : articles.length === 0 ? (
                        <div className="flex flex-col items-center mt-10">
                            <div className="w-3/4 sm:w-3/4 lg:w-1/4">
                                <LottieAnimation animationData={animation404} />
                            </div>
                            <p className="text-darkBlue font-bold text-xl sm:text-2xl mt-4 mb-20 text-center">
                                Artikel tidak ditemukan
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6 w-11/12 lg:w-4/5">
                            {articles.map((article: any) => (
                                <button 
                                    key={article.id}
                                    className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition duration-500 ease-in-out border-2 border-transparent hover:border-darkBlue"
                                    onClick={() => window.location.href = `/info-artikel/${article.slug}`}
                                >
                                    <div className="relative w-full h-48">
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/artikel/image/${article.gambar}`}
                                            alt={article.judul}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h2 className="text-xl font-bold mb-2 text-darkBlue">
                                            {article.judul.length > 100 ? `${article.judul.substring(0, 100)}...` : article.judul}
                                        </h2>
                                        <p className="text-sm mb-2 text-gray-600">
                                            {article.isi.length > 100 
                                                ? <span dangerouslySetInnerHTML={{ __html: article.isi.substring(0, 150) + '...' }} />
                                                : <span dangerouslySetInnerHTML={{ __html: article.isi }} />
                                            }
                                        </p>
                                        {/* <div className="flex items-center text-sm text-gray-600 space-x-4">
                                            <div className="flex items-center">
                                                <FontAwesomeIcon icon={faTag} className="mr-1" />
                                                <span>Keuangan</span>
                                            </div>
                                        </div> */}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                    
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
                    <br />
                </div>

                {/* Section Footer */}
                <FooterSection />

                {/* Section Copyright */}
                <FooterCopyright />
            </main>

            {/* Button Back to Top */}
            <ScrollToTopButton />

            {/* Button Find Career/Opportunity */}
            <CariKarirButton />
        </div>
    );
};

export default InfoArtikel;
