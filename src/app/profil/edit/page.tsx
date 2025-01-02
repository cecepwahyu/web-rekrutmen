"use client";

import { useEffect, useState, ChangeEvent } from 'react';
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faTag } from "@fortawesome/free-solid-svg-icons";
import MenuBar from "../../../components/MenuBar";
import FooterCopyright from "../../../components/FooterCopyright";
import FooterSection from "../../../components/FooterSection";
import { ScrollToTopButton } from "../../../components/ScrollToTopButton";
import CariKarirButton from "../../../components/CariKarirButton";
import animation404 from '../../../../public/animations/404.json';
import loadingAnimation from '../../../../public/animations/loading.json';
import LottieAnimation from "../../../components/Animations";
import { toast } from 'sonner'; // Updated import

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

const EditProfil = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [showScrollToTop, setShowScrollToTop] = useState(false);
    const [articles, setArticles] = useState([]); // Articles state
    const [currentPage, setCurrentPage] = useState(0); // Current page starts at 0
    const [totalPages, setTotalPages] = useState(0); // Total pages
    const [isLoading, setIsLoading] = useState(true); // State for loading animation
    const [profileData, setProfileData] = useState({
        idPeserta: "",
        nama: "",
        tempatLahir: "",
        tglLahir: "",
        jnsKelamin: "",
        agama: "",
        alamatIdentitas: "",
        provinsiIdentitas: "",
        kotaIdentitas: "",
        kecamatanIdentitas: "",
        desaIdentitas: "",
        alamatDomisili: "",
        provinsiDomisili: "",
        kotaDomisili: "",
        kecamatanDomisili: "",
        desaDomisili: "",
        telp: "",
        pendidikanTerakhir: "",
        statusKawin: "",
    });

    const [pendidikanData, setPendidikanData] = useState({
        idPendidikan: "",
        idPeserta: "",
        idJenjang: "",
        namaInstitusi: "",
        jurusan: "",
        thnMasuk: "",
        thnLulus: "",
        nilai: "",
        gelar: "",
        achievements: "",
    });

    const [pengalamanData, setPengalamanData] = useState({
        idDataKerja: "",
        idPeserta: "",
        namaInstansi: "",
        posisiKerja: "",
        periodeKerjaStart: "",
        periodeKerjaEnd: "",
        deskripsiKerja: "",
    });

    const [organisasiData, setOrganisasiData] = useState({
        idOrgPeserta: "",
        idPeserta: "",
        namaOrganisasi: "",
        posisiOrganisasi: "",
        periodeStart: "",
        periodeEnd: "",
        deskripsiKerja: "",
    });

    const [kontakData, setKontakData] = useState({
        idKontakPeserta: "",
        idPeserta: "",
        namaKontak: "",
        hubKontak: "",
        telpKontak: "",
        emailKontak: "",
        alamatKontak: "",
    });

    const router = useRouter();

    useEffect(() => {
        const fetchArticle = async () => {
            setIsLoading(true); // Show loading animation
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("No token found in localStorage");
                return; // Exit if no token is found
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/artikel/paginated?page=${currentPage}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        "Authorization": `Bearer ${token}`, // Use token from localStorage
                    },
                });

                const data = await response.json();
                if (data.responseCode === "000") {
                    setArticles(data.data.content); // Set the current page's articles
                    setTotalPages(data.data.totalPages); // Set total pages
                } else {
                    console.error("Error fetching data:", data.message);
                }
            } catch (error) {
                console.error("Error fetching article data:", error);
            } finally {
                setIsLoading(false); // Hide loading animation
            }
        };

        fetchArticle();
    }, [currentPage]); // Re-fetch articles when currentPage changes

    useEffect(() => {
        const fetchProfileData = async () => {
            setIsLoading(true); // Show loading animation
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("No token found in localStorage");
                return; // Exit if no token is found
            }

            const id = await getIdFromToken(token);
            if (!id) {
                console.error("Invalid token");
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        "Authorization": `Bearer ${token}`, // Use token from localStorage
                    },
                });

                const data = await response.json();
                if (data.responseCode === "000") {
                    setProfileData(data.data); // Set profile data
                } else {
                    console.error("Error fetching data:", data.message);
                }
            } catch (error) {
                console.error("Error fetching profile data:", error);
            } finally {
                setIsLoading(false); // Hide loading animation
            }
        };

        fetchProfileData();
    }, []);

    useEffect(() => {
        const fetchPendidikanData = async () => {
            setIsLoading(true); // Show loading animation
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("No token found in localStorage");
                return; // Exit if no token is found
            }

            const id = await getIdFromToken(token);
            if (!id) {
                console.error("Invalid token");
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/pendidikan/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        "Authorization": `Bearer ${token}`, // Use token from localStorage
                    },
                });

                const data = await response.json();
                if (data.responseCode === "000") {
                    setPendidikanData(data.data); // Set profile data
                } else {
                    console.error("Error fetching data:", data.message);
                }
            } catch (error) {
                console.error("Error fetching profile data:", error);
            } finally {
                setIsLoading(false); // Hide loading animation
            }
        };

        fetchPendidikanData();
    }, []);

    useEffect(() => {
        const fetchPengalamanData = async () => {
            setIsLoading(true); // Show loading animation
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("No token found in localStorage");
                return; // Exit if no token is found
            }

            const id = await getIdFromToken(token);
            if (!id) {
                console.error("Invalid token");
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/pengalaman/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                if (data.responseCode === "000") {
                    const pengalaman = data.data;
                    if (pengalaman.periodeKerja && pengalaman.periodeKerja.includes(" to ")) {
                        const [periodeKerjaStart, periodeKerjaEnd] = pengalaman.periodeKerja.split(" to ");
                        setPengalamanData({
                            ...pengalaman,
                            periodeKerjaStart,
                            periodeKerjaEnd,
                        });
                    } else {
                        setPengalamanData(pengalaman);
                    }
                } else {
                    console.error("Error fetching data:", data.message);
                }
            } catch (error) {
                console.error("Error fetching profile data:", error);
            } finally {
                setIsLoading(false); // Hide loading animation
            }
        };

        fetchPengalamanData();
    }, []);

    useEffect(() => {
        const fetchOrganisasiData = async () => {
            setIsLoading(true); // Show loading animation
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("No token found in localStorage");
                return; // Exit if no token is found
            }

            const id = await getIdFromToken(token);
            if (!id) {
                console.error("Invalid token");
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/organisasi/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                if (data.responseCode === "000") {
                    const organisasi = data.data;
                    if (organisasi.periode && organisasi.periode.includes(" to ")) {
                        const [periodeStart, periodeEnd] = organisasi.periode.split(" to ");
                        setOrganisasiData({
                            ...organisasi,
                            periodeStart,
                            periodeEnd,
                        });
                    } else {
                        setOrganisasiData(organisasi);
                    }
                } else {
                    console.error("Error fetching data:", data.message);
                }
            } catch (error) {
                console.error("Error fetching profile data:", error);
            } finally {
                setIsLoading(false); // Hide loading animation
            }
        };

        fetchOrganisasiData();
    }, []);

    useEffect(() => {
        const fetchKontakData = async () => {
            setIsLoading(true); // Show loading animation
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("No token found in localStorage");
                return; // Exit if no token is found
            }

            const id = await getIdFromToken(token);
            if (!id) {
                console.error("Invalid token");
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/kontak/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                if (data.responseCode === "000") {
                    setKontakData(data.data);
                } else {
                    console.error("Error fetching data:", data.message);
                }
            } catch (error) {
                console.error("Error fetching profile data:", error);
            } finally {
                setIsLoading(false); // Hide loading animation
            }
        };

        fetchKontakData();
    }, []);

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

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name in profileData) {
            setProfileData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        } else if (name in pendidikanData) {
            setPendidikanData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        } else if (name in pengalamanData) {
            setPengalamanData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        } else if (name in organisasiData) {
            setOrganisasiData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        } else if (name in kontakData) {
            setKontakData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleSave = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found in localStorage");
            return;
        }
        setIsLoading(true);

        const id = await getIdFromToken(token);
        if (!id) {
            console.error("Invalid token");
            setIsLoading(false);
            return;
        }

        const payload = {
            nama: profileData.nama,
            tempat_lahir: profileData.tempatLahir,
            tgl_lahir: profileData.tglLahir,
            jns_kelamin: profileData.jnsKelamin,
            agama: profileData.agama,
            alamat_identitas: profileData.alamatIdentitas,
            provinsi_identitas: profileData.provinsiIdentitas,
            kota_identitas: profileData.kotaIdentitas,
            kecamatan_identitas: profileData.kecamatanIdentitas,
            desa_identitas: profileData.desaIdentitas,
            alamat_domisili: profileData.alamatDomisili,
            provinsi_domisili: profileData.provinsiDomisili,
            kota_domisili: profileData.kotaDomisili,
            kecamatan_domisili: profileData.kecamatanDomisili,
            desa_domisili: profileData.desaDomisili,
            telp: profileData.telp,
            pendidikan_terakhir: profileData.pendidikanTerakhir,
            status_kawin: profileData.statusKawin, // Directly use the selected value
            id_session: "29348293923", // Example session ID
            flg_status: "2", // Example flag status
            kontak: [
            {
                nama_kontak: kontakData.namaKontak,
                hub_kontak: kontakData.hubKontak,
                telp_kontak: kontakData.telpKontak,
                email_kontak: kontakData.emailKontak,
                alamat_kontak: kontakData.alamatKontak,
            },
            ],
            pesertaPendidikan: [
            {
                id_jenjang: pendidikanData.idJenjang,
                nama_institusi: pendidikanData.namaInstitusi,
                jurusan: pendidikanData.jurusan,
                thn_masuk: pendidikanData.thnMasuk,
                thn_lulus: pendidikanData.thnLulus,
                nilai: pendidikanData.nilai,
                gelar: pendidikanData.gelar,
                achievements: pendidikanData.achievements,
            },
            ],
            pesertaOrganisasi: [
            {
                nama_organisasi: organisasiData.namaOrganisasi,
                posisi_organisasi: organisasiData.posisiOrganisasi,
                periode: `${organisasiData.periodeStart} to ${organisasiData.periodeEnd}`,
                deskripsi_kerja: organisasiData.deskripsiKerja,
            },
            ],
            pesertaPengalaman: [
            {
                nama_instansi: pengalamanData.namaInstansi,
                posisi_kerja: pengalamanData.posisiKerja,
                periode_kerja: `${pengalamanData.periodeKerjaStart} to ${pengalamanData.periodeKerjaEnd}`,
                deskripsi_kerja: pengalamanData.deskripsiKerja,
            },
            ],
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/${id}/edit`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (data.responseCode === "000") {
                toast.success("Data berhasil disimpan.", { style: { backgroundColor: 'white', color: 'green' } });
                router.push("/profil");
            } else {
                toast.error("Gagal menyimpan data: " + data.message, { style: { backgroundColor: 'white', color: 'red' } });
            }
        } catch (error) {
            console.error("Error updating profile data:", error);
            toast.error("Terjadi kesalahan saat menyimpan data.", { style: { backgroundColor: 'white', color: 'red' } });
        } finally {
            setIsLoading(false);
        }
    };

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

                <div className="flex flex-col justify-center items-center w-full bg-white min-h-[400px] relative z-10 -mt-32 px-4 md:px-8 lg:px-16 xl:px-32">
                    <h1 className="text-darkBlue font-semibold text-3xl mt-4 md:mt-2">Edit Profile</h1>
                    <br />
                    {/* <p className="font-sans text-base font-normal leading-relaxed text-gray-800 text-center px-6 md:px-32 lg:px-56">
                        Berikut adalah informasi dan artikel terbaru dari Bank BPD DIY:
                    </p> */}

                    {isLoading ? (
                        <div className="flex justify-center items-center mt-10">
                            <LottieAnimation animationData={loadingAnimation} />
                        </div>
                    ) : (
                        <>
                            <div className="bg-white p-6 rounded-lg shadow-lg w-full">
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="nama">
                                        Nama
                                    </label>
                                    <input
                                        type="text"
                                        id="nama"
                                        name="nama"
                                        value={profileData.nama || ""}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="tempatLahir">
                                        Tempat Lahir
                                    </label>
                                    <input
                                        type="text"
                                        id="tempatLahir"
                                        name="tempatLahir"
                                        value={profileData.tempatLahir || ""}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="tglLahir">
                                        Tanggal Lahir
                                    </label>
                                    <input
                                        type="date"
                                        id="tglLahir"
                                        name="tglLahir"
                                        value={profileData.tglLahir || ""}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="jnsKelamin">
                                        Jenis Kelamin
                                    </label>
                                    <select
                                        id="jnsKelamin"
                                        name="jnsKelamin"
                                        value={profileData.jnsKelamin || ""}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                    >
                                        <option value="">Pilih Jenis Kelamin</option>
                                        <option value="1">PRIA</option>
                                        <option value="2">WANITA</option>
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="agama">
                                        Agama
                                    </label>
                                    <select
                                        id="agama"
                                        name="agama"
                                        value={profileData.agama || ""}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                    >
                                        <option value="">Pilih Agama</option>
                                        <option value="1">ISLAM</option>
                                        <option value="2">KRISTEN</option>
                                        <option value="3">KATOLIK</option>
                                        <option value="4">HINDU</option>
                                        <option value="5">BUDHA</option>
                                        <option value="6">KONGHUCU</option>
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="telp">
                                        No Telepon
                                    </label>
                                    <input
                                        type="text"
                                        id="telp"
                                        name="telp"
                                        value={profileData.telp || ""}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="pendidikanTerakhir">
                                        Pendidikan Terakhir
                                    </label>
                                    <select
                                        id="pendidikanTerakhir"
                                        name="pendidikanTerakhir"
                                        value={profileData.pendidikanTerakhir || ""}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                    >
                                        <option value="">Pilih Pendidikan Terakhir</option>
                                        <option value="4">S1</option>
                                        <option value="5">S2</option>
                                        <option value="6">S3</option>
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="statusKawin">
                                        Status Kawin
                                    </label>
                                    <select
                                        id="statusKawin"
                                        name="statusKawin"
                                        value={profileData.statusKawin || ""}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                    >
                                        <option value="">Pilih Status Kawin</option>
                                        <option value="1">LAJANG</option>
                                        <option value="2">MENIKAH</option>
                                    </select>

                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="alamatIdentitas">
                                        Alamat Identitas
                                    </label>
                                    <input
                                        type="text"
                                        id="alamatIdentitas"
                                        name="alamatIdentitas"
                                        value={profileData.alamatIdentitas || ""}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="provinsiIdentitas">
                                        Provinsi Identitas
                                    </label>
                                    <input
                                        type="text"
                                        id="provinsiIdentitas"
                                        name="provinsiIdentitas"
                                        value={profileData.provinsiIdentitas || ""}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="kotaIdentitas">
                                        Kota Identitas
                                    </label>
                                    <input
                                        type="text"
                                        id="kotaIdentitas"
                                        name="kotaIdentitas"
                                        value={profileData.kotaIdentitas || ""}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="kecamatanIdentitas">
                                        Kecamatan Identitas
                                    </label>
                                    <input
                                        type="text"
                                        id="kecamatanIdentitas"
                                        name="kecamatanIdentitas"
                                        value={profileData.kecamatanIdentitas || ""}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="desaIdentitas">
                                        Desa Identitas
                                    </label>
                                    <input
                                        type="text"
                                        id="desaIdentitas"
                                        name="desaIdentitas"
                                        value={profileData.desaIdentitas || ""}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="alamatDomisili">
                                        Alamat Domisili
                                    </label>
                                    <input
                                        type="text"
                                        id="alamatDomisili"
                                        name="alamatDomisili"
                                        value={profileData.alamatDomisili || ""}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="provinsiDomisili">
                                        Provinsi Domisili
                                    </label>
                                    <input
                                        type="text"
                                        id="provinsiDomisili"
                                        name="provinsiDomisili"
                                        value={profileData.provinsiDomisili || ""}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="kotaDomisili">
                                        Kabupaten/Kota Domisili
                                    </label>
                                    <input
                                        type="text"
                                        id="kotaDomisili"
                                        name="kotaDomisili"
                                        value={profileData.kotaDomisili || ""}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="kecamatanDomisili">
                                        Kecamatan Domisili
                                    </label>
                                    <input
                                        type="text"
                                        id="kecamatanDomisili"
                                        name="kecamatanDomisili"
                                        value={profileData.kecamatanDomisili || ""}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                    />
                                </div>

                                <div className="mb-8">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="desaDomisili">
                                        Desa Domisili
                                    </label>
                                    <input
                                        type="text"
                                        id="desaDomisili"
                                        name="desaDomisili"
                                        value={profileData.desaDomisili || ""}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-wrap mt-10 w-full">
                                <div className="w-full md:w-1/2 px-4">
                                    <div className="bg-white p-6 rounded-lg shadow-lg w-full">
                                        <div className="mb-4">
                                            <label className="block text-darkBlue font-bold mb-2" htmlFor="pengalamanKerja">
                                                PENGALAMAN KERJA
                                            </label>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor="namaInstansi">
                                                Nama Perusahaan / Instansi
                                            </label>
                                            <input
                                                type="text"
                                                id="namaInstansi"
                                                name="namaInstansi"
                                                value={pengalamanData.namaInstansi || ""}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor="posisiKerja">
                                                Posisi / Jabatan
                                            </label>
                                            <input
                                                type="text"
                                                id="posisiKerja"
                                                name="posisiKerja"
                                                value={pengalamanData.posisiKerja || ""}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor="periodeKerja">
                                                Tanggal Mulai Bekerja
                                            </label>
                                            <input
                                                type="date"
                                                id="periodeKerjaStart"
                                                name="periodeKerjaStart"
                                                value={pengalamanData.periodeKerjaStart || ""}
                                                onChange={handleChange}
                                                className="w-full mb-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                            />
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor="periodeKerja">
                                                Tanggal Akhir Bekerja
                                            </label>
                                            <input
                                                type="date"
                                                id="periodeKerjaEnd"
                                                name="periodeKerjaEnd"
                                                value={pengalamanData.periodeKerjaEnd || ""}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring mt-2"
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor="deskripsiKerja">
                                                Deskripsi Pekerjaan
                                            </label>
                                            <textarea
                                                id="deskripsiKerja"
                                                name="deskripsiKerja"
                                                value={pengalamanData.deskripsiKerja || ""}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2 px-4">
                                    <div className="bg-white p-6 rounded-lg shadow-lg w-full">
                                        <div className="mb-4">
                                            <label className="block text-darkBlue font-bold mb-2" htmlFor="pengalamanOrganisasi">
                                                PENGALAMAN ORGANISASI
                                            </label>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor="namaOrganisasi">
                                                Nama Organisasi
                                            </label>
                                            <input
                                                type="text"
                                                id="namaOrganisasi"
                                                name="namaOrganisasi"
                                                value={organisasiData.namaOrganisasi || ""}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor="posisiOrganisasi">
                                                Posisi / Jabatan
                                            </label>
                                            <input
                                                type="text"
                                                id="posisiOrganisasi"
                                                name="posisiOrganisasi"
                                                value={organisasiData.posisiOrganisasi || ""}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor="periode">
                                                Tanggal Awal Menjabat
                                            </label>
                                            <input
                                                type="date"
                                                id="periodeStart"
                                                name="periodeStart"
                                                value={organisasiData.periodeStart || ""}
                                                onChange={handleChange}
                                                className="w-full mb-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                            />
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor="periode">
                                                Tanggal Akhir Menjabat
                                            </label>
                                            <input
                                                type="date"
                                                id="periodeEnd"
                                                name="periodeEnd"
                                                value={organisasiData.periodeEnd || ""}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring mt-2"
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor="deskripsiKerja">
                                                Deskripsi Kegiatan
                                            </label>
                                            <textarea
                                                id="deskripsiKerja"
                                                name="deskripsiKerja"
                                                value={organisasiData.deskripsiKerja || ""}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap -mx-4 mt-10 w-full">
                                <div className="w-full md:w-1/2 px-4">
                                    <div className="bg-white p-6 rounded-lg shadow-lg w-full">
                                        <div className="mb-4">
                                            <label className="block text-darkBlue font-bold mb-2" htmlFor="pendidikan">
                                                PENDIDIKAN
                                            </label>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor="namaInstitusi">
                                                Universitas
                                            </label>
                                            <input
                                                type="text"
                                                id="namaInstitusi"
                                                name="namaInstitusi"
                                                value={pendidikanData.namaInstitusi || ""}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor="jurusan">
                                                Jurusan
                                            </label>
                                            <input
                                                type="text"
                                                id="jurusan"
                                                name="jurusan"
                                                value={pendidikanData.jurusan || ""}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor="thnMasuk">
                                                Tahun Masuk
                                            </label>
                                            <input
                                                type="text"
                                                id="thnMasuk"
                                                name="thnMasuk"
                                                value={pendidikanData.thnMasuk || ""}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                pattern="\d{4}"
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor="thnLulus">
                                                Tahun Lulus
                                            </label>
                                            <input
                                                type="text"
                                                id="thnLulus"
                                                name="thnLulus"
                                                value={pendidikanData.thnLulus || ""}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor="nilai">
                                                Nilai
                                            </label>
                                            <input
                                                type="text"
                                                id="nilai"
                                                name="nilai"
                                                value={pendidikanData.nilai || ""}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor="gelar">
                                                Gelar
                                            </label>
                                            <input
                                                type="text"
                                                id="gelar"
                                                name="gelar"
                                                value={pendidikanData.gelar || ""}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                            />
                                        </div>

                                        <div className="mb-8">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor="achievements">
                                                Penghargaan
                                            </label>
                                            <textarea
                                                id="achievements"
                                                name="achievements"
                                                value={pendidikanData.achievements || ""}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2 px-4">
                                    <div className="bg-white p-6 rounded-lg shadow-lg w-full">
                                        <div className="mb-4">
                                            <label className="block text-darkBlue font-bold mb-2" htmlFor="kontakKerabat">
                                                KONTAK KERABAT
                                            </label>
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor="namaKontak">
                                                Nama Kontak
                                            </label>
                                            <input
                                                type="text"
                                                id="namaKontak"
                                                name="namaKontak"
                                                value={kontakData.namaKontak || ""}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor="hubKontak">
                                                Hubungan Kerabat
                                            </label>
                                            <input
                                                type="text"
                                                id="hubKontak"
                                                name="hubKontak"
                                                value={kontakData.hubKontak || ""}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor="telpKontak">
                                                No Telepon
                                            </label>
                                            <input
                                                type="text"
                                                id="telpKontak"
                                                name="telpKontak"
                                                value={kontakData.telpKontak || ""}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                pattern="\d{4}"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor="emailKontak">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                id="emailKontak"
                                                name="emailKontak"
                                                value={kontakData.emailKontak || ""}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                pattern="\d{4}"
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor="alamatKontak">
                                                Alamat
                                            </label>
                                            <textarea
                                                id="alamatKontak"
                                                name="alamatKontak"
                                                value={kontakData.alamatKontak || ""}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end mt-8">
                                <button
                                    onClick={handleSave}
                                    className="bg-darkBlue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                                >
                                    Simpan
                                </button>
                            </div>
                        </>
                    )}
                    
                    <br />
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

export default EditProfil;
