"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import LottieAnimation from "../components/Animations";
import animationFgData from '../../public/animations/fg.json';
import animationExperiencedData from '../../public/animations/experienced.json';
import Image from "next/image";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import MenuBar from "../../components/MenuBar";
import { ScrollToTopButton } from "../components/ScrollToTopButton";
import FooterCopyright from "../components/FooterCopyright";
import FooterSection from "../components/FooterSection";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import RandomShapes from '../components/RandomShapes';
import { motion } from 'framer-motion';
import loadingAnimation from '../../public/animations/loading.json'; // Import loading animation

const CariKarirButton = dynamic(() => import('../components/CariKarirButton'), { ssr: false });

import { FaExclamationTriangle } from 'react-icons/fa';

const MessageBanner = () => (
    <div className="bg-white text-black text-center py-2 flex items-center justify-center">
        <FaExclamationTriangle className="mr-2 text-red-500" />
        Tidak ada perantara dan pungutan biaya atau imbalan dalam bentuk apapun berkaitan dengan penerimaan pegawai Bank BPD DIY
    </div>
);

const Home = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [showScrollToTop, setShowScrollToTop] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter(); 

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

    useEffect(() => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");

            if (token) {
                setIsAuthenticated(true);
            }
            setIsLoading(false);
        }
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <LottieAnimation animationData={loadingAnimation} width="200px" height="200px" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 font-sans relative">
            {/* Message Banner */}
            <MessageBanner />
            {/* Section MenuBar */}
            <MenuBar />

            <main className="pt-16 bg-gradient-to-r from-[#015CAC] to-[#018ED2] relative z-10">
                {/* <RandomShapes /> */}

                {/* Section Slider/Carousel */}
                <div className="container w-full mx-auto px-4 py-6 h-auto">
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={30}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        speed={500}
                    >
                        <SwiperSlide>
                            <div className="flex flex-wrap">
                                <div className="w-full md:w-1/2 pl-20 flex items-center justify-center">
                                    <div className="p-8 rounded-lg">
                                        <h1 className="text-4xl font-bold text-white mb-4 hover:scale-105 transition-transform duration-300">Bank BPD DIY membuka peluang!</h1>
                                        <p className="text-white hover:text-yellow-500 transition-colors duration-300">Bagi putra-putri terbaik bangsa untuk bergabung menjadi bagian dari perusahaan yang terus berkembang melalui proses seleksi penerimaan pegawai untuk berbagai posisi.</p>
                                        <br />
                                        <button 
                                            className="px-4 py-2 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-400 transition"
                                            onClick={() => window.location.href = '/karir'}
                                        >
                                            Jelajahi Karir
                                        </button>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2 px-4">
                                    <div className="rounded-lg relative z-0 hover:scale-105 transition-transform duration-300">
                                        <svg className="h-100 w-full rounded-lg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                                            <defs>
                                                <pattern id="img2" x="0" y="0.1" width="1" height="1">
                                                    <image x="0" y="0" width="70%" height="70%" preserveAspectRatio="xMidYMid slice" href="/images/slider3.png" />
                                                </pattern>
                                            </defs>
                                            <rect width="100%" height="100%" fill="url(#img2)" rx="15" ry="15" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="flex flex-wrap">
                                <div className="w-full md:w-1/2 pl-20 flex items-center justify-center">
                                    <div className="p-8 rounded-lg">
                                        <h1 className="text-4xl font-bold text-white mb-4 hover:scale-105 transition-transform duration-300">Karir di BPD DIY</h1>
                                        <p className="text-white hover:text-yellow-500 transition-colors duration-300">Temukan posisi yang sesuai dengan kualifikasi anda dan berkembang bersama Bank BPD DIY.</p>
                                        <br />
                                        <button 
                                            className="px-4 py-2 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-400 transition"
                                            onClick={() => window.location.href = '/karir'}
                                        >
                                            Lihat Lowongan
                                        </button>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2 px-4">
                                    <div className="rounded-lg relative z-0 hover:scale-105 transition-transform duration-300">
                                        <svg className="h-100 w-full rounded-lg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                                            <defs>
                                                <pattern id="img2" x="0" y="0.1" width="1" height="1">
                                                    <image x="0" y="0" width="70%" height="70%" preserveAspectRatio="xMidYMid slice" href="/images/slider3.png" />
                                                </pattern>
                                            </defs>
                                            <rect width="100%" height="100%" fill="url(#img2)" rx="15" ry="15" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                        {/* <SwiperSlide>
                            <div className="flex flex-wrap">
                                <div className="w-full md:w-1/2 pl-20 flex items-center justify-center">
                                    <div className="p-8 rounded-lg">
                                        <h1 className="text-4xl font-bold text-white mb-4 hover:scale-105 transition-transform duration-300">Lowongan Pekerjaan</h1>
                                        <p className="text-white hover:text-yellow-500 transition-colors duration-300">Temukan berbagai lowongan pekerjaan yang tersedia di BPD DIY dan raih kesempatan untuk berkarir di dunia perbankan.</p>
                                        <br />
                                        <button 
                                            className="px-4 py-2 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-400 transition"
                                            onClick={() => window.location.href = '/karir'}
                                        >
                                            Cari Lowongan
                                        </button>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2 px-4">
                                    <div className="rounded-lg relative z-0 hover:scale-105 transition-transform duration-300">
                                        <svg className="h-auto w-full" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                                            <defs>
                                                <pattern id="img3" x="0" y="0" width="1" height="1">
                                                    <image x="0" y="0" width="80%" height="80%" preserveAspectRatio="xMaxYMax slice" href="/images/photo-slider.webp" />
                                                </pattern>
                                            </defs>
                                            <path fill="url(#img3)" d="M20,-30C30,-20,40,-10,50,0C60,10,70,20,60,30C50,40,40,50,30,60C20,70,10,80,0,70C-10,60,-20,50,-30,40C-40,30,-50,20,-60,10C-70,0,-80,-10,-70,-20C-60,-30,-50,-40,-40,-50C-30,-60,-20,-70,-10,-60C0,-50,10,-40,20,-30Z" transform="translate(100 100)" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide> */}
                    </Swiper>
                </div>

                {/* Section Shape */}
                <div className="bg-white relative z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                        <defs>
                            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" style={{ stopColor: '#015CAC', stopOpacity: 1 }} />
                                <stop offset="100%" style={{ stopColor: '#018ED2', stopOpacity: 1 }} />
                            </linearGradient>
                        </defs>
                        <path fill="url(#grad1)" d="M0,32L120,26.7C240,21,480,11,720,10.7C960,11,1200,21,1320,26.7L1440,32L1440,0L1320,0C1200,0,960,0,720,0C480,0,240,0,120,0L0,0Z"></path>
                    </svg>
                </div>

                <div className="flex flex-col md:flex-row w-full h-auto bg-white relative z-10">
                    {/* Left Section */}
                    <div className="w-full md:w-1/2 px-4 pb-8 bg-white text-black relative">
                        <div className="absolute inset-0 z-0">
                            <svg width="100%" height="100%">
                                <circle cx="85%" cy="45%" r="100" fill="rgba(253, 230, 138, 0.6)" />
                                <polygon points="85,30 105,120 75,180" fill="rgba(253, 230, 138, 0.6)" />
                            </svg>
                        </div>
                        <div className="relative z-10 w-full flex justify-center">
                            <Image
                                src="/images/kantorbpd.jpg"
                                alt="Kantor BPD"
                                width={800}
                                height={600}
                                className="w-80 h-auto rounded-lg object-contain"
                                loading="lazy"
                            />
                            <Image
                                src="/images/kantorbpd2.jpg"
                                alt="Kantor BPD 2"
                                width={800}
                                height={600}
                                className="w-40 h-40 rounded-lg object-contain absolute -top-20 right-0 md:static md:mt-4"
                                loading="lazy"
                            />
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="w-full md:w-1/2 px-4 pb-8 bg-white text-black">
                        <span className="text-darkBlue font-semibold text-3xl text-center md:text-left">Tentang BPD DIY</span>
                        <br />
                        <br />
                        <p className="font-sans text-base leading-relaxed text-gray-800 text-left md:pr-8">
                            BPD DIY selalu mengusahakan agar karyawan dapat bekerja sesuai dengan potensi dan kemampuan mereka serta
                            mempelajari hal-hal baru setiap harinya. Kami percaya jika hal itu dibudayakan di dalam lingkungan BPD DIY,
                            akan membangun semangat untuk terus berinovasi.
                        </p>
                    </div>
                </div>

                {/* Section Intermezzo */}
                <div className="flex flex-col justify-center items-center w-full bg-white h-auto py-6 relative z-10">
                    <h1 className="text-darkBlue font-semibold text-3xl text-center px-4 md:px-0">
                        Mari Berkembang Bersama Kami
                    </h1>
                    <p className="font-sans text-base font-normal leading-relaxed text-gray-800 text-center mt-4 px-6 md:px-32 lg:px-48">
                        BPD DIY selalu mengusahakan agar karyawan dapat bekerja sesuai dengan potensi dan kemampuan mereka serta
                        mempelajari hal-hal baru setiap harinya. Kami percaya jika hal itu dibudayakan di dalam lingkungan BPD DIY,
                        akan membangun semangat untuk terus berinovasi.
                    </p>
                </div>

                {/* Section Fresh Graduate */}
                <div className="flex flex-col md:flex-row relative z-10 bg-white">
                    {/* Left Section */}
                    <div className="w-full md:w-1/2 px-4 pt-8 bg-white text-black order-2 md:order-1 flex flex-col justify-center">
                        <span className="text-blue-400 font-semibold text-3xl md:ml-60 text-center md:text-left">
                            Fresh Graduate
                        </span>
                        <p className="mt-4 font-sans text-base font-normal leading-relaxed text-gray-800 text-center md:text-left md:ml-60">
                            Untuk kamu yang baru memulai karir, Fresh Graduate memiliki 2 kriteria, yaitu Program dan Staf.
                        </p>
                        <button 
                            className="mt-6 font-semibold hover:underline text-darkBlue text-center md:text-left md:ml-60"
                            onClick={() => window.location.href = '/karir'}
                        >
                            Daftar &gt;
                        </button>
                    </div>

                    {/* Right Section */}
                    <div className="w-full md:w-1/2 px-4 pt-8 bg-white flex justify-center md:justify-end items-center md:mr-60 order-1 md:order-2">
                        <div className="w-[80%] h-auto md:w-[60%] md:h-auto">
                            <LottieAnimation animationData={animationFgData} width="100%" height="100%" />
                        </div>
                    </div>
                </div>

                {/* Section Experienced */}
                <div className="flex flex-col md:flex-row relative z-10 bg-white">
                    {/* Left Section */}
                    <div className="w-full md:w-1/2 px-4 pt-8 bg-white flex justify-center md:justify-end items-center md:mr-60 order-1">
                        <div className="w-[80%] h-auto md:w-[80%] md:h-auto">
                            <LottieAnimation animationData={animationExperiencedData} width="100%" height="100%" />
                        </div>
                    </div>
                    {/* Right Section */}
                    <div className="w-full md:w-1/2 px-4 pt-8 bg-white text-black order-2 flex flex-col justify-center">
                        <span className="text-blue-400 font-semibold text-3xl md:mr-60 text-center md:text-left">
                            Experienced
                        </span>
                        <p className="mt-4 font-sans text-base font-normal leading-relaxed text-gray-800 text-center md:text-left md:mr-60">
                        Untuk kamu yang sudah memiliki pengalaman di bidang tertentu dan ingin mengembangkan diri lebih lagi.
                        </p>
                        <button 
                            className="mt-6 font-semibold hover:underline text-darkBlue text-center md:text-left md:mr-60"
                            onClick={() => window.location.href = '/karir'}
                        >
                            Daftar &gt;
                        </button>
                    </div>
                </div>

                {/* Section FAQ's */}
                <div className="flex flex-col justify-center items-center w-full bg-white h-auto relative z-10 pb-12 pt-8">
                    <h1 className="text-darkBlue font-semibold text-3xl mt-30 text-center">Sekilas BPD DIY</h1>
                    <br />
                    <div className="w-full flex justify-center px-4 md:px-0">
                        <div className="relative w-full max-w-4xl overflow-hidden rounded-lg shadow-lg" style={{ paddingBottom: '40%' }}>
                            <iframe className="absolute top-0 left-0 w-full h-full" width="100%" height="100%" src="https://www.youtube.com/embed/_NpIstIZZb0?si=qlxepqU7xiv7mfoS" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                        </div>
                    </div>
                </div>

                {/* Section FAQ's */}
                <div className="flex flex-col justify-center items-center w-full bg-white h-auto relative z-10 pb-12 pt-8">
                    <h1 className="text-darkBlue font-semibold text-3xl mt-30 text-center">Frequently Asked Questions</h1>
                    <br />
                    {/* <p style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '1rem', fontWeight: 400, lineHeight: 1.8, color: '#222', textAlign: 'center', marginLeft: '14rem', marginRight: '14rem' }}>
                        BPD DIY selalu mengusahakan agar karyawan dapat bekerja sesuai dengan potensi dan kemampuan mereka serta mempelajari hal-hal baru setiap harinya. Kami percaya jika hal itu dibudayakan di dalam lingkungan BPD DIY, akan membangun semangat untuk terus berinovasi.
                    </p> */}
                    <Accordion type="single" collapsible className="w-3/4 mx-auto">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="w-full font-bold text-darkBlue text-xl">Apa saja posisi yang biasanya tersedia di BPD DIY?</AccordionTrigger>
                                <AccordionContent className="w-full">
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                                Bank BPD DIY sering membuka lowongan untuk posisi seperti:
                                <ul className="list-disc pl-6">
                                    <li>Teller</li>
                                    <li>Customer Service</li>
                                    <li>Account Officer</li>
                                    <li>Analis Kredit</li>
                                    <li>IT Support</li>
                                    <li>Auditor Internal</li>
                                    <li>Staf Keuangan dan Administrasi</li>
                                </ul>
                                </motion.div>
                                </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger className="w-full font-bold text-darkBlue text-xl">Apa saja persyaratan umum untuk melamar di BPD DIY?</AccordionTrigger>
                            <AccordionContent className="w-full">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                            Persyaratan umum biasanya mencakup:
                            <ul className="list-disc pl-6">
                                <li>Warga Negara Indonesia (WNI).</li>
                                <li>Usia maksimal 25–30 tahun (tergantung posisi).</li>
                                <li>Pendidikan minimal D3/S1 dari jurusan yang relevan seperti Ekonomi, Manajemen, Akuntansi, atau IT.</li>
                                <li>IPK minimal 3.00 (skala 4.00).</li>
                                <li>Memiliki kemampuan komunikasi yang baik dan orientasi pada pelayanan.</li>
                            </ul>
                            </motion.div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger className="w-full font-bold text-darkBlue text-xl">Bagaimana cara melamar pekerjaan di BPD DIY?</AccordionTrigger>
                            <AccordionContent className="w-full">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                            Anda dapat melamar pekerjaan melalui langkah berikut:
                            <ul className="list-disc pl-6">
                                <li>Kunjungi website resmi BPD DIY atau portal karier yang bekerja sama dengan bank.</li>
                                <li>Pilih posisi yang sesuai dengan minat dan kualifikasi Anda.</li>
                                <li>Unduh dan lengkapi formulir lamaran.</li>
                                <li>Siapkan dokumen pendukung seperti CV, surat lamaran, ijazah, transkrip nilai, dan pas foto.</li>
                                <li>Kirim lamaran melalui sistem online, email resmi, atau secara langsung ke kantor pusat BPD DIY jika diinstruksikan.</li>
                            </ul>
                            </motion.div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4">
                            <AccordionTrigger className="w-full font-bold text-darkBlue text-xl">Apa tahapan seleksi yang harus dilalui?</AccordionTrigger>
                            <AccordionContent className="w-full">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                            Tahapan seleksi biasanya meliputi:
                            <ul className="list-disc pl-6">
                                <li>Seleksi administrasi berkas lamaran.</li>
                                <li>Seleksi psikotes dan wawancara.</li>
                                <li>Seleksi kesehatan dan keamanan.</li>
                                <li>Seleksi kompetensi dan keterampilan.</li>
                                <li>Penempatan kerja dan orientasi.</li>
                            </ul>
                            </motion.div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-5">
                            <AccordionTrigger className="w-full font-bold text-darkBlue text-xl">Apakah fresh graduate dapat melamar di BPD DIY?</AccordionTrigger>
                            <AccordionContent className="w-full">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                            Ya, BPD DIY biasanya membuka kesempatan bagi fresh graduate melalui program Officer Development Program (ODP) atau posisi entry-level lainnya. Program ini dirancang untuk melatih calon pegawai baru agar siap berkarier di dunia perbankan.
                            </motion.div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-6">
                            <AccordionTrigger className="w-full font-bold text-darkBlue text-xl">Apakah ada kontrak kerja setelah diterima?</AccordionTrigger>
                            <AccordionContent className="w-full">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                            Setelah diterima, pegawai biasanya akan menjalani masa percobaan (probation) selama 3–6 bulan. Setelah masa probation selesai, pegawai akan dikontrak atau diangkat menjadi pegawai tetap, tergantung pada penilaian kinerja selama masa percobaan.
                            </motion.div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
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

export default Home;
