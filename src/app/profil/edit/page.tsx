"use client";

import { useEffect, useState, ChangeEvent } from 'react';
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faTag, faPlus, faTrash, faUser, faGraduationCap, faBriefcase, faUsers, faAddressBook } from "@fortawesome/free-solid-svg-icons";
import MenuBar from "../../../components/MenuBar";
import FooterCopyright from "../../../components/FooterCopyright";
import FooterSection from "../../../components/FooterSection";
import { ScrollToTopButton } from "../../../components/ScrollToTopButton";
import CariKarirButton from "../../../components/CariKarirButton";
import loadingAnimation from '../../../../public/animations/loading.json';
import LottieAnimation from "../../../components/Animations";
import { toast } from 'sonner'; // Updated import
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './custom-tabs.css'; // Import custom CSS for tabs

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
        sertifikat: "",
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

    const [pendidikanList, setPendidikanList] = useState([pendidikanData]);
    const [pengalamanList, setPengalamanList] = useState([pengalamanData]);
    const [organisasiList, setOrganisasiList] = useState([organisasiData]);
    const [kontakList, setKontakList] = useState([kontakData]);

    const router = useRouter();
    const [activeTab, setActiveTab] = useState(0); // State to track active tab

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
                    //setPendidikanList(data.data.pesertaPendidikan || []);
                    //setPengalamanList(data.data.pesertaPengalaman || []);
                    //setOrganisasiList(data.data.pesertaOrganisasi || []);
                    //setKontakList(data.data.kontak || []);
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
                    const pendidikan = Array.isArray(data.data) ? data.data : [data.data];
                    setPendidikanList(pendidikan);
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

    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        const [year, month, day] = dateString.split("-");
        const formattedDate = `${year}-${month}-${day}`;
        console.log("Formatted Date:", formattedDate);
        return formattedDate;
    };

    const parseDateRange = (dateRange: string) => {
        if (!dateRange) return { start: "", end: "" };
        const [start, end] = dateRange.split(" to ");
        const parsedRange = {
            start: formatDate(start),
            end: formatDate(end),
        };
        console.log("Parsed Date Range:", parsedRange);
        return parsedRange;
    };

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
                    const pengalaman = Array.isArray(data.data) ? data.data : [data.data];
                    const formattedPengalaman = pengalaman.map((exp: Pengalaman) => {
                        const { start, end } = parseDateRange(exp.periodeKerja);
                        return {
                            ...exp,
                            periodeKerjaStart: start,
                            periodeKerjaEnd: end,
                        };
                    });
                    console.log("Formatted Pengalaman:", formattedPengalaman);
                    setPengalamanList(formattedPengalaman);
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
        console.log("Updated pengalamanList:", pengalamanList);
    }, [pengalamanList]);

    useEffect(() => {
        console.log("Updated organisasiList:", organisasiList);
    }, [organisasiList]);

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
                    const organisasi = Array.isArray(data.data) ? data.data : [data.data];
                    const formattedOrganisasi = organisasi.map((org: Organisasi) => {
                        const { start, end } = parseDateRange(org.periode);
                        return {
                            ...org,
                            periodeStart: start,
                            periodeEnd: end,
                        };
                    });
                    console.log("Formatted Organisasi:", formattedOrganisasi);
                    setOrganisasiList(formattedOrganisasi);
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
                    const kontak = Array.isArray(data.data) ? data.data : [data.data];
                    setKontakList(kontak);
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

    const handleAddEntry = (type: string) => {
        if (type === "pendidikan") {
            setPendidikanList([...pendidikanList, pendidikanData]);
        } else if (type === "pengalaman") {
            setPengalamanList([...pengalamanList, pengalamanData]);
        } else if (type === "organisasi") {
            setOrganisasiList([...organisasiList, organisasiData]);
        } else if (type === "kontak") {
            setKontakList([...kontakList, kontakData]);
        }
    };

    const handleRemoveEntry = (type: string, index: number) => {
        if (type === "pendidikan") {
            setPendidikanList(pendidikanList.filter((_, i) => i !== index));
        } else if (type === "pengalaman") {
            setPengalamanList(pengalamanList.filter((_, i) => i !== index));
        } else if (type === "organisasi") {
            setOrganisasiList(organisasiList.filter((_, i) => i !== index));
        } else if (type === "kontak") {
            setKontakList(kontakList.filter((_, i) => i !== index));
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, index: number, type: string) => {
        const { name, value } = e.target;
        if (type === "profile") {
            setProfileData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        } else if (type === "pendidikan") {
            const updatedList = [...pendidikanList];
            updatedList[index] = { ...updatedList[index], [name]: value };
            setPendidikanList(updatedList);
        } else if (type === "pengalaman") {
            const updatedList = [...pengalamanList];
            updatedList[index] = { ...updatedList[index], [name]: value };
            setPengalamanList(updatedList);
        } else if (type === "organisasi") {
            const updatedList = [...organisasiList];
            updatedList[index] = { ...updatedList[index], [name]: value };
            setOrganisasiList(updatedList);
        } else if (type === "kontak") {
            const updatedList = [...kontakList];
            updatedList[index] = { ...updatedList[index], [name]: value };
            setKontakList(updatedList);
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

        const formatDateRange = (start: string, end: string) => `${start} to ${end}`;

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
            status_kawin: profileData.statusKawin,
            id_session: "29348293923",
            flg_status: "2",
            kontak: kontakList.map(kontak => ({
                nama_kontak: kontak.namaKontak,
                hub_kontak: kontak.hubKontak,
                telp_kontak: kontak.telpKontak,
                email_kontak: kontak.emailKontak,
                alamat_kontak: kontak.alamatKontak,
            })),
            pesertaPendidikan: pendidikanList.map(pendidikan => ({
                id_jenjang: pendidikan.idJenjang,
                nama_institusi: pendidikan.namaInstitusi,
                jurusan: pendidikan.jurusan,
                thn_masuk: pendidikan.thnMasuk,
                thn_lulus: pendidikan.thnLulus,
                nilai: pendidikan.nilai,
                gelar: pendidikan.gelar,
                achievements: pendidikan.achievements,
            })),
            pesertaOrganisasi: organisasiList.map(org => ({
                nama_organisasi: org.namaOrganisasi,
                posisi_organisasi: org.posisiOrganisasi,
                periode: formatDateRange(org.periodeStart, org.periodeEnd),
                deskripsi_kerja: org.deskripsiKerja,
                sertifikat: org.sertifikat,
            })),
            pesertaPengalaman: pengalamanList.map(exp => ({
                nama_instansi: exp.namaInstansi,
                posisi_kerja: exp.posisiKerja,
                periode_kerja: formatDateRange(exp.periodeKerjaStart, exp.periodeKerjaEnd),
                deskripsi_kerja: exp.deskripsiKerja,
            })),
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
                const errorMessage = data.data ? data.data : data.message;
                toast.error(`Gagal menyimpan data: ${errorMessage}`, { style: { backgroundColor: 'white', color: 'red' } });
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
            <main className="pt-64 bg-gradient-to-r from-[#015CAC] to-[#018ED2] relative z-10">
                {/* <div className="bg-white relative z-10">
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
                </div> */}

                <div className="flex flex-col justify-center items-center w-full bg-white min-h-[400px] relative z-10 -mt-32 px-4 pt-16 md:px-8 lg:px-16 xl:px-32">
                    <h1 className="text-darkBlue font-semibold text-3xl mt-4 md:mt-2">Edit Profile</h1>
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mt-4 flex justify-between items-center" role="alert">
                        <div>
                            <p className="font-bold">Perhatian</p>
                            <p>Anda diwajibkan untuk melengkapi data diri Anda untuk dapat melamar pekerjaan.</p>
                        </div>
                        <button onClick={() => {
                            const alertBox = document.querySelector('.bg-yellow-100');
                            if (alertBox) {
                                (alertBox as HTMLElement).style.display = 'none';
                            }
                        }} className="text-yellow-700 font-bold ml-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    <br />
                    {isLoading ? (
                        <div className="flex justify-center items-center mt-10">
                            <LottieAnimation animationData={loadingAnimation} />
                        </div>
                    ) : (
                        <Tabs selectedIndex={activeTab} onSelect={(index) => setActiveTab(index)}>
                            <TabList className="flex justify-center mb-4 custom-tab-list">
                                <Tab className={`px-4 py-2 mx-2 rounded-lg cursor-pointer custom-tab ${activeTab === 0 ? 'bg-darkBlue text-white' : 'bg-gray-200 text-darkBlue'}`} selectedClassName="custom-tab-selected">
                                    <FontAwesomeIcon icon={faUser} className="mr-2" /> Informasi Personal
                                </Tab>
                                <Tab className={`px-4 py-2 mx-2 rounded-lg cursor-pointer custom-tab ${activeTab === 1 ? 'bg-darkBlue text-white' : 'bg-gray-200 text-darkBlue'}`} selectedClassName="custom-tab-selected">
                                    <FontAwesomeIcon icon={faGraduationCap} className="mr-2" /> Pendidikan
                                </Tab>
                                <Tab className={`px-4 py-2 mx-2 rounded-lg cursor-pointer custom-tab ${activeTab === 2 ? 'bg-darkBlue text-white' : 'bg-gray-200 text-darkBlue'}`} selectedClassName="custom-tab-selected">
                                    <FontAwesomeIcon icon={faBriefcase} className="mr-2" /> Pengalaman
                                </Tab>
                                <Tab className={`px-4 py-2 mx-2 rounded-lg cursor-pointer custom-tab ${activeTab === 3 ? 'bg-darkBlue text-white' : 'bg-gray-200 text-darkBlue'}`} selectedClassName="custom-tab-selected">
                                    <FontAwesomeIcon icon={faUsers} className="mr-2" /> Organisasi
                                </Tab>
                                <Tab className={`px-4 py-2 mx-2 rounded-lg cursor-pointer custom-tab ${activeTab === 4 ? 'bg-darkBlue text-white' : 'bg-gray-200 text-darkBlue'}`} selectedClassName="custom-tab-selected">
                                    <FontAwesomeIcon icon={faAddressBook} className="mr-2" /> Kontak
                                </Tab>
                            </TabList>

                            <TabPanel>
                                <div className="bg-white p-6 rounded-lg shadow-lg w-full">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor="nama">
                                                Nama <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="nama"
                                                name="nama"
                                                value={profileData.nama || ""}
                                                onChange={(e) => handleChange(e, 0, "profile")}
                                                placeholder="Masukkan Nama"
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor="tempatLahir">
                                                Tempat Lahir <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="tempatLahir"
                                                name="tempatLahir"
                                                value={profileData.tempatLahir || ""}
                                                onChange={(e) => handleChange(e, 0, "profile")}
                                                placeholder="Masukkan Tempat Lahir"
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor="tglLahir">
                                                Tanggal Lahir <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                id="tglLahir"
                                                name="tglLahir"
                                                value={profileData.tglLahir || ""}
                                                onChange={(e) => handleChange(e, 0, "profile")}
                                                placeholder="Masukkan Tanggal Lahir"
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor="jnsKelamin">
                                                Jenis Kelamin <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                id="jnsKelamin"
                                                name="jnsKelamin"
                                                value={profileData.jnsKelamin || ""}
                                                onChange={(e) => handleChange(e, 0, "profile")}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                            >
                                                <option value="">Pilih Jenis Kelamin</option>
                                                <option value="1">PRIA</option>
                                                <option value="2">WANITA</option>
                                            </select>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor="agama">
                                                Agama <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                id="agama"
                                                name="agama"
                                                value={profileData.agama || ""}
                                                onChange={(e) => handleChange(e, 0, "profile")}
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
                                                No Telepon <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="telp"
                                                name="telp"
                                                value={profileData.telp || ""}
                                                onChange={(e) => handleChange(e, 0, "profile")}
                                                placeholder="Masukkan No Telepon"
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor="pendidikanTerakhir">
                                                Pendidikan Terakhir <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                id="pendidikanTerakhir"
                                                name="pendidikanTerakhir"
                                                value={profileData.pendidikanTerakhir || ""}
                                                onChange={(e) => handleChange(e, 0, "profile")}
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
                                                Status Kawin <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                id="statusKawin"
                                                name="statusKawin"
                                                value={profileData.statusKawin || ""}
                                                onChange={(e) => handleChange(e, 0, "profile")}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                            >
                                                <option value="">Pilih Status Kawin</option>
                                                <option value="1">LAJANG</option>
                                                <option value="2">MENIKAH</option>
                                            </select>

                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor="alamatIdentitas">
                                                Alamat Identitas <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="alamatIdentitas"
                                                name="alamatIdentitas"
                                                value={profileData.alamatIdentitas || ""}
                                                onChange={(e) => handleChange(e, 0, "profile")}
                                                placeholder="Masukkan Alamat Identitas"
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor="provinsiIdentitas">
                                                Provinsi Identitas <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="provinsiIdentitas"
                                                name="provinsiIdentitas"
                                                value={profileData.provinsiIdentitas || ""}
                                                onChange={(e) => handleChange(e, 0, "profile")}
                                                placeholder="Masukkan Provinsi Identitas"
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor="kotaIdentitas">
                                                Kota Identitas <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="kotaIdentitas"
                                                name="kotaIdentitas"
                                                value={profileData.kotaIdentitas || ""}
                                                onChange={(e) => handleChange(e, 0, "profile")}
                                                placeholder="Masukkan Kota Identitas"
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor="kecamatanIdentitas">
                                                Kecamatan Identitas <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="kecamatanIdentitas"
                                                name="kecamatanIdentitas"
                                                value={profileData.kecamatanIdentitas || ""}
                                                onChange={(e) => handleChange(e, 0, "profile")}
                                                placeholder="Masukkan Kecamatan Identitas"
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor="desaIdentitas">
                                                Desa Identitas <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="desaIdentitas"
                                                name="desaIdentitas"
                                                value={profileData.desaIdentitas || ""}
                                                onChange={(e) => handleChange(e, 0, "profile")}
                                                placeholder="Masukkan Desa Identitas"
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor="alamatDomisili">
                                                Alamat Domisili <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="alamatDomisili"
                                                name="alamatDomisili"
                                                value={profileData.alamatDomisili || ""}
                                                onChange={(e) => handleChange(e, 0, "profile")}
                                                placeholder="Masukkan Alamat Domisili"
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor="provinsiDomisili">
                                                Provinsi Domisili <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="provinsiDomisili"
                                                name="provinsiDomisili"
                                                value={profileData.provinsiDomisili || ""}
                                                onChange={(e) => handleChange(e, 0, "profile")}
                                                placeholder="Masukkan Provinsi Domisili"
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor="kotaDomisili">
                                                Kabupaten/Kota Domisili <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="kotaDomisili"
                                                name="kotaDomisili"
                                                value={profileData.kotaDomisili || ""}
                                                onChange={(e) => handleChange(e, 0, "profile")}
                                                placeholder="Masukkan Kabupaten/Kota Domisili"
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor="kecamatanDomisili">
                                                Kecamatan Domisili <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="kecamatanDomisili"
                                                name="kecamatanDomisili"
                                                value={profileData.kecamatanDomisili || ""}
                                                onChange={(e) => handleChange(e, 0, "profile")}
                                                placeholder="Masukkan Kecamatan Domisili"
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                            />
                                        </div>

                                        <div className="mb-8">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor="desaDomisili">
                                                Desa Domisili <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="desaDomisili"
                                                name="desaDomisili"
                                                value={profileData.desaDomisili || ""}
                                                onChange={(e) => handleChange(e, 0, "profile")}
                                                placeholder="Masukkan Desa Domisili"
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                            />
                                        </div>
                                    </div>
                                    <p className="mt-4">
                                        Kolom dengan tanda (<span className="text-red-500">*</span>) wajib untuk diisi
                                    </p>
                                </div>
                            </TabPanel>

                            <TabPanel>
                                <div className="bg-white p-6 rounded-lg shadow-lg w-full">
                                    <div className="mb-4 flex justify-between items-center">
                                        <label className="block text-darkBlue font-bold mb-2" htmlFor="pendidikan">
                                            PENDIDIKAN <span className="text-red-500">*</span>
                                        </label>
                                        <button onClick={() => handleAddEntry("pendidikan")} className="text-blue-500">
                                            <FontAwesomeIcon icon={faPlus} />
                                        </button>
                                    </div>
                                    {pendidikanList.map((pendidikan, index) => (
                                        <div key={index} className="mb-4 border-b pb-4">
                                            <div className="flex justify-between items-center">
                                                <label className="block text-gray-700 font-bold mb-2" htmlFor="idJenjang">
                                                    Jenjang <span className="text-red-500">*</span>
                                                </label>
                                                <button onClick={() => handleRemoveEntry("pendidikan", index)} className="text-red-500">
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </div>
                                            <select
                                                id="idJenjang"
                                                name="idJenjang"
                                                value={pendidikan.idJenjang || ""}
                                                onChange={(e) => handleChange(e, index, "pendidikan")}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                            >
                                                <option value="">Pilih Jenjang</option>
                                                <option value="1">SD</option>
                                                <option value="2">SMP</option>
                                                <option value="3">SMA</option>
                                                <option value="4">S1</option>
                                                <option value="5">S2</option>
                                                <option value="6">S3</option>
                                            </select>
                                            <div className="mb-4">
                                                <label className="block text-gray-700 font-bold mb-2" htmlFor="namaInstitusi">
                                                    Universitas <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="namaInstitusi"
                                                    name="namaInstitusi"
                                                    value={pendidikan.namaInstitusi || ""}
                                                    onChange={(e) => handleChange(e, index, "pendidikan")}
                                                    placeholder="Masukkan Nama Institusi"
                                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="block text-gray-700 font-bold mb-2" htmlFor="jurusan">
                                                    Jurusan <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="jurusan"
                                                    name="jurusan"
                                                    value={pendidikan.jurusan || ""}
                                                    onChange={(e) => handleChange(e, index, "pendidikan")}
                                                    placeholder="Masukkan Jurusan"
                                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                />
                                            </div>

                                            <div className="mb-4">
                                                <label className="block text-gray-700 font-bold mb-2" htmlFor="thnMasuk">
                                                    Tahun Masuk <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="thnMasuk"
                                                    name="thnMasuk"
                                                    value={pendidikan.thnMasuk || ""}
                                                    onChange={(e) => handleChange(e, index, "pendidikan")}
                                                    placeholder="Masukkan Tahun Masuk"
                                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                    pattern="\d{4}"
                                                />
                                            </div>

                                            <div className="mb-4">
                                                <label className="block text-gray-700 font-bold mb-2" htmlFor="thnLulus">
                                                    Tahun Lulus <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="thnLulus"
                                                    name="thnLulus"
                                                    value={pendidikan.thnLulus || ""}
                                                    onChange={(e) => handleChange(e, index, "pendidikan")}
                                                    placeholder="Masukkan Tahun Lulus"
                                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                />
                                            </div>

                                            <div className="mb-4">
                                                <label className="block text-gray-700 font-bold mb-2" htmlFor="nilai">
                                                    Nilai <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="nilai"
                                                    name="nilai"
                                                    value={pendidikan.nilai || ""}
                                                    onChange={(e) => handleChange(e, index, "pendidikan")}
                                                    placeholder="Masukkan Nilai"
                                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                />
                                            </div>

                                            <div className="mb-4">
                                                <label className="block text-gray-700 font-bold mb-2" htmlFor="gelar">
                                                    Gelar <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="gelar"
                                                    name="gelar"
                                                    value={pendidikan.gelar || ""}
                                                    onChange={(e) => handleChange(e, index, "pendidikan")}
                                                    placeholder="Masukkan Gelar"
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
                                                    value={pendidikan.achievements || ""}
                                                    onChange={(e) => handleChange(e, index, "pendidikan")}
                                                    placeholder="Masukkan Penghargaan"
                                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    <p className="mt-4">
                                        Kolom dengan tanda (<span className="text-red-500">*</span>) wajib untuk diisi
                                    </p>
                                </div>
                            </TabPanel>

                            <TabPanel>
                                <div className="bg-white p-6 rounded-lg shadow-lg w-full">
                                    <div className="mb-4 flex justify-between items-center">
                                        <label className="block text-darkBlue font-bold mb-2" htmlFor="pengalamanKerja">
                                            PENGALAMAN KERJA <span className="text-red-500">*</span>
                                        </label>
                                        <button onClick={() => handleAddEntry("pengalaman")} className="text-blue-500">
                                            <FontAwesomeIcon icon={faPlus} />
                                        </button>
                                    </div>
                                    {pengalamanList.map((pengalaman, index) => (
                                        <div key={index} className="mb-4 border-b pb-4">
                                            <div className="flex justify-between items-center">
                                                <label className="block text-gray-700 font-bold mb-2" htmlFor="namaInstansi">
                                                    Nama Perusahaan / Instansi <span className="text-red-500">*</span>
                                                </label>
                                                <button onClick={() => handleRemoveEntry("pengalaman", index)} className="text-red-500">
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </div>
                                            <input
                                                type="text"
                                                id="namaInstansi"
                                                name="namaInstansi"
                                                value={pengalaman.namaInstansi || ""}
                                                onChange={(e) => handleChange(e, index, "pengalaman")}
                                                placeholder="Masukkan Nama Instansi"
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                            />
                                            <div className="mb-4">
                                                <label className="block text-gray-700 font-bold mb-2" htmlFor="posisiKerja">
                                                    Posisi / Jabatan <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="posisiKerja"
                                                    name="posisiKerja"
                                                    value={pengalaman.posisiKerja || ""}
                                                    onChange={(e) => handleChange(e, index, "pengalaman")}
                                                    placeholder="Masukkan Posisi Kerja"
                                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                />
                                            </div>

                                            <div className="mb-4">
                                                <label className="block text-gray-700 font-bold mb-2" htmlFor="periodeKerjaStart">
                                                    Tanggal Mulai Bekerja <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="date"
                                                    id="periodeKerjaStart"
                                                    name="periodeKerjaStart"
                                                    value={pengalaman.periodeKerjaStart || ""}
                                                    onChange={(e) => handleChange(e, index, "pengalaman")}
                                                    placeholder="Masukkan Tanggal Mulai Bekerja"
                                                    className="w-full mb-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                />
                                                <label className="block text-gray-700 font-bold mb-2" htmlFor="periodeKerjaEnd">
                                                    Tanggal Akhir Bekerja <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="date"
                                                    id="periodeKerjaEnd"
                                                    name="periodeKerjaEnd"
                                                    value={pengalaman.periodeKerjaEnd || ""}
                                                    onChange={(e) => handleChange(e, index, "pengalaman")}
                                                    placeholder="Masukkan Tanggal Akhir Bekerja"
                                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring mt-2"
                                                />
                                            </div>

                                            <div className="mb-4">
                                                <label className="block text-gray-700 font-bold mb-2" htmlFor="deskripsiKerja">
                                                    Deskripsi Pekerjaan <span className="text-red-500">*</span>
                                                </label>
                                                <textarea
                                                    id="deskripsiKerja"
                                                    name="deskripsi_kerja"
                                                    value={pengalaman.deskripsiKerja || ""}
                                                    onChange={(e) => handleChange(e, index, "pengalaman")}
                                                    placeholder="Masukkan Deskripsi Pekerjaan"
                                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    <p className="mt-4">
                                        Kolom dengan tanda (<span className="text-red-500">*</span>) wajib untuk diisi
                                    </p>
                                </div>
                            </TabPanel>

                            <TabPanel>
                                <div className="bg-white p-6 rounded-lg shadow-lg w-full">
                                    <div className="mb-4 flex justify-between items-center">
                                        <label className="block text-darkBlue font-bold mb-2" htmlFor="organisasi">
                                            ORGANISASI <span className="text-red-500">*</span>
                                        </label>
                                        <button onClick={() => handleAddEntry("organisasi")} className="text-blue-500">
                                            <FontAwesomeIcon icon={faPlus} />
                                        </button>
                                    </div>
                                    {organisasiList.map((organisasi, index) => (
                                        <div key={index} className="mb-4 border-b pb-4">
                                            <div className="flex justify-between items-center">
                                                <label className="block text-gray-700 font-bold mb-2" htmlFor="namaOrganisasi">
                                                    Nama Organisasi <span className="text-red-500">*</span>
                                                </label>
                                                <button onClick={() => handleRemoveEntry("organisasi", index)} className="text-red-500">
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </div>
                                            <input
                                                type="text"
                                                id="namaOrganisasi"
                                                name="namaOrganisasi"
                                                value={organisasi.namaOrganisasi || ""}
                                                onChange={(e) => handleChange(e, index, "organisasi")}
                                                placeholder="Masukkan Nama Organisasi"
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                            />
                                            <div className="mb-4">
                                                <label className="block text-gray-700 font-bold mb-2" htmlFor="posisiOrganisasi">
                                                    Posisi <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="posisiOrganisasi"
                                                    name="posisiOrganisasi"
                                                    value={organisasi.posisiOrganisasi || ""}
                                                    onChange={(e) => handleChange(e, index, "organisasi")}
                                                    placeholder="Masukkan Posisi Organisasi"
                                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                />
                                            </div>

                                            <div className="mb-4">
                                                <label className="block text-gray-700 font-bold mb-2" htmlFor="periodeStart">
                                                    Tanggal Mulai <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="date"
                                                    id="periodeStart"
                                                    name="periodeStart"
                                                    value={organisasi.periodeStart || ""}
                                                    onChange={(e) => handleChange(e, index, "organisasi")}
                                                    placeholder="Masukkan Tanggal Mulai"
                                                    className="w-full mb-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                />
                                                <label className="block text-gray-700 font-bold mb-2" htmlFor="periodeEnd">
                                                    Tanggal Akhir <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="date"
                                                    id="periodeEnd"
                                                    name="periodeEnd"
                                                    value={organisasi.periodeEnd || ""}
                                                    onChange={(e) => handleChange(e, index, "organisasi")}
                                                    placeholder="Masukkan Tanggal Akhir"
                                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring mt-2"
                                                />
                                            </div>

                                            <div className="mb-4">
                                                <label className="block text-gray-700 font-bold mb-2" htmlFor="deskripsiKerja">
                                                    Deskripsi <span className="text-red-500">*</span>
                                                </label>
                                                <textarea
                                                    id="deskripsiKerja"
                                                    name="deskripsiKerja"
                                                    value={organisasi.deskripsiKerja || ""}
                                                    onChange={(e) => handleChange(e, index, "organisasi")}
                                                    placeholder="Masukkan Deskripsi"
                                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    <p className="mt-4">
                                        Kolom dengan tanda (<span className="text-red-500">*</span>) wajib untuk diisi
                                    </p>
                                </div>
                            </TabPanel>

                            <TabPanel>
                                <div className="bg-white p-6 rounded-lg shadow-lg w-full">
                                    <div className="mb-4 flex justify-between items-center">
                                        <label className="block text-darkBlue font-bold mb-2" htmlFor="kontakKerabat">
                                            KONTAK KERABAT <span className="text-red-500">*</span>
                                        </label>
                                        <button onClick={() => handleAddEntry("kontak")} className="text-blue-500">
                                            <FontAwesomeIcon icon={faPlus} />
                                        </button>
                                    </div>
                                    {kontakList.map((kontak, index) => (
                                        <div key={index} className="mb-4 border-b pb-4">
                                            <div className="flex justify-between items-center">
                                                <label className="block text-gray-700 font-bold mb-2" htmlFor="namaKontak">
                                                    Nama Kontak <span className="text-red-500">*</span>
                                                </label>
                                                <button onClick={() => handleRemoveEntry("kontak", index)} className="text-red-500">
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </div>
                                            <input
                                                type="text"
                                                id="namaKontak"
                                                name="namaKontak"
                                                value={kontak.namaKontak || ""}
                                                onChange={(e) => handleChange(e, index, "kontak")}
                                                placeholder="Masukkan Nama Kontak"
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                            />
                                            <div className="mb-4">
                                                <label className="block text-gray-700 font-bold mb-2" htmlFor="hubKontak">
                                                    Hubungan Kerabat <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="hubKontak"
                                                    name="hubKontak"
                                                    value={kontak.hubKontak || ""}
                                                    onChange={(e) => handleChange(e, index, "kontak")}
                                                    placeholder="Masukkan Hubungan Kerabat"
                                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                />
                                            </div>

                                            <div className="mb-4">
                                                <label className="block text-gray-700 font-bold mb-2" htmlFor="telpKontak">
                                                    No Telepon <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="telpKontak"
                                                    name="telpKontak"
                                                    value={kontak.telpKontak || ""}
                                                    onChange={(e) => handleChange(e, index, "kontak")}
                                                    placeholder="Masukkan No Telepon"
                                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                    pattern="\d{4}"
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="block text-gray-700 font-bold mb-2" htmlFor="emailKontak">
                                                    Email <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    id="emailKontak"
                                                    name="emailKontak"
                                                    value={kontak.emailKontak || ""}
                                                    onChange={(e) => handleChange(e, index, "kontak")}
                                                    placeholder="Masukkan Email"
                                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                    pattern="\d{4}"
                                                />
                                            </div>

                                            <div className="mb-4">
                                                <label className="block text-gray-700 font-bold mb-2" htmlFor="alamatKontak">
                                                    Alamat <span className="text-red-500">*</span>
                                                </label>
                                                <textarea
                                                    id="alamatKontak"
                                                    name="alamatKontak"
                                                    value={kontak.alamatKontak || ""}
                                                    onChange={(e) => handleChange(e, index, "kontak")}
                                                    placeholder="Masukkan Alamat"
                                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    <p className="mt-4">
                                        Kolom dengan tanda (<span className="text-red-500">*</span>) wajib untuk diisi
                                    </p>
                                </div>
                            </TabPanel>
                        </Tabs>
                    )}
                    <button 
                        onClick={handleSave} 
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg mt-6 shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
                    >
                        Simpan Semua Data
                    </button>
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

interface Pengalaman {
    idDataKerja: string;
    idPeserta: string;
    namaInstansi: string;
    posisiKerja: string;
    periodeKerja: string;
    deskripsiKerja: string;
    periodeKerjaStart?: string;
    periodeKerjaEnd?: string;
}

interface Organisasi {
    idOrgPeserta: string;
    idPeserta: string;
    namaOrganisasi: string;
    posisiOrganisasi: string;
    periode: string;
    deskripsiKerja: string;
    sertifikat: string;
    periodeStart?: string;
    periodeEnd?: string;
}
