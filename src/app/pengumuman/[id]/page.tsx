"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import MenuBar from "../../../../components/MenuBar";
import FooterCopyright from "../../../../components/FooterCopyright";
import FooterSection from "../../../../components/FooterSection";
import { ScrollToTopButton } from "../../../../components/ScrollToTopButton";
import CariKarirButton from "../../../../components/CariKarirButton";
import LottieAnimation from "../../../../components/Animations";
import loadingAnimation from '../../../../public/animations/loading.json';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton, WhatsappShareButton, FacebookIcon, TwitterIcon, LinkedinIcon, WhatsappIcon } from 'react-share';

const DetailPengumuman = () => {
    //const router = useRouter();
    const params = useParams();
    const id = params?.id as string; // Get slug from URL
    const [announcement, setAnnouncement] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAnnouncement = async () => {
            setIsLoading(true);
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("No token found in localStorage");
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/pengumuman-umum/slug/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });

                const data = await response.json();
                if (data.responseCode === "000") {
                    setAnnouncement(data.data);
                } else {
                    console.error("Error fetching data:", data.responseMessage);
                }
            } catch (error) {
                console.error("Error fetching announcement data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchAnnouncement();
        }
    }, [id]);

    return (
        <div className="min-h-screen bg-gray-100 font-sans relative">
            <MenuBar />
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

                <div className="flex flex-col justify-center items-center w-full bg-white h-min-[400px] relative z-10 -mt-32 pb-10">
                    {isLoading ? (
                        <div className="flex justify-center items-center mt-10">
                            <LottieAnimation animationData={loadingAnimation} />
                        </div>
                    ) : announcement ? (
                        <div className="w-11/12 lg:w-4/5 mt-10 p-6 bg-white rounded-lg shadow-lg">
                            <h1 className="text-darkBlue font-semibold text-3xl mt-4 md:mt-2">{announcement.judul}</h1>
                            <p className="text-sm text-gray-600 mt-2">
                                {format(new Date(announcement.createdAt), 'd MMMM yyyy', { locale: localeId })}
                            </p>
                            <div className="mt-6 text-gray-800" dangerouslySetInnerHTML={{ __html: announcement.isi }} />
                            <div className="mt-6 flex items-center space-x-4">
                                <span className="text-gray-600">Share this:</span>
                                <FacebookShareButton url={window.location.href} className="hover:opacity-75 transition-opacity duration-300">
                                    <FacebookIcon size={32} round />
                                </FacebookShareButton>
                                <TwitterShareButton url={window.location.href} title={announcement.judul} className="hover:opacity-75 transition-opacity duration-300">
                                    <TwitterIcon size={32} round />
                                </TwitterShareButton>
                                <LinkedinShareButton url={window.location.href} title={announcement.judul} className="hover:opacity-75 transition-opacity duration-300">
                                    <LinkedinIcon size={32} round />
                                </LinkedinShareButton>
                                <WhatsappShareButton url={window.location.href} title={announcement.judul} className="hover:opacity-75 transition-opacity duration-300">
                                    <WhatsappIcon size={32} round />
                                </WhatsappShareButton>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center mt-10">
                            <p className="text-darkBlue font-bold text-xl sm:text-2xl mt-4 mb-20 text-center">
                                Pengumuman tidak ditemukan
                            </p>
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

export default DetailPengumuman;
