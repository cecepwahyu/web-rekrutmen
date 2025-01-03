"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import FooterCopyright from "../../components/FooterCopyright";
import MenuBar from "../../../components/MenuBar";
import { ScrollToTopButton } from "../../components/ScrollToTopButton";

interface Tahapan {
    idTahapan: number;
    namaTahapan: string;
    deskripsi: string;
    isActive: boolean;
}

const Riwayat = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [steps, setSteps] = useState<Tahapan[]>([]);
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(4); // Current step: "Tes Psikologi dan TPA"
  const [applicantData, setApplicantData] = useState({
    nama: "",
    nomorPeserta: "",
    posisi: "Software Engineer",
  });
  const [announcementContent, setAnnouncementContent] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  useEffect(() => {
    const fetchApplicantData = async () => {
      setIsLoading(true);

      const token = localStorage.getItem('token');

      if (!token) {
        console.error("No token found in localStorage");
        setIsLoading(false);
        return;
      }

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
            setApplicantData({
              nama: profileData.data.nama || "Tidak ada lamaran",
              nomorPeserta: profileData.data.lowonganId || "Tidak ada lamaran",
              posisi: profileData.data.judulLowongan || "Tidak ada lamaran",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching applicant data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchApplicantData();
    }
  }, [currentPage, isAuthenticated]);

  useEffect(() => {
    const fetchSteps = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tahapan/list`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.responseCode === '000') {
          setSteps(data.data);
        }
      } catch (error) {
        console.error('Error fetching steps:', error);
      }
    };

    fetchSteps();
  }, []);

  useEffect(() => {
    const fetchAnnouncementContent = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/announcements/content`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ id_lowongan: 52 })
        });
        const data = await response.text();
        setAnnouncementContent(data);
      } catch (error) {
        console.error('Error fetching announcement content:', error);
      }
    };

    fetchAnnouncementContent();
  }, []);

  const passedSteps = [1, 2, 3, 4, 5]; // Steps that are passed

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans relative">
      <MenuBar />
      <main className="pt-28 bg-gradient-to-r from-[#015CAC] to-[#018ED2] relative z-10">
        <div className="bg-white relative z-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%">
                <stop offset="0%" style={{ stopColor: '#015CAC', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#018ED2', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <path fill="url(#grad1)"
              d="M0,0L120,10.7C240,21,480,43,720,48C960,53,1200,43,1320,37.3L1440,32L1440,0L1320,0C1200,0,960,0,720,0C480,0,240,0,120,0L0,0Z"></path>
          </svg>
        </div>

        {applicantData.nama === "Tidak ada lamaran" ? (
          <div className="flex flex-col justify-center items-center w-full bg-white min-h-[400px] relative z-10 -mt-32 pb-10">
            <h2 className="text-3xl font-bold text-darkBlue mb-6 text-center pt-6 sm:pt-0">
              Anda belum melamar pekerjaan
            </h2>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center w-full bg-white min-h-[400px] relative z-10 -mt-32 pb-10">
            <h2 className="text-3xl font-bold text-darkBlue mb-6 text-center pt-6 sm:pt-0">
              Tahapan Rekrutmen
            </h2>

            {/* Rectangle Container */}
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl mb-10">
              <div className="flex flex-col sm:flex-row sm:justify-between text-sm sm:text-base">
                <p><span className="font-semibold">Nama:</span> {applicantData.nama}</p>
                <p><span className="font-semibold">Nomor Peserta:</span> {applicantData.nomorPeserta}</p>
                <p><span className="font-semibold">Posisi Dilamar:</span> {applicantData.posisi}</p>
              </div>
            </div>

            {/* Progress Bar Container */}
            <div className="relative flex flex-col sm:flex-row items-center w-full max-w-4xl px-4">
              <ol className="border-s border-neutral-300 dark:border-neutral-500 md:flex md:gap-6 md:border-s-0 md:border-t-2">
                {steps.map((step, index) => (
                  <li key={step.idTahapan} className="flex-1">
                    <div className="flex-start flex items-center pt-2 md:block md:pt-0">
                      <div className={`-ms-[22px] me-3 w-10 h-10 flex items-center justify-center rounded-full ${passedSteps.includes(index + 1) ? 'bg-green-600 border-green-500' : 'bg-gray-300 border-gray-100'} md:-mt-[22px] md:me-0 md:ms-0`}>
                        <span className="text-white">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className={`md:mt-2 mb-1.5 ${passedSteps.includes(index + 1) ? 'text-green-600' : 'text-gray-700'} font-medium`}>{step.namaTahapan}</h4>
                        {passedSteps.includes(index + 1) && (
                          <span className="py-1 px-2 inline-block bg-green-100 text-green-600 font-semibold text-xs rounded-lg">Lolos</span>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Rectangle Container */}
            <div className="bg-blue-50 rounded-lg p-6 w-full max-w-4xl mt-28 border-2 border-darkBlue border-dashed mb-10">
              <div className="text-sm sm:text-base">
                {/* Heading */}
                <p className="font-semibold text-darkBlue text-lg mb-4">Informasi Test</p>

                {/* Details */}
                <div dangerouslySetInnerHTML={{ __html: announcementContent }} />
              </div>
            </div>
          </div>
        )}

        <FooterCopyright />
        <ScrollToTopButton />
      </main>
    </div>
  );
};

export default Riwayat;
