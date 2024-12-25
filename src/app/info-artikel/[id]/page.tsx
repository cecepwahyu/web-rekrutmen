"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faTag } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faWhatsapp, faTwitter, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import MenuBar from "../../../../components/MenuBar";
import FooterCopyright from "../../../../components/FooterCopyright";
import FooterSection from "../../../../components/FooterSection";
import { ScrollToTopButton } from "../../../../components/ScrollToTopButton";
import CariKarirButton from "../../../../components/CariKarirButton";
import animation404 from '../../../../public/animations/404.json';
import loadingAnimation from '../../../../public/animations/loading.json';
import LottieAnimation from "../../../../components/Animations";

interface Article {
    judul: string;
    isi: string;
}

const DetailArtikel = () => {
    const params = useParams();
    const slug = params?.id as string; // Get slug from URL
    const [isScrolled, setIsScrolled] = useState(false);
    const [showScrollToTop, setShowScrollToTop] = useState(false);
    const [article, setArticle] = useState<Article | null>(null); // Single article state
    const [isLoading, setIsLoading] = useState(true); // State for loading animation

    useEffect(() => {
        if (!slug) return; // Exit if slug is not available

        const fetchArticle = async () => {
            setIsLoading(true); // Show loading animation
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("No token found in localStorage");
                return; // Exit if no token is found
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/artikel/slug/${slug}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });

                const data = await response.json();
                if (data.responseCode === "000") {
                    setArticle(data.data);
                } else {
                    console.error("Error fetching data:", data.responseMessage);
                }
            } catch (error) {
                console.error("Error fetching article data:", error);
            } finally {
                setIsLoading(false); // Hide loading animation
            }
        };

        fetchArticle();
    }, [slug]); // Fetch article when slug changes

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

    const shareUrl = window.location.href;
    const shareText = article ? article.judul : 'Check out this article!';

    return (
        <div className="min-h-screen bg-gray-100 font-sans relative">
            <MenuBar /> {/* Ensure this is correctly placed */}
            <main className="pt-28 bg-gradient-to-r from-[#015CAC] to-[#018ED2] relative z-10">
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
                    {isLoading ? (
                        <div className="flex justify-center items-center mt-10">
                            <LottieAnimation animationData={loadingAnimation} />
                        </div>
                    ) : !article ? (
                        <div className="flex flex-col items-center mt-10">
                            <div className="w-3/4 sm:w-3/4 lg:w-1/4">
                                <LottieAnimation animationData={animation404} />
                            </div>
                            <p className="text-darkBlue font-bold text-xl sm:text-2xl mt-4 mb-20 text-center">
                                Artikel tidak ditemukan
                            </p>
                        </div>
                    ) : (
                        <div className="w-11/12 lg:w-4/5 mt-6 mb-10">
                            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                                <div className="relative w-full h-48">
                                    <Image
                                        src="/images/arcticle1.jpeg"
                                        alt={article.judul}
                                        layout="fill"
                                        objectFit="cover"
                                    />
                                </div>
                                <div className="p-4">
                                    <h1 className="text-darkBlue font-semibold text-3xl mt-8 mb-4 md:mt-6 md:mb-6 text-center">
                                        {article.judul}
                                    </h1>
                                    <div className="flex justify-center space-x-4 mt-4 text-gray-500">
                                        <div className="flex items-center text-sm md:text-base">
                                            <FontAwesomeIcon icon={faTag} className="mr-2" />
                                            <span>Keuangan</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-center mt-4 space-x-2">
                                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="text-blue-500" title="Share on Facebook">
                                            <FontAwesomeIcon icon={faFacebookF} />
                                        </a>
                                        <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`} target="_blank" rel="noopener noreferrer" className="text-green-500" title="Share on WhatsApp">
                                            <FontAwesomeIcon icon={faWhatsapp} />
                                        </a>
                                        <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="text-blue-400" title="Share on Twitter">
                                            <FontAwesomeIcon icon={faTwitter} />
                                        </a>
                                        <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer" className="text-blue-700" title="Share on LinkedIn">
                                            <FontAwesomeIcon icon={faLinkedinIn} />
                                        </a>
                                    </div>
                                    <div className="mt-8">
                                        <p className="text-sm mb-2 text-gray-600">
                                            <span dangerouslySetInnerHTML={{ __html: article.isi }} />
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <FooterSection />
                <FooterCopyright />
            </main>

            <ScrollToTopButton />
            <CariKarirButton />
        </div>
    );
};

export default DetailArtikel;
