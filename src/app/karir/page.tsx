"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faUsers } from "@fortawesome/free-solid-svg-icons";
import MenuBar from "../../../components/MenuBar";
import FooterCopyright from "../../../components/FooterCopyright";
import FooterSection from "../../../components/FooterSection";
import { ScrollToTopButton } from "../../../components/ScrollToTopButton";
import CariKarirButton from "../../../components/CariKarirButton";
import LottieAnimation from "../../../components/Animations";
import animation404 from "../../../public/animations/404.json";
import loadingAnimation from "../../../public/animations/loading.json";

const ITEMS_PER_PAGE = 6; // Items per page

const Karir = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [showScrollToTop, setShowScrollToTop] = useState(false);
    const [jobs, setJobs] = useState([]); // State for fetched jobs
    const [currentPage, setCurrentPage] = useState(0); // Current page starts at 0
    const [totalPages, setTotalPages] = useState(0); // Total pages
    const [activeTab, setActiveTab] = useState("Rekrutmen"); // Set default tab to "Rekrutmen"
    const [isLoading, setIsLoading] = useState(true); // State for loading animation
    const router = useRouter();

    // Check if user is authenticated when the page loads
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/login");
        }
    }, [router]);

    // Fetch job data from API
    useEffect(() => {
        const fetchJobs = async () => {
            setIsLoading(true); // Show loading animation
            const token = localStorage.getItem("token"); // Get token from localStorage

            if (!token) {
                console.error("No token found in localStorage");
                return; // Exit if no token is found
            }

            try {
                const response = await fetch(`http://localhost:8080/api/lowongan/paginated?page=${currentPage}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });
                const data = await response.json();
                if (data.responseCode === "000") {
                    setJobs(data.data.content); // Update jobs with current page content
                    setTotalPages(data.data.totalPages); // Set total pages
                }
            } catch (error) {
                console.error("Error fetching job data:", error);
            } finally {
                setIsLoading(false); // Hide loading animation
            }
        };

        fetchJobs();
    }, [currentPage]); // Re-fetch jobs when currentPage changes

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

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const goToNextPage = () => {
        if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
    };

    const goToPreviousPage = () => {
        if (currentPage > 0) setCurrentPage(currentPage - 1);
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans relative">
            <MenuBar />

            <main className="pt-20 bg-gradient-to-r from-[#015CAC] to-[#018ED2] relative z-10">
                <div className="container w-full mx-auto px-4 py-8 h-auto">
                    <div className="flex flex-wrap">
                        <div className="w-full md:w-1/2 pl-4 md:pl-20 flex items-center justify-center text-white">
                            <div className="p-8 rounded-lg text-center md:text-left">
                                <h1 className="text-3xl md:text-4xl font-bold mb-4">Temukan Karir Impianmu</h1>
                                <p>
                                    Mulai berkarir dan temukan tujuanmu bersama <br /> <b>Bank BPD DIY</b>
                                </p>
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 px-4">
                            <Image
                                src="/images/magang.png"
                                alt="Magang"
                                width={800}
                                height={600}
                                className="w-[460px] h-auto rounded-lg object-contain pb-10"
                            />
                        </div>
                    </div>
                </div>
                
                {/* Adjusted height for blue and white areas */}
                <div className="bg-white relative z-10 h-32"></div>

                {/* Section List Pekerjaan */}
                <div className="flex flex-col justify-center items-center w-full bg-white h-min-[400px] relative z-10 -mt-32 pt-20">
                    <h1 className="text-darkBlue font-semibold text-3xl mt-4 md:mt-2">Peluang Kerja Terbaru</h1>
                    <p className="text-center text-gray-700 mt-4 px-6">
                        Kami sedang membuka kesempatan bekerja untuk posisi berikut ini:
                    </p>

                    {/* Tab Buttons */}
                    <div className="flex justify-center mb-4 mt-6">
                        <button
                            className={`px-4 py-2 mx-2 transition-all duration-300 rounded-lg ${activeTab === "Rekrutmen" ? "bg-darkBlue text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                            onClick={() => setActiveTab("Rekrutmen")}
                        >
                            Rekrutmen
                        </button>
                        <button
                            className={`px-4 py-2 mx-2 transition-all duration-300 rounded-lg ${activeTab === "Job Desc" ? "bg-darkBlue text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                            onClick={() => setActiveTab("Job Desc")}
                        >
                            Job Desc
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center mt-10">
                            <LottieAnimation animationData={loadingAnimation} />
                        </div>
                    ) : activeTab === "Rekrutmen" ? (
                        jobs.length === 0 ? (
                            <div className="flex flex-col items-center mt-10">
                                <div className="w-3/4 sm:w-3/4 lg:w-1/4">
                                    <LottieAnimation animationData={animation404} />
                                </div>
                                <p className="text-darkBlue font-bold text-xl sm:text-2xl mt-4 mb-20 text-center">
                                    Lowongan sedang tidak dibuka
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6 w-11/12 lg:w-4/5 pb-10">
                                    {jobs.map((job: any) => (
                                        <button
                                            key={job.idLowongan}
                                            className="bg-white shadow-lg rounded-lg p-6 flex items-center transform hover:scale-105 transition duration-500 ease-in-out"
                                            onClick={() => (window.location.href = `/karir/${job.slug}`)}
                                        >
                                            <div className="w-1/4">
                                                <Image
                                                    src="/images/magang.png"
                                                    alt={job.judulLowongan}
                                                    width={150}
                                                    height={150}
                                                    className="rounded-lg object-contain"
                                                />
                                            </div>
                                            <div className="w-3/4 pl-6 text-left">
                                                <h2 className="text-xl font-bold mb-2 text-darkBlue">{job.judulLowongan}</h2>
                                                <p className="text-sm text-gray-600">{job.tentangPekerjaan}</p>
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center text-sm text-gray-600 space-y-2 sm:space-y-0 sm:space-x-4 mt-2">
                                                    <div className="flex items-center">
                                                        <FontAwesomeIcon icon={faUsers} className="mr-1" />
                                                        <span>{job.posisi}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <FontAwesomeIcon icon={faCalendar} className="mr-1" />
                                                        <span>
                                                            {new Date(job.periodeAwal).toLocaleDateString("id-ID", { day: "2-digit", month: "short" })} 
                                                            {new Date(job.periodeAwal).getFullYear() !== new Date(job.periodeAkhir).getFullYear() && ` ${new Date(job.periodeAwal).getFullYear()}`} 
                                                            {" s/d "}
                                                            {new Date(job.periodeAkhir).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                                                        </span>
                                                    </div>
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
                            {/* Magang Teknologi Informasi */}
                            <div className="w-full md:w-2/3 lg:w-1/2 mt-6 px-4">
                                <button
                                    className="w-full bg-white shadow-lg rounded-lg p-6 flex items-center hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
                                    onClick={() => window.location.href = '/magang/#'}
                                >
                                    <div className="w-1/4">
                                        <Image
                                            src="/images/magang-ti.jpeg"
                                            alt="Magang"
                                            width={150}
                                            height={150}
                                            className="rounded-lg object-contain"
                                        />
                                    </div>
                                    <div className="w-3/4 pl-6 text-left">
                                        <h2 className="text-xl font-bold mb-2 text-darkBlue">Programmer</h2>
                                        <p className="text-black">Kembangkan keterampilan IT dalam proyek perbankan dan pemeliharaan sistem.</p>
                                    </div>
                                </button>
                            </div>

                            {/* Magang Customer Service */}
                            <div className="w-full md:w-2/3 lg:w-1/2 mt-6 px-4">
                                <button
                                    className="w-full bg-white shadow-lg rounded-lg p-6 flex items-center hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
                                    onClick={() => window.location.href = '/magang/#'}
                                >
                                    <div className="w-1/4">
                                        <Image
                                            src="/images/magang-cs.jpg"
                                            alt="Magang"
                                            width={150}
                                            height={150}
                                            className="rounded-lg object-contain"
                                        />
                                    </div>
                                    <div className="w-3/4 pl-6 text-left">
                                        <h2 className="text-xl font-bold mb-2 text-darkBlue">Customer Service</h2>
                                        <p className="text-black">Belajar menangani transaksi perbankan, layani nasabah dengan profesional dan ramah.</p>
                                    </div>
                                </button>
                            </div>

                            {/* Magang Teller */}
                            <div className="w-full md:w-2/3 lg:w-1/2 mt-6 px-4">
                                <button
                                    className="w-full bg-white shadow-lg rounded-lg p-6 flex items-center hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
                                    onClick={() => window.location.href = '/magang/#'}
                                >
                                    <div className="w-1/4">
                                        <Image
                                            src="/images/magang-teller.jpg"
                                            alt="Magang"
                                            width={150}
                                            height={150}
                                            className="rounded-lg object-contain"
                                        />
                                    </div>
                                    <div className="w-3/4 pl-6 text-left">
                                        <h2 className="text-xl font-bold mb-2 text-darkBlue">Teller</h2>
                                        <p className="text-black">Layani nasabah, tangani keluhan, dan jawab pertanyaan produk bank.</p>
                                    </div>
                                </button>
                            </div>

                            {/* Magang Kasir */}
                            <div className="w-full md:w-2/3 lg:w-1/2 mt-6 px-4">
                                <button
                                    className="w-full bg-white shadow-lg rounded-lg p-6 flex items-center hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
                                    onClick={() => window.location.href = '/magang/#'}
                                >
                                    <div className="w-1/4">
                                        <Image
                                            src="/images/magang-kasir.jpg"
                                            alt="Magang"
                                            width={150}
                                            height={150}
                                            className="rounded-lg object-contain"
                                        />
                                    </div>
                                    <div className="w-3/4 pl-6 text-left">
                                        <h2 className="text-xl font-bold mb-2 text-darkBlue">Kasir</h2>
                                        <p className="text-black">Kelola uang tunai, verifikasi transaksi, dan pelaporan keuangan dengan teliti.</p>
                                    </div>
                                </button>
                            </div>
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
    );
};

export default Karir;
