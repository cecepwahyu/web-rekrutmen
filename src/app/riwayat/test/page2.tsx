"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import FooterCopyright from "../../../components/FooterCopyright";
import MenuBar from "../../../components/MenuBar";
import { ScrollToTopButton } from "../../../components/ScrollToTopButton";

const Riwayat = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans relative">
      <MenuBar />
      <main className="pt-28 bg-white relative z-10">
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

        <div className="lg:container pt-32 pb-10 mx-4">
          <h1 className="mb-4 text-black text-2xl lg:text-3xl font-bold">Profil</h1>
          <div className="mb-6 gap-4">
            <div className="mt-6 inline-block">
              <h3 className="font-semibold text-xl">Cecep Wahyu Cahyana</h3>
            </div>
            <div className="flex gap-2">
              <h4 className="text-grey text-right">No. Registrasi: 65302/PCS8/OJK/2024</h4>
            </div>
          </div>

          <h3 className="mb-6 text-black font-semibold text-xl">Tahapan Rekrutmen PCS8</h3>
          <div className="flex pt-10 px-10 md:px-6 pb-6 bg-white shadow-custom rounded-2xl">
            <ol className="border-s border-neutral-300 dark:border-neutral-500 md:flex md:gap-6 md:border-s-0 md:border-t-2">
              <li>
                <div className="flex-start flex items-center pt-2 md:block md:pt-0">
                  <div className="-ms-[22px] me-3 w-10 h-10 flex items-center justify-center rounded-full bg-success-600 border-4 border-success-500 md:-mt-[22px] md:me-0 md:ms-0">
                    <img src="https://ojkpcs8pct2.shl.co.id/images/icon-status/ic-assesment-success.svg" alt="icon pendaftaran" />
                  </div>
                  <div>
                    <h4 className="md:mt-2 mb-1.5 text-grey font-medium">Pendaftaran</h4>
                    <span className="py-1 px-2 inline-block bg-success/20 text-success-600 font-medium text-xs rounded-lg">LOLOS</span>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex-start flex items-center pt-2 md:block md:pt-0">
                  <div className="-ms-[22px] me-3 w-10 h-10 flex items-center justify-center rounded-full bg-success-600 border-4 border-success-500 md:-mt-[22px] md:me-0 md:ms-0">
                    <img src="https://ojkpcs8pct2.shl.co.id/images/icon-status/ic-regist-success.svg" alt="icon pendaftaran" />
                  </div>
                  <div>
                    <h4 className="md:mt-2 mb-1.5 text-grey font-medium">Seleksi Administrasi</h4>
                    <span className="py-1 px-2 inline-block bg-success/20 text-success-600 font-medium text-xs rounded-lg">LOLOS</span>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex-start flex items-center pt-2 md:block md:pt-0">
                  <div className="-ms-[22px] me-3 w-10 h-10 flex items-center justify-center rounded-full bg-success-600 border-4 border-success-500 md:-mt-[22px] md:me-0 md:ms-0">
                    <img src="https://ojkpcs8pct2.shl.co.id/images/icon-status/ic-assesment-not-ready.svg" alt="icon assesment" />
                  </div>
                  <div>
                    <h4 className="md:mt-2 mb-1.5 text-grey font-medium">Tes Potensi Dasar</h4>
                    <span className="py-1 px-2 inline-block bg-success/20 text-success-600 font-medium text-xs rounded-lg">LOLOS</span>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex-start flex items-center pt-2 md:block md:pt-0">
                  <div className="-ms-[22px] me-3 w-10 h-10 flex items-center justify-center rounded-full bg-neutral-500 border-4 border-neutral-300 md:-mt-[22px] md:me-0 md:ms-0">
                    <img src="https://ojkpcs8pct2.shl.co.id/images/icon-status/ic-assesment-not-ready.svg" alt="icon assesment" />
                  </div>
                  <div>
                    <h4 className="md:mt-2 mb-1.5 text-grey font-medium">Tes Kemampuan Umum</h4>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex-start flex items-center pt-2 md:block md:pt-0">
                  <div className="-ms-[22px] me-3 w-10 h-10 flex items-center justify-center rounded-full bg-neutral-500 border-4 border-neutral-300 md:-mt-[22px] md:me-0 md:ms-0">
                    <img src="https://ojkpcs8pct2.shl.co.id/images/icon-status/ic-assesment-not-ready.svg" alt="icon assesment" />
                  </div>
                  <div>
                    <h4 className="md:mt-2 mb-1.5 text-grey font-medium">Tes Kepribadian & Wawancara Psikolog</h4>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex-start flex items-center pt-2 md:block md:pt-0">
                  <div className="-ms-[22px] me-3 w-10 h-10 flex items-center justify-center rounded-full bg-neutral-500 border-4 border-neutral-300 md:-mt-[22px] md:me-0 md:ms-0">
                    <img src="https://ojkpcs8pct2.shl.co.id/images/icon-status/ic-healt-test-not-ready.svg" alt="icon assesment" />
                  </div>
                  <div>
                    <h4 className="md:mt-2 mb-1.5 text-grey font-medium">Tes Kesehatan</h4>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex-start flex items-center pt-2 md:block md:pt-0">
                  <div className="-ms-[22px] me-3 w-10 h-10 flex items-center justify-center rounded-full bg-neutral-500 border-4 border-neutral-300 md:-mt-[22px] md:me-0 md:ms-0">
                    <img src="https://ojkpcs8pct2.shl.co.id/images/icon-status/ic-user-not-ready.svg" alt="icon wawancara" />
                  </div>
                  <div>
                    <h4 className="md:mt-2 mb-1.5 text-grey font-medium">Wawancara Panel</h4>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex-start flex items-center pt-2 md:block md:pt-0">
                  <div className="-ms-[22px] me-3 w-10 h-10 flex items-center justify-center rounded-full bg-neutral-500 border-4 border-neutral-300 md:-mt-[22px] md:me-0 md:ms-0">
                    <img src="https://ojkpcs8pct2.shl.co.id/images/icon-status/ic-filling-not-ready.svg" alt="icon assesment" />
                  </div>
                  <div>
                    <h4 className="md:mt-2 mb-1.5 text-grey font-medium">Penetapan & Pemberkasan</h4>
                  </div>
                </div>
              </li>
            </ol>
          </div>

          <div className="mt-6 flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-7/12">
              <div className="p-4 lg:p-6 shadow-custom rounded-2xl">
                <h3 className="mb-4 font-semibold text-black text-xl">Tahapan Rekrutmen : Pendidikan Calon Staf (PCS) Angkatan 8</h3>
                <div className="flex flex-col">
                  <div className="relative overflow-x-auto">
                    <table className="min-w-full text-left text-sm font-light text-surface border rounded-2xl">
                      <thead className="border-b border-neutral-200 bg-white font-medium rounded-tl-2xl">
                        <tr>
                          <th scope="col" className="px-6 py-4">Tahapan Rekrutmen</th>
                          <th scope="col" className="px-6 py-4">Estimasi Waktu</th>
                          <th scope="col" className="px-6 py-4">Status</th>
                          <th scope="col" className="px-6 py-4">Tautan Panduan</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-neutral-200 bg-black/[0.02]">
                          <td className="whitespace-nowrap px-6 py-4 font-medium">Pendaftaran</td>
                          <td className="whitespace-nowrap px-6 py-4">3 – 8 Des 2024</td>
                          <td className="whitespace-nowrap px-6 py-4"><span className="py-1 px-2 bg-success/20 text-success-600 font-medium text-xs rounded-lg">LOLOS</span></td>
                          <td className="whitespace-nowrap px-6 py-4"><a href="https://ojkpcs8pct2.shl.co.id/contact-faq" className="text-primary font-semibold lg:hover:text-primary-dark transition-all duration-300 ease-in-out">FAQ</a></td>
                        </tr>
                        <tr className="border-b border-neutral-200 bg-black/[0.02]">
                          <td className="whitespace-wrap px-6 py-4 font-medium">Seleksi Administrasi</td>
                          <td className="whitespace-nowrap px-6 py-4">10 - 11 Des 2024</td>
                          <td className="whitespace-nowrap px-6 py-4"><span className="py-1 px-2 inline-block bg-success/20 text-success-600 font-medium text-xs rounded-lg">LOLOS</span></td>
                          <td className="whitespace-nowrap px-6 py-4"><a href="#" className="text-primary font-semibold lg:hover:text-primary-dark transition-all duration-300 ease-in-out">Link</a></td>
                        </tr>
                        <tr className="border-b border-neutral-200 bg-black/[0.02]">
                          <td className="whitespace-wrap px-6 py-4 font-medium">Tes Potensi Dasar</td>
                          <td className="whitespace-nowrap px-6 py-4">13 - 14 Des 2024</td>
                          <td className="whitespace-nowrap px-6 py-4"><span className="py-1 px-2 inline-block bg-success/20 text-success-600 font-medium text-xs rounded-lg">LOLOS</span></td>
                          <td className="whitespace-nowrap px-6 py-4"></td>
                        </tr>
                        <tr className="border-b border-neutral-200 bg-white">
                          <td className="whitespace-wrap px-6 py-4 font-medium">Tes Kemampuan Umum</td>
                          <td className="whitespace-nowrap px-6 py-4">Minggu Ke-1 Jan 2025</td>
                          <td className="whitespace-nowrap px-6 py-4"></td>
                          <td className="whitespace-nowrap px-6 py-4"><a href="https://ojkpcs8pct2.shl.co.id/lampiran/Panduan_Tes_Kemampuan_Umum_PCS_8.pdf" className="text-primary font-semibold lg:hover:text-primary-dark transition-all duration-300 ease-in-out" target="_blank">Link</a></td>
                        </tr>
                        <tr className="border-b border-neutral-200 bg-black/[0.02]">
                          <td className="whitespace-wrap px-6 py-4 font-medium">Tes Kepribadian & Wawancara Psikolog</td>
                          <td className="whitespace-nowrap px-6 py-4">Minggu Ke-2 Jan s/d Feb 2025</td>
                          <td className="whitespace-nowrap px-6 py-4"></td>
                          <td className="whitespace-nowrap px-6 py-4"><a href="#" className="text-primary font-semibold lg:hover:text-primary-dark transition-all duration-300 ease-in-out">Link</a></td>
                        </tr>
                        <tr className="border-b border-neutral-200 bg-white">
                          <td className="whitespace-wrap px-6 py-4 font-medium">Tes Kesehatan</td>
                          <td className="whitespace-nowrap px-6 py-4">Feb s/d Maret 2025</td>
                          <td className="whitespace-nowrap px-6 py-4"></td>
                          <td className="whitespace-nowrap px-6 py-4"><a href="#" className="text-primary font-semibold lg:hover:text-primary-dark transition-all duration-300 ease-in-out">Link</a></td>
                        </tr>
                        <tr className="border-b border-neutral-200 bg-black/[0.02]">
                          <td className="whitespace-wrap px-6 py-4 font-medium">Wawancara Panel</td>
                          <td className="whitespace-nowrap px-6 py-4">Menunggu Konfirmasi</td>
                          <td className="whitespace-nowrap px-6 py-4"></td>
                          <td className="whitespace-nowrap px-6 py-4"><a href="#" className="text-primary font-semibold lg:hover:text-primary-dark transition-all duration-300 ease-in-out">Link</a></td>
                        </tr>
                        <tr className="border-b border-neutral-200 bg-white">
                          <td className="whitespace-wrap px-6 py-4 font-medium">Penetapan & Pemberkasan</td>
                          <td className="whitespace-nowrap px-6 py-4">Menunggu Konfirmasi</td>
                          <td className="whitespace-nowrap px-6 py-4"></td>
                          <td className="whitespace-nowrap px-6 py-4"><a href="#" className="text-primary font-semibold lg:hover:text-primary-dark transition-all duration-300 ease-in-out">Link</a></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-5/12">
              <div className="p-4 lg:p-6 shadow-custom rounded-2xl">
                <h3 className="mb-4 font-semibold text-black text-xl">Pengumuman Hasil Tes Potensi Dasar Pendidikan Calon Staf (PCS) Angkatan 8 Otoritas Jasa Keuangan (OJK) Tahun 2024</h3>
                <p style={{ marginTop: 20, fontSize: 14, lineHeight: 1.6 }}> <strong>Dengan Hormat Cecep Wahyu Cahyana,</strong></p>
                <p style={{ marginTop: 10, fontSize: 14, lineHeight: 1.6 }}>
                  Berdasarkan penilaian yang dilaksanakan oleh Panitia Rekrutmen Pendidikan Calon Staf (PCS) Angkatan 8 Tahun 2024,
                  Anda dinyatakan <strong>LOLOS</strong> Seleksi Tes Potensi Dasar dan diundang mengikuti tahap seleksi selanjutnya,
                  yaitu Tes Kemampuan Umum secara online dengan keterangan sebagai berikut:
                </p>
                <table style={{ marginLeft: 20, fontSize: 14, lineHeight: 1.6 }}>
                  <tbody>
                    <tr>
                      <td colSpan={2} style={{ paddingBottom: 10 }}>
                        <table style={{ border: '1px solid', marginTop: 10, fontSize: 14, lineHeight: 1.6 }}>
                          <tbody>
                            <tr>
                              <td style={{ border: '1px solid', padding: '5px' }}>
                                {/* ...existing code... */}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
      <FooterCopyright />
      <ScrollToTopButton />
    </div>
  );
}

export default Riwayat;
