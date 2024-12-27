"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import FooterCopyright from "../../components/FooterCopyright";
import MenuBar from "../../../components/MenuBar";
import { ScrollToTopButton } from "../../components/ScrollToTopButton";

const Riwayat = () => {
  const [currentStep, setCurrentStep] = useState(4); // Current step: "Tes Psikologi dan TPA"
  const [applicantData, setApplicantData] = useState({
    nama: "",
    nomorPeserta: "",
    posisi: "Software Engineer",
  });

  useEffect(() => {
    const fetchApplicantData = async () => {
      const token = localStorage.getItem('token');
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
              nama: profileData.data.nama,
              nomorPeserta: profileData.data.noPeserta,
              posisi: "Software Engineer",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching applicant data:", error);
      }
    };

    fetchApplicantData();
  }, []);

  const passedSteps = [1, 2, 3, 4]; // Steps that are passed

  const steps = [
    { id: 1, label: "Pendaftaran", status: passedSteps.includes(1) ? "Lolos" : "Belum", icon: passedSteps.includes(1) ? "https://ojkpcs8pct2.shl.co.id/images/icon-status/ic-assesment-success.svg" : "https://ojkpcs8pct2.shl.co.id/images/icon-status/ic-assesment-not-ready.svg" },
    { id: 2, label: "Seleksi Administrasi", status: passedSteps.includes(2) ? "Lolos" : "Belum", icon: passedSteps.includes(2) ? "https://ojkpcs8pct2.shl.co.id/images/icon-status/ic-regist-success.svg" : "https://ojkpcs8pct2.shl.co.id/images/icon-status/ic-assesment-not-ready.svg" },
    { id: 3, label: "Tes Potensi Dasar", status: passedSteps.includes(3) ? "Lolos" : "Belum", icon: passedSteps.includes(3) ? "https://ojkpcs8pct2.shl.co.id/images/icon-status/ic-assesment-success.svg" : "https://ojkpcs8pct2.shl.co.id/images/icon-status/ic-assesment-not-ready.svg" },
    { id: 4, label: "Tes Kemampuan Umum", status: passedSteps.includes(4) ? "Lolos" : "Belum", icon: passedSteps.includes(4) ? "https://ojkpcs8pct2.shl.co.id/images/icon-status/ic-assesment-success.svg" : "https://ojkpcs8pct2.shl.co.id/images/icon-status/ic-assesment-not-ready.svg" },
    { id: 5, label: "Tes Kepribadian & Wawancara Psikolog", status: passedSteps.includes(5) ? "Lolos" : "Belum", icon: passedSteps.includes(5) ? "https://ojkpcs8pct2.shl.co.id/images/icon-status/ic-assesment-success.svg" : "https://ojkpcs8pct2.shl.co.id/images/icon-status/ic-assesment-not-ready.svg" },
    { id: 6, label: "Tes Kesehatan", status: passedSteps.includes(6) ? "Lolos" : "Belum", icon: passedSteps.includes(6) ? "https://ojkpcs8pct2.shl.co.id/images/icon-status/ic-healt-test-success.svg" : "https://ojkpcs8pct2.shl.co.id/images/icon-status/ic-healt-test-not-ready.svg" },
    { id: 7, label: "Wawancara Panel", status: passedSteps.includes(7) ? "Lolos" : "Belum", icon: passedSteps.includes(7) ? "https://ojkpcs8pct2.shl.co.id/images/icon-status/ic-user-success.svg" : "https://ojkpcs8pct2.shl.co.id/images/icon-status/ic-user-not-ready.svg" },
    { id: 8, label: "Penetapan & Pemberkasan", status: passedSteps.includes(8) ? "Lolos" : "Belum", icon: passedSteps.includes(8) ? "https://ojkpcs8pct2.shl.co.id/images/icon-status/ic-filling-success.svg" : "https://ojkpcs8pct2.shl.co.id/images/icon-status/ic-filling-not-ready.svg" },
  ];

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
              {steps.map((step) => (
                <li key={step.id} className="flex-1">
                  <div className="flex-start flex items-center pt-2 md:block md:pt-0">
                    <div className={`-ms-[22px] me-3 w-10 h-10 flex items-center justify-center rounded-full ${passedSteps.includes(step.id) ? 'bg-green-600 border-green-500' : 'bg-success-600 border-success-500'} md:-mt-[22px] md:me-0 md:ms-0`}>
                      <img src={step.icon} alt={`icon ${step.label}`} />
                    </div>
                    <div>
                      <h4 className={`md:mt-2 mb-1.5 ${passedSteps.includes(step.id) ? 'text-green-600' : 'text-grey'} font-medium`}>{step.label}</h4>
                      {step.status === "Lolos" && (
                        <span className="py-1 px-2 inline-block bg-green-100 text-green-600 font-semibold text-xs rounded-lg">{step.status}</span>
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
              <p className="mb-2">Bagi pendaftar yang dinyatakan <span className="font-semibold bg-green-100 text-green-600">LOLOS</span> diharapkan datang di:</p>
              <p className="mb-1"><span className="font-semibold">Hari/Tanggal:</span> [Isi Hari/Tanggal]</p>
              <p className="mb-1"><span className="font-semibold">Tempat:</span> [Isi Tempat]</p>
              <p className="mb-3"><span className="font-semibold">Waktu:</span> [Isi Waktu]</p>
              <p className="mb-4">Bagi pendaftar yang <span className="font-semibold bg-green-100 text-green-600">LOLOS</span> Seleksi Tes Praktik Teknologi Informasi akan diberitahukan melalui Website PT Bank BPD DIY pada tanggal <span className="font-semibold">06 Desember 2024 Pukul 16.00 WIB.</span></p>
              <p className="mb-4"><span className="font-semibold">Catatan: Pendaftar tidak diperkenankan menggunakan kendaraan roda 4 mengingat terbatasnya area parkir.</span></p>
              <p className="mb-4">Demikian, Terima kasih.</p>
              <p className="mb-8"><span className="font-semibold">Yogyakarta, 30 November 2024</span></p>
              <p className="mb-8"><span className="font-semibold">Tim Penerimaan Pegawai</span></p>
            </div>
          </div>
        </div>

        <FooterCopyright />
        <ScrollToTopButton />
      </main>
    </div>
  );
};

export default Riwayat;
