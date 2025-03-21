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

import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';

const MessageBanner = () => {
    const [visible, setVisible] = useState(true);

    if (!visible) return null;

    return (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-orange-500 bg-opacity-25 text-white text-center py-2 px-4 flex flex-col sm:flex-row items-center justify-between rounded shadow-lg z-50" style={{ backgroundColor: '#F97316', maxWidth: '90%', width: 'auto', fontSize: '0.875rem' }}>
            <div className="flex items-center mb-2 sm:mb-0 text-sm sm:text-base">
                <FaExclamationTriangle className="mr-2" />
                <span>
                    <strong>Tidak ada perantara</strong> dan <strong>pungutan biaya</strong> atau <strong>imbalan</strong> dalam bentuk apapun berkaitan dengan penerimaan pegawai Bank BPD DIY
                </span>
            </div>
            <button onClick={() => setVisible(false)} className="ml-0 sm:ml-4">
                <FaTimes />
            </button>
        </div>
    );
};

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
                    <div className="w-full md:w-1/2 px-4 pb-8 bg-white text-black relative">
                        <div className="absolute inset-0 z-0">
                            <svg width="100%" height="100%">
                                <circle cx="30%" cy="40%" r="120" fill="rgba(59, 130, 246, 0.1)" />
                                <circle cx="70%" cy="70%" r="80" fill="rgba(253, 230, 138, 0.2)" />
                            </svg>
                        </div>
                        <div className="relative z-10">
                            <span className="text-darkBlue font-extrabold text-4xl text-center md:text-left leading-tight tracking-wide">
                                Tentang BPD DIY
                            </span>
                            <div className="w-16 h-1 bg-blue-500 mt-2 mb-4 mx-auto md:mx-0"></div>
                            <p className="font-sans text-lg leading-relaxed text-gray-700 text-left md:pr-8">
                                BPD DIY selalu mengusahakan agar karyawan dapat bekerja sesuai dengan potensi dan kemampuan mereka serta
                                mempelajari hal-hal baru setiap harinya. Kami percaya jika hal itu dibudayakan di dalam lingkungan BPD DIY,
                                akan membangun semangat untuk terus berinovasi.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Section Intermezzo */}
                <div className="flex flex-col justify-center items-center w-full bg-gradient-to-r from-blue-100 to-blue-50 h-auto py-12 relative z-10 shadow-md rounded-lg">
                    <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-blue-100 to-transparent"></div>
                    <h1 className="text-darkBlue font-extrabold text-4xl text-center px-4 md:px-0 leading-tight tracking-wide">
                        Mari Berkembang Bersama Kami
                    </h1>
                    <p className="font-sans text-lg font-light leading-relaxed text-gray-700 text-center mt-6 px-6 md:px-32 lg:px-48">
                        BPD DIY selalu mengusahakan agar karyawan dapat bekerja sesuai dengan potensi dan kemampuan mereka serta
                        mempelajari hal-hal baru setiap harinya. Kami percaya jika hal itu dibudayakan di dalam lingkungan BPD DIY,
                        akan membangun semangat untuk terus berinovasi.
                    </p>
                    <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-blue-100 to-transparent"></div>
                    <div className="absolute top-0 left-0 w-20 h-20 bg-yellow-300 rounded-full opacity-50 blur-xl transform -translate-x-10 -translate-y-10"></div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-300 rounded-full opacity-50 blur-xl transform translate-x-10 translate-y-10"></div>
                </div>

                {/* Section Fresh Graduate */}
                <div className="flex flex-col md:flex-row relative z-10 bg-white">
                    {/* Left Section */}
                    <div className="w-full md:w-1/2 px-4 pt-8 bg-white text-black order-2 md:order-1 flex flex-col justify-center">
                        <span className="text-blue-500 font-extrabold text-4xl md:ml-60 text-center md:text-left leading-tight tracking-wide">
                            Fresh Graduate
                        </span>
                        <p className="mt-4 font-sans text-lg font-light leading-relaxed text-gray-700 text-center md:text-left md:ml-60">
                            Untuk kamu yang baru memulai karir, <span className="font-medium text-blue-400">Fresh Graduate</span> cocok untuk memulai karir Anda, menjadi <span className="font-semibold text-darkBlue">Staf Bank BPD DIY</span>.
                        </p>
                        <button 
                            className="mt-6 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-400 hover:shadow-lg transition-all duration-300 ease-in-out text-center md:text-left md:ml-60"
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
                        <span className="text-blue-500 font-extrabold text-4xl md:mr-60 text-center md:text-left leading-tight tracking-wide">
                            Experienced
                        </span>
                        <p className="mt-4 font-sans text-lg font-light leading-relaxed text-gray-700 text-center md:text-left md:mr-60">
                            Untuk kamu yang sudah memiliki pengalaman di bidang tertentu dan ingin mengembangkan diri lebih lagi.
                        </p>
                        <button 
                            className="mt-6 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-400 hover:shadow-lg transition-all duration-300 ease-in-out text-center md:text-left md:mr-60"
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
                    <Accordion type="single" collapsible className="w-11/12 md:w-3/4 mx-auto mt-6">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="w-full font-bold text-darkBlue text-lg md:text-xl hover:text-blue-500 transition-colors duration-300">
                                Apa saja posisi yang tersedia di BPD DIY?
                            </AccordionTrigger>
                            <AccordionContent className="w-full text-gray-700 text-sm md:text-base leading-relaxed">
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                                    Bank BPD DIY sering membuka lowongan untuk posisi seperti:
                                    <ul className="list-disc pl-6 mt-2">
                                        <li>IT Staff</li>
                                        <li>Account Officer</li>
                                        <li>Marketing Officer</li>
                                        <li>Analis Kredit Mikro</li>
                                        <li>Teller</li>
                                    </ul>
                                </motion.div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger className="w-full font-bold text-darkBlue text-lg md:text-xl hover:text-blue-500 transition-colors duration-300">
                                Apa saja persyaratan umum melamar di Bank BPD DIY?
                            </AccordionTrigger>
                            <AccordionContent className="w-full text-gray-700 text-sm md:text-base leading-relaxed">
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                                    Persyaratan umum mencakup:
                                    <ul className="list-disc pl-6 mt-2">
                                        <li>Warga Negara Indonesia (WNI).</li>
                                        <li>Bertaqwa kepada Tuhan Yang Maha Esa.</li>
                                        <li>Setia dan taat kepada Pancasila, UUD 1945 dan Negara Kesatuan Republik Indonesia.</li>
                                        <li>Tidak menjadi anggota atau pengurus partai politik atau terlibat kegiatan politik praktis dan tidak akan mengikuti kegiatan politik pada saat aktif menjadi pegawai.</li>
                                        <li>Tidak pernah diberhentikan “tidak dengan hormat” sebagai pegawai Instansi Pemerintah maupun swasta.</li>
                                        <li>Tidak memiliki ketergantungan kepada narkoba/bebas narkoba, tidak berjudi dan tidak memiliki ketergantungan segala macam bentuk perjudian.</li>
                                        <li>Sanggup menandatangani pakta integritas.</li>
                                        <li>Tidak mempunyai hubungan keluarga (Ayah, Ibu, Anak, Kakak, Adik, Menantu dan Ipar) dengan pengurus maupun pegawai PT Bank BPD DIY.</li>
                                        <li>Mempunyai reputasi keuangan yang baik (kolektibilitas lancar).</li>
                                        <li>Bersedia ditempatkan di kantor-kantor yang ditetapkan oleh PT Bank BPD DIY.</li>
                                        <li>Surat pernyataan bermaterai Poin A sampai J ditandatangani oleh pelamar.</li>
                                        <li>Berkelakuan baik dan tidak pernah dihukum penjara atau kurungan berdasarkan keputusan pengadilan yang telah mempunyai kekuatan hukum yang tetap karena melakukan suatu tindak pidana kejahatan yang dinyatakan dalam Surat Keterangan Catatan Kepolisian (SKCK)/keterangan sejenisnya sesuai dengan ketentuan yang berlaku.</li>
                                        <li>Berusia serendah-rendahnya 18 (delapan belas) tahun yang dibuktikan dengan Akte/Surat Kelahiran yang dikeluarkan oleh pejabat yang berwenang.</li>
                                        <li>Mempunyai nilai TOEFL minimal 450 (1 tahun terakhir) atau tes sejenis seperti TOEFL IBT minimal 61/PTE minimal 50/ IELTS minimal 6.0.</li>
                                        <li>Mempunyai pendidikan, kecakapan dan keahlian yang diperlukan.</li>
                                        <li>Berbadan sehat yang dinyatakan dengan Surat Keterangan Sehat (terbaru) dari Dokter/Puskesmas/Instansi Kesehatan lainnya.</li>
                                        <li>Lulus seluruh tahapan dan test seleksi.</li>
                                    </ul>
                                </motion.div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger className="w-full font-bold text-darkBlue text-lg md:text-xl hover:text-blue-500 transition-colors duration-300">
                                Bagaimana cara melamar pekerjaan di BPD DIY?
                            </AccordionTrigger>
                            <AccordionContent className="w-full text-gray-700 text-sm md:text-base leading-relaxed">
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                                    Anda dapat melamar pekerjaan melalui langkah berikut:
                                    <ul className="list-disc pl-6 mt-2">
                                        <li>Kunjungi website resmi BPD DIY atau portal karier yang bekerja sama dengan bank.</li>
                                        <li>Pilih posisi yang sesuai dengan minat dan kualifikasi Anda.</li>
                                        <li>Unduh dan lengkapi formulir lamaran.</li>
                                        <li>Siapkan dokumen pendukung seperti CV, surat lamaran, ijazah, transkrip nilai, dan pas foto.</li>
                                        <li>Kirim lamaran melalui sistem online.</li>
                                    </ul>
                                </motion.div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4">
                            <AccordionTrigger className="w-full font-bold text-darkBlue text-lg md:text-xl hover:text-blue-500 transition-colors duration-300">
                                Apakah fresh graduate dapat melamar di BPD DIY?
                            </AccordionTrigger>
                            <AccordionContent className="w-full text-gray-700 text-sm md:text-base leading-relaxed">
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                                    Ya, BPD DIY biasanya membuka kesempatan bagi fresh graduate dengan berbagai posisi.
                                </motion.div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-5">
                            <AccordionTrigger className="w-full font-bold text-darkBlue text-lg md:text-xl hover:text-blue-500 transition-colors duration-300">
                                Apakah ada kontrak kerja setelah diterima?
                            </AccordionTrigger>
                            <AccordionContent className="w-full text-gray-700 text-sm md:text-base leading-relaxed">
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                                    Setelah diterima, pegawai akan menjalani kontrak selama 3(tiga) tahun.
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
