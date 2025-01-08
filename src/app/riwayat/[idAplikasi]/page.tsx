"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import FooterCopyright from "../../../components/FooterCopyright";
import MenuBar from "../../../components/MenuBar";
import { ScrollToTopButton } from "../../../components/ScrollToTopButton";
import { Skeleton } from "@/components/ui/skeleton"
import { jsPDF } from "jspdf";

interface Tahapan {
    idTahapan: number;
    namaTahapan: string;
    deskripsi: string;
    isActive: boolean | null;
    announcementTitle?: string;
    announcementContent?: string;
}

const getIdFromToken = async (token: string): Promise<string | null> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/get-id-peserta`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
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

const DetailRiwayat = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [steps, setSteps] = useState<Tahapan[]>([]);
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(2); // Current step: "Tes Psikologi dan TPA"
  const [applicantData, setApplicantData] = useState({
    nama: "",
    nomorPeserta: "",
    posisi: "",
    idLowongan: null,
  });
  const [announcementContent, setAnnouncementContent] = useState("Pesan tidak ditemukan");
  const [currentSortOrder, setCurrentSortOrder] = useState(0);
  const [showRegistrationCard, setShowRegistrationCard] = useState(false);
  const [participantId, setParticipantId] = useState<number | null>(null);
  const [idPeserta, setIdPeserta] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
      // Fetch idPeserta
      const fetchIdPeserta = async () => {
        const id = await getIdFromToken(token);
        setIdPeserta(id);
      };
      fetchIdPeserta();
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/peserta-info/${idPeserta}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const result = await response.json();
        if (result.responseCode === '000') {
          setApplicantData({
            nama: result.data.nama || "Tidak ada lamaran",
            nomorPeserta: result.data.kodeLowongan || "Tidak ada lamaran",
            posisi: result.data.judulLowongan || "Tidak ada lamaran",
            idLowongan: result.data.idLowongan || null,
          });
        }
      } catch (error) {
        console.error("Error fetching applicant data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && idPeserta) {
      fetchApplicantData();
    }
  }, [currentPage, isAuthenticated, idPeserta]);

  useEffect(() => {
    const fetchSteps = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tahapan/lowongan/id/${applicantData.idLowongan}/tahapan`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.responseCode === '000') {
          const stepsData = data.data.map((step: any) => ({
            idTahapan: step[2],
            namaTahapan: step[4],
            deskripsi: step[5],
            isActive: step[6] === null ? null : step[6] === true,
            announcementTitle: step[7],
            announcementContent: step[8]
          }));
          setSteps(stepsData);
        }
      } catch (error) {
        console.error('Error fetching steps:', error);
      }
    };

    if (applicantData.idLowongan) {
      fetchSteps();
    }
  }, [applicantData.idLowongan]);

  useEffect(() => {
    const fetchAnnouncementContent = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        console.error("No token found in localStorage");
        setIsLoading(false);
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
          body: JSON.stringify({ id_lowongan: applicantData.idLowongan }) // Use dynamic idLowongan
        });
        const data = await response.json();
        if (data.responseCode === '000') {
          const flgTahapan = data.data.flg_tahapan;
          if (flgTahapan === null) {
            setAnnouncementContent("Belum ada pengumuman");
          } else if (flgTahapan === false) {
            setAnnouncementContent("Terima kasih atas partisipasi Anda,<br/>Mohon Maaf, Anda TIDAK LOLOS Seleksi Administrasi,<br/><br/>Semoga sukses di kesempatan berikutnya.<br/><br/>Tim Rekrutmen Bank BPD DIY");
          } else {
            setAnnouncementContent(data.data.content); // Set the announcement content
          }
        } else {
          console.error('Error fetching announcement content:', data.responseMessage);
          setAnnouncementContent("Pesan tidak ditemukan");
        }
      } catch (error) {
        console.error('Error fetching announcement content:', error);
        setAnnouncementContent("Pesan tidak ditemukan");
      } finally {
        setIsLoading(false);
      }
    };

    if (applicantData.idLowongan) {
      fetchAnnouncementContent();
    }
  }, [applicantData.idLowongan]);

  useEffect(() => {
    const fetchCurrentSortOrder = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/progress/tahapan/${applicantData.idLowongan}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.responseCode === '000') {
          setCurrentSortOrder(data.data.currentSortOrder);
        }
      } catch (error) {
        console.error('Error fetching current sort order:', error);
      }
    };

    if (applicantData.idLowongan) {
      fetchCurrentSortOrder();
    }
  }, [applicantData.idLowongan]);

  const handlePrint = () => {
    window.print();
  };

  const handleShowRegistrationCard = () => {
    setShowRegistrationCard(true);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF("portrait", "mm", "a4");
  
    // Load and add the logo image
    const logoPath = "/images/Logo_Color.png"; // Path to your logo
    const logoWidth = 60; // Adjust logo width
    const logoHeight = 20; // Adjust logo height
  
    doc.addImage(logoPath, "PNG", 140, 10, logoWidth, logoHeight); // Position the logo at the top-right corner
  
    // Add the title and subtitle (aligned left)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Kartu Peserta Tes", 20, 20); // Title aligned left
    doc.setFontSize(14);
    doc.text("Rekrutmen Pegawai PT Bank BPD DIY 2024", 20, 30); // Subtitle aligned left
  
    // Draw a horizontal line
    doc.setLineWidth(0.5);
    doc.line(10, 40, 200, 40);
  
    // Add the applicant's information with consistent spacing
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    const textX = 20;
    const textYStart = 60;
    const textYIncrement = 10;
    doc.text(`Nama       : ${applicantData.nama || "....................."}`, textX, textYStart);
    doc.text(`Posisi     : ${applicantData.posisi || "....................."}`, textX, textYStart + textYIncrement);
    doc.text(`Nomer Test : ${applicantData.nomorPeserta || "....................."}`, textX, textYStart + 2 * textYIncrement);
  
    // Add a rectangle for the picture with size 4x6 and text "4 x 6" in the middle
    const rectX = 140;
    const rectY = textYStart;
    const rectWidth = 40; // 4 cm
    const rectHeight = 60; // 6 cm
    doc.rect(rectX, rectY, rectWidth, rectHeight);
    doc.setFontSize(10);
    doc.text("4 x 6", rectX + rectWidth / 2, rectY + rectHeight / 2, { align: "center" });
  
    // Add the signature section
    const signatureYStart = 140; // Adjusted position to avoid conflict with the profile 4x6
    doc.setFont("helvetica", "bold");
    doc.text("Tanda Tangan Peserta", 40, signatureYStart);
    doc.text("Panitia", 140, signatureYStart);
  
    // Draw signature boxes
    doc.setLineWidth(0.3);
    doc.rect(30, signatureYStart + 5, 60, 30); // Box for participant signature
    doc.rect(120, signatureYStart + 5, 60, 30); // Box for committee signature
  
    // Add a table with 6 columns labeled I, II, III, IV, V, VI
    const tableStartY = 190;
    const columnWidth = 25;
    const tableWidth = columnWidth * 6;
    const tableStartX = (doc.internal.pageSize.getWidth() - tableWidth) / 2; // Center the table
    const columns = ["I", "II", "III", "IV", "V", "VI"];
    columns.forEach((col, index) => {
      const x = tableStartX + index * columnWidth;
      doc.text(col, x + columnWidth / 2, tableStartY, { align: "center" });
      doc.rect(x, tableStartY + 5, columnWidth, 20); // Draw the cell
    });
  
    // Save the PDF
    doc.save("Kartu_Peserta_Tes.pdf");
  };
    

  const passedSteps = Array.from({ length: currentSortOrder }, (_, i) => i + 1);

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

        <div className="flex flex-col justify-center items-center w-full bg-white min-h-[400px] relative z-10 -mt-32 pb-10">
          <h2 className="text-3xl font-bold text-darkBlue mb-6 text-center pt-6 sm:pt-0">
            Tahapan Rekrutmen
          </h2>

          {applicantData.nama === "Tidak ada lamaran" ? (
            <h2 className="text-3xl font-bold text-darkBlue mb-6 text-center pt-6 sm:pt-0">
              Anda belum melamar pekerjaan
            </h2>
          ) : (
            <>
              {/* Rectangle Container */}
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl mb-10">
                <div className="flex flex-col sm:flex-row sm:justify-between text-sm sm:text-base">
                  <div><span className="font-semibold">Nama:</span> {isLoading ? <Skeleton className="w-24 h-4" /> : applicantData.nama}</div>
                  <div><span className="font-semibold">Nomor Peserta:</span> {isLoading ? <Skeleton className="w-24 h-4" /> : applicantData.nomorPeserta}</div>
                  <div><span className="font-semibold">Posisi Dilamar:</span> {isLoading ? <Skeleton className="w-24 h-4" /> : applicantData.posisi}</div>
                </div>
              </div>

              {/* Progress Bar Container */}
              <div className="relative flex flex-col sm:flex-row items-center w-full max-w-4xl px-4">
                <ol className="border-s border-neutral-300 dark:border-neutral-500 md:flex md:gap-6 md:border-s-0 md:border-t-2">
                  {steps.map((step, index) => (
                    <li key={step.idTahapan} className="flex-1">
                      <div className="flex-start flex items-center pt-2 md:block md:pt-0">
                        <div className={`-ms-[22px] me-3 w-10 h-10 flex items-center justify-center rounded-full ${step.isActive === null ? 'bg-gray-300 border-gray-100' : step.isActive ? 'bg-green-600 border-green-500' : 'bg-red-600 border-red-500'} md:-mt-[22px] md:me-0 md:ms-0`}>
                          <span className="text-white">{index + 1}</span>
                        </div>
                        <div>
                          <h4 className={`md:mt-2 mb-1.5 ${step.isActive === null ? 'text-gray-700' : step.isActive ? 'text-green-600' : 'text-red-600'} font-medium`}>{step.namaTahapan}</h4>
                          {step.isActive !== null && (
                            <span className={`py-1 px-2 inline-block ${step.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} font-semibold text-xs rounded-lg`}>
                              {step.isActive ? 'Lolos' : 'Tidak Lolos'}
                            </span>
                          )}
                          {/* {step.isActive && step.announcementTitle && (
                            <div className="mt-2">
                              <h5 className="font-semibold">{step.announcementTitle}</h5>
                              <div dangerouslySetInnerHTML={{ __html: step.announcementContent || "" }} />
                            </div>
                          )} */}
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
                  <div dangerouslySetInnerHTML={{ __html: isLoading ? "" : announcementContent }} />
                  {steps.map((step) => (
                    step.isActive && step.announcementTitle && (
                      <div className="mt-2" key={step.idTahapan}>
                        <h5 className="font-semibold">{step.announcementTitle}</h5>
                        <div dangerouslySetInnerHTML={{ __html: step.announcementContent || "" }} />
                      </div>
                    )
                  ))}
                </div>
              </div>
              

              {/* Download PDF Section */}
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl mb-10 flex flex-col items-center">
                <button
                  onClick={handleDownloadPDF}
                  className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 mt-4"
                >
                  Download Kartu Peserta
                </button>
              </div>
            </>
          )}
        </div>

        <FooterCopyright />
        <ScrollToTopButton />
      </main>
    </div>
  );
};

export default DetailRiwayat;
