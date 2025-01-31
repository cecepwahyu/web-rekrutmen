"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import FooterCopyright from "../../../components/FooterCopyright";
import MenuBar from "../../../components/MenuBar";
import { ScrollToTopButton } from "../../../components/ScrollToTopButton";
import { Skeleton } from "@/components/ui/skeleton"
import { jsPDF } from "jspdf";
import QRCode from "qrcode";

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
    noIdentitas: "",
    idLowongan: null,
  });
  const [announcementContent, setAnnouncementContent] = useState("");
  const [announcementTitle, setAnnouncementTitle] = useState("");
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
            noIdentitas: result.data.noIdentitas || "Tidak ada lamaran",
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tahapan/lowongan/${applicantData.idLowongan}/peserta/${applicantData.nomorPeserta}/progress`, {
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
            idTahapan: step[4],
            namaTahapan: step[5],
            deskripsi: step[6],
            isActive: step[10] === null ? null : step[10] === true,
            announcementTitle: step[13],
            announcementContent: step[14]
          }));
          setSteps(stepsData);
        }
      } catch (error) {
        console.error('Error fetching steps:', error);
      }
    };

    if (applicantData.idLowongan && applicantData.nomorPeserta) {
      fetchSteps();
    }
  }, [applicantData.idLowongan, applicantData.nomorPeserta]);

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
          body: JSON.stringify({ id_lowongan: applicantData.idLowongan })
        });

        const data = await response.json();

        if (data.responseCode === '000' && data.data) {
          setAnnouncementContent(data.data.content);
          setAnnouncementTitle(data.data.title);
        } else {
          console.error('Error fetching announcement content:', data.responseMessage);
        }
      } catch (error) {
        //console.error('Error fetching announcement content:', error);
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

  const toRoman = (num: number): string => {
    const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
    return romanNumerals[num - 1] || num.toString();
  };

  const handleDownloadPDF = async () => {
    const doc = new jsPDF("landscape", "mm", "a4");
  
    // Load and add the logo image
    const logoPath = "/images/Logo_Color.png"; // Path to your logo
    const logoWidth = 30; // Adjust logo width
    const logoHeight = 15; // Adjust logo height
  
    // Add header
    doc.addImage(logoPath, "PNG", 150, 10, logoWidth, logoHeight); // Position the logo at the top-right corner
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Kartu Peserta Tes", 220, 20, { align: "center" }); // Title centered on the right half
    doc.setFontSize(12);
    doc.text("Rekrutmen Pegawai PT Bank BPD DIY 2024", 220, 28, { align: "center" }); // Subtitle centered on the right half
    doc.setLineWidth(0.5);
    doc.line(150, 35, 290, 35); // Line on the right half
  
    // Add footer
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(8);
    doc.text("PT Bank BPD DIY", 160, pageHeight - 10);
  
    // Add the applicant's information with consistent spacing
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const textX = 160;
    const textYStart = 40;
    const textYIncrement = 8;
    const labelWidth = 25; // Adjust label width for alignment
    doc.text(`Nama       `, textX, textYStart);
    doc.text(`: ${applicantData.nama || "....................."}`, textX + labelWidth, textYStart);
    doc.text(`Posisi     `, textX, textYStart + textYIncrement);
    doc.text(`: ${applicantData.posisi || "....................."}`, textX + labelWidth, textYStart + textYIncrement);
    doc.text(`Nomer Test `, textX, textYStart + 2 * textYIncrement);
    doc.text(`: ${applicantData.nomorPeserta || "....................."}`, textX + labelWidth, textYStart + 2 * textYIncrement);
  
    // Generate QR code with additional information
    const qrCodeData = await QRCode.toDataURL(
      `Nama: ${applicantData.nama || "....................."}\n` +
      `Nomor Peserta: ${applicantData.nomorPeserta || "....................."}\n` +
      `No Identitas: ${applicantData.noIdentitas || "....................."}\n` +
      `Posisi: ${applicantData.posisi || "....................."}`
    );
    doc.addImage(qrCodeData, "PNG", textX, textYStart + 3 * textYIncrement, 25, 25); // Adjust position and size as needed
  
    // Add a rectangle for the picture with size 4x6 and text "4 x 6" in the middle
    const rectX = 245;
    const rectY = textYStart;
    const rectWidth = 40; // 4 cm
    const rectHeight = 60; // 6 cm
    doc.rect(rectX, rectY, rectWidth, rectHeight);
    doc.setFontSize(10);
    doc.text("4 x 6", rectX + rectWidth / 2, rectY + rectHeight / 2, { align: "center" });
  
    // Add the signature section
    const signatureYStart = 120; // Adjusted position to avoid conflict with the profile 4x6
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Tanda Tangan Peserta", 170, signatureYStart);
    doc.text("Panitia", 245, signatureYStart);
  
    // Draw signature boxes
    doc.setLineWidth(0.3);
    doc.rect(160, signatureYStart + 5, 60, 25); // Box for participant signature
    doc.rect(225, signatureYStart + 5, 60, 25); // Box for committee signature
  
    // Add a table with dynamic columns based on steps in Roman numeral format
    const tableStartY = 160;
    const columnWidth = 20;
    const tableWidth = columnWidth * steps.length;
    const tableStartX = 160 + (130 - tableWidth) / 2; // Center the table on the right half
    steps.forEach((step, index) => {
      const x = tableStartX + index * columnWidth;
      doc.text(toRoman(index + 1), x + columnWidth / 2, tableStartY, { align: "center" });
      doc.rect(x, tableStartY + 5, columnWidth, 15); // Draw the cell
    });
  
    // Add a vertical dashed line in the middle of the page with a scissor icon
    const middleX = doc.internal.pageSize.getWidth() / 2;
    doc.setLineDashPattern([5, 5], 0); // Set dashed line
    doc.line(middleX, 10, middleX, pageHeight - 10); // Draw dashed line

    // Add scissor icon
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("✂", middleX - 2, pageHeight / 2 - 2); // Position the scissor icon

    // Save the PDF with dynamic file name
    const fileName = `Kartu_Peserta_Test_${applicantData.nama.replace(/\s+/g, '_')}.pdf`;
    doc.save(fileName);
  };
    

  const passedSteps = Array.from({ length: currentSortOrder + 1 }, (_, i) => i + 1);

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
                  {steps.map((step, index) => {
                    const isLastGreenStep = steps.findIndex(s => s.isActive === true) === index;
                    const isNextStep = steps.findIndex(s => s.isActive === true) + 1 === index;
                    const isAfterGreenStep = steps.findIndex(s => s.isActive === true) < index && steps[index - 1]?.isActive === true;
                    if (step.isActive === true || step.isActive === false || isLastGreenStep || (isNextStep && steps[index - 1]?.isActive === true) || isAfterGreenStep) {
                      return (
                        <li key={`${step.idTahapan}-${index}`} className="flex-1">
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
                            </div>
                          </div>
                        </li>
                      );
                    }
                    return null;
                  })}
                </ol>
              </div>

              {/* Rectangle Container */}
              <div className="bg-blue-50 rounded-lg p-6 w-full max-w-4xl mt-28 border-2 border-darkBlue border-dashed mb-10">
                <div className="text-sm sm:text-base">
                  {/* Heading */}
                  <p className="font-semibold text-darkBlue text-lg mb-4 summernote-content">Informasi Test</p>

                    {/* Details */}
                    <div dangerouslySetInnerHTML={{ __html: isLoading ? "" : announcementContent || "" }} />
                    {steps
                    .filter((step) => step.isActive !== null)
                    .slice(-1) // Only take the newest (last) active step with an announcement
                    .map((step) => (
                        <div className="mt-2" key={step.idTahapan}>
                        <h5 className="font-normal summernote-content">
                          {step.isActive ? (
                          step.announcementTitle
                          ) : (
                          <>
                            Mohon Maaf Anda <span className="font-bold">TIDAK LOLOS</span> ke tahap berikutnya
                          </>
                          )}
                        </h5>
                        <div className="summernote-content" dangerouslySetInnerHTML={{ __html: step.isActive ? step.announcementContent || "" : "Terima kasih atas partisipasi Anda dalam proses seleksi di Bank BPD DIY. Kami mengapresiasi usaha Anda dan berharap dapat bertemu di kesempatan rekrutmen mendatang." }} />
                        </div>
                    ))}
                </div>
              </div>
              
              {/* Download PDF Section */}
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl mb-10 flex flex-col items-center">
                <button
                  onClick={handleDownloadPDF}
                  className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-2 px-4 rounded-lg hover:from-blue-700 hover:to-blue-900 transition duration-300 ease-in-out transform hover:scale-105 mt-4"
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
