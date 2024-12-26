"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faTag } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faWhatsapp, faTwitter, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import MenuBar from '../../../../components/MenuBar';
import FooterSection from '../../../components/FooterSection';
import FooterCopyright from '../../../components/FooterCopyright';
import { ScrollToTopButton } from '../../../components/ScrollToTopButton';
import CariKarirButton from '../../../components/CariKarirButton';
import LottieAnimation from '../../../components/Animations';
import loadingAnimation from '../../../../public/animations/loading.json';
import animation404 from '../../../../public/animations/404.json';

interface Article {
    judulLowongan: string;
    tentangPekerjaan: string;
    persyaratan: string;
    periodeAwal: string;
    periodeAkhir: string;
    posisi: string;
    kodeLowongan: string;
}

interface Tahapan {
    idTahapan: number;
    namaTahapan: string;
    deskripsi: string;
    isActive: boolean;
}

const DetailKarir = () => {
    const params = useParams();
    const slug = params?.id as string; // Get slug from URL
    const [isLoading, setIsLoading] = useState(true);
    const [article, setArticle] = useState<Article | null>(null);
    const [tahapan, setTahapan] = useState<Tahapan[]>([]);

    useEffect(() => {
        const fetchArticle = async () => {
            setIsLoading(true);
            const token = localStorage.getItem('token');

            if (!token) return;

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/lowongan/slug/${slug}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                });

                const data = await response.json();
                if (data.responseCode === '000') {
                    setArticle(data.data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchTahapan = async () => {
            setIsLoading(true);
            const token = localStorage.getItem('token');

            if (!token) return;
            
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tahapan/list`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                });

                const data = await response.json();
                if (data.responseCode === '000') {
                    const sortedTahapan = data.data.sort((a: Tahapan, b: Tahapan) => a.idTahapan - b.idTahapan);
                    setTahapan(sortedTahapan);
                }
            } catch (error) {
                console.error('Error fetching Tahapan Seleksi:', error);
            }
        };

        fetchArticle();
        fetchTahapan();
    }, [slug]);

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
                        <path
                            fill="url(#grad1)"
                            d="M0,0L120,10.7C240,21,480,43,720,48C960,53,1200,43,1320,37.3L1440,32L1440,0L1320,0C1200,0,960,0,720,0C480,0,240,0,120,0L0,0Z"
                        ></path>
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
                        <>
                            <div className="w-11/12 lg:w-4/5 mt-6 mb-10">
                                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                                    <div className="p-4">
                                        <h1 className="text-darkBlue font-semibold text-3xl mt-8 mb-4 md:mt-6 md:mb-6 text-center">
                                            {article.judulLowongan}
                                        </h1>
                                        <div className="flex justify-center space-x-4 mt-4 text-gray-500">
                                            <div className="flex items-center text-sm md:text-base">
                                                <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                                                <span>
                                                    {article.kodeLowongan}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <FontAwesomeIcon icon={faTag} className="mr-2" />
                                                <span>{article.posisi}</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-center mt-4 space-x-2">
                                            <a href="#" className="text-blue-500" title="Share on Facebook">
                                                <FontAwesomeIcon icon={faFacebookF} />
                                            </a>
                                            <a href="#" className="text-green-500" title="Share on WhatsApp">
                                                <FontAwesomeIcon icon={faWhatsapp} />
                                            </a>
                                            <a href="#" className="text-blue-400" title="Share on Twitter">
                                                <FontAwesomeIcon icon={faTwitter} />
                                            </a>
                                            <a href="#" className="text-blue-700" title="Share on LinkedIn">
                                                <FontAwesomeIcon icon={faLinkedinIn} />
                                            </a>
                                            {/* <button onClick={() => navigator.clipboard.writeText(window.location.href)} className="text-gray-500" title="Copy Link">
                                                <FontAwesomeIcon icon={faLink} />
                                            </button> */}
                                        </div>
                                        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="col-span-2">
                                                <h2 className="font-semibold text-lg">Tentang Pekerjaan</h2>
                                                <p dangerouslySetInnerHTML={{ __html: article.tentangPekerjaan }} />
                                                <h2 className="font-semibold text-lg mt-6">Persyaratan</h2>
                                                <p dangerouslySetInnerHTML={{ __html: article.persyaratan }} />
                                            </div>
                                            <div className="bg-gray-100 p-4 rounded-lg">
                                                <h2 className="font-semibold text-lg">Periode Pendaftaran</h2>
                                                <p>
                                                    <span>
                                                        {new Date(article.periodeAwal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })} s/d{' '}
                                                        {new Date(article.periodeAkhir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}{' '}
                                                        {new Date(article.periodeAwal).getFullYear() === new Date(article.periodeAkhir).getFullYear() ? 
                                                            ` ${new Date(article.periodeAwal).getFullYear()}` : 
                                                            ` ${new Date(article.periodeAwal).getFullYear()} - ${new Date(article.periodeAkhir).getFullYear()}`}
                                                    </span>
                                                </p>
                                                <h2 className="font-semibold text-lg mt-4">Lokasi Tes</h2>
                                                <p>Yogyakarta</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-center mt-8">
                                            <button className="bg-darkBlue text-white py-2 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105">
                                                Daftar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tahapan Seleksi Section */}
                            <div className="w-11/12 lg:w-4/5 mt-6 mb-10">
                                <div className="bg-white shadow-lg rounded-lg overflow-hidden p-4">
                                    <h2 className="text-darkBlue font-bold text-xl mb-4">Tahapan Seleksi</h2>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                                        {tahapan.map((step) => (
                                            <div key={step.idTahapan} className="flex flex-col items-center bg-blue-100 p-4 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105">
                                                <div className={`bg-blue-500 text-white w-12 h-12 flex items-center justify-center rounded-full mb-2 ${step.isActive ? 'animate-bounce' : ''}`}>
                                                    {tahapan.findIndex(t => t.idTahapan === step.idTahapan) + 1}
                                                </div>
                                                <p className="text-center text-sm font-medium text-darkBlue">
                                                    {step.namaTahapan}
                                                </p>
                                                <p className="text-center text-xs text-gray-600 mt-2">
                                                    {step.deskripsi}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
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

export default DetailKarir;
