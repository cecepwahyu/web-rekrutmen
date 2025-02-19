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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import Select from 'react-select';

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

const fetchKotaIdentitasOptions = async (provinsiKode: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/kabupaten/by-provinsi/${provinsiKode}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });

        const data = await response.json();
        const options = data.map((kota: { kodeKabupaten: string; namaKabupaten: string }) => ({
            value: kota.kodeKabupaten,
            label: kota.namaKabupaten,
        }));
        return options;
    } catch (error) {
        console.error("Error fetching kota list:", error);
        return [];
    }
};

const fetchKotaDomisiliOptions = async (provinsiKode: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/kabupaten/by-provinsi/${provinsiKode}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });

        const data = await response.json();
        const options = data.map((kota: { kodeKabupaten: string; namaKabupaten: string }) => ({
            value: kota.kodeKabupaten,
            label: kota.namaKabupaten,
        }));
        return options;
    } catch (error) {
        console.error("Error fetching kota list:", error);
        return [];
    }
};

const fetchKecamatanOptions = async (kabupatenKode: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/kecamatan/by-kabupaten/${kabupatenKode}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });

        const data = await response.json();
        const options = data.map((kecamatan: { kodeKecamatan: string; namaKecamatan: string }) => ({
            value: kecamatan.kodeKecamatan,
            label: kecamatan.namaKecamatan,
        }));
        return options;
    } catch (error) {
        //console.error("Error fetching kecamatan list:", error);
        return [];
    }
};

const fetchDesaOptions = async (kecamatanKode: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/desa/by-kecamatan/${kecamatanKode}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });

        const data = await response.json();
        const options = data.map((desa: { kodeDesa: string; namaDesa: string }) => ({
            value: desa.kodeDesa,
            label: desa.namaDesa,
        }));
        return options;
    } catch (error) {
        console.error("Error fetching desa list:", error);
        return [];
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
        tinggi: "",
        berat: "",
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
    const [dialogMessage, setDialogMessage] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [provinsiIdentitasOptions, setProvinsiIdentitasOptions] = useState<{ value: string; label: string }[]>([]);
    const [provinsiDomisiliOptions, setProvinsiDomisiliOptions] = useState<{ value: string; label: string }[]>([]);
    const [kotaIdentitasOptions, setKotaIdentitasOptions] = useState<{ value: string; label: string }[]>([]);
    const [kotaDomisiliOptions, setKotaDomisiliOptions] = useState<{ value: string; label: string }[]>([]);
    const [kecamatanIdentitasOptions, setKecamatanIdentitasOptions] = useState<{ value: string; label: string }[]>([]);
    const [desaIdentitasOptions, setDesaIdentitasOptions] = useState<{ value: string; label: string }[]>([]);
    const [kecamatanDomisiliOptions, setKecamatanDomisiliOptions] = useState<{ value: string; label: string }[]>([]);
    const [desaDomisiliOptions, setDesaDomisiliOptions] = useState<{ value: string; label: string }[]>([]);
    const [isBpddiyRelated, setIsBpddiyRelated] = useState<boolean | null>(null);

    const showDialog = (message: string) => {
        setDialogMessage(message);
        setDialogOpen(true);
        setTimeout(() => {
            setDialogOpen(false);
        }, 3000); // Auto close after 3 seconds
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

    const handleDateChange = (e: ChangeEvent<HTMLInputElement>, index: number, type: string) => {
        const { name, value } = e.target;
        const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

        if (type === "pengalaman") {
            const pengalaman = pengalamanList[index];
            if (name === "periodeKerjaEnd" && value < pengalaman.periodeKerjaStart) {
                showDialog("Tanggal Akhir Bekerja tidak boleh kurang dari Tanggal Mulai Bekerja.");
                return;
            }
            if (name === "periodeKerjaStart" && value > pengalaman.periodeKerjaEnd) {
                showDialog("Tanggal Mulai Bekerja tidak boleh lebih dari Tanggal Akhir Bekerja.");
                return;
            }
        } else if (type === "organisasi") {
            const organisasi = organisasiList[index];
            if (name === "periodeEnd" && value < organisasi.periodeStart) {
                showDialog("Tanggal Akhir tidak boleh kurang dari Tanggal Mulai.");
                return;
            }
            if (name === "periodeStart" && value > organisasi.periodeEnd) {
                showDialog("Tanggal Mulai tidak boleh lebih dari Tanggal Akhir.");
                return;
            }
        }

        handleChange(e, index, type);
    };

    const validateFields = () => {
        const requiredFields = [
            { name: "Nama", value: profileData.nama },
            { name: "Tempat Lahir", value: profileData.tempatLahir },
            { name: "Tanggal Lahir", value: profileData.tglLahir },
            { name: "Jenis Kelamin", value: profileData.jnsKelamin },
            { name: "Agama", value: profileData.agama },
            { name: "Alamat Identitas", value: profileData.alamatIdentitas },
            { name: "Provinsi Identitas", value: profileData.provinsiIdentitas },
            { name: "Kota Identitas", value: profileData.kotaIdentitas },
            { name: "Kecamatan Identitas", value: profileData.kecamatanIdentitas },
            { name: "Desa Identitas", value: profileData.desaIdentitas },
            { name: "Alamat Domisili", value: profileData.alamatDomisili },
            { name: "Provinsi Domisili", value: profileData.provinsiDomisili },
            { name: "Kota Domisili", value: profileData.kotaDomisili },
            { name: "Kecamatan Domisili", value: profileData.kecamatanDomisili },
            { name: "Desa Domisili", value: profileData.desaDomisili },
            { name: "No Telepon", value: profileData.telp },
            { name: "Pendidikan Terakhir", value: profileData.pendidikanTerakhir },
            { name: "Status Kawin", value: profileData.statusKawin },
        ];

        for (const field of requiredFields) {
            if (!field.value) {
                showDialog(`Field ${field.name} wajib diisi.`);
                return false;
            }
        }

        for (const [index, kontak] of kontakList.entries()) {
            if (!kontak.namaKontak || !kontak.hubKontak || !kontak.alamatKontak) {
                showDialog(`Field Kontak Kerabat ke-${index + 1} wajib diisi.`);
                return false;
            }
        }

        for (const [index, pendidikan] of pendidikanList.entries()) {
            if (!pendidikan.idJenjang || !pendidikan.namaInstitusi || !pendidikan.jurusan || !pendidikan.thnMasuk || !pendidikan.thnLulus || !pendidikan.nilai || !pendidikan.gelar) {
                showDialog(`Field Pendidikan ke-${index + 1} wajib diisi.`);
                return false;
            }
        }

        for (const [index, pengalaman] of pengalamanList.entries()) {
            if (!pengalaman.namaInstansi || !pengalaman.posisiKerja || !pengalaman.periodeKerjaStart || !pengalaman.periodeKerjaEnd || !pengalaman.deskripsiKerja) {
                showDialog(`Field Pengalaman Kerja ke-${index + 1} wajib diisi.`);
                return false;
            }
        }

        for (const [index, organisasi] of organisasiList.entries()) {
            if (!organisasi.namaOrganisasi || !organisasi.posisiOrganisasi || !organisasi.periodeStart || !organisasi.periodeEnd || !organisasi.deskripsiKerja) {
                showDialog(`Field Organisasi ke-${index + 1} wajib diisi.`);
                return false;
            }
        }

        return true;
    };

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
                    setIsBpddiyRelated(kontak.some((k: { isBpddiyRelated: boolean }) => k.isBpddiyRelated));
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

    useEffect(() => {
        const fetchProvinsiIdentitasList = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/provinsi/list`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                });

                const data = await response.json();
                const options = data.map((provinsi: { kodeProvinsi: string; namaProvinsi: string }) => ({
                    value: provinsi.kodeProvinsi,
                    label: provinsi.namaProvinsi,
                }));
                setProvinsiIdentitasOptions(options);
            } catch (error) {
                console.error("Error fetching provinsi list:", error);
            }
        };

        fetchProvinsiIdentitasList();
    }, []);

    useEffect(() => {
        if (profileData.provinsiIdentitas) {
            fetchKotaIdentitasOptions(profileData.provinsiIdentitas).then(setKotaIdentitasOptions);
        }
    }, [profileData.provinsiIdentitas]);

    useEffect(() => {
        if (profileData.provinsiDomisili) {
            fetchKotaDomisiliOptions(profileData.provinsiDomisili).then(setKotaDomisiliOptions);
        }
    }, [profileData.provinsiDomisili]);

    useEffect(() => {
        const fetchProvinsiDomisiliList = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/provinsi/list`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                });

                const data = await response.json();
                const options = data.map((provinsi: { kodeProvinsi: string; namaProvinsi: string }) => ({
                    value: provinsi.kodeProvinsi,
                    label: provinsi.namaProvinsi,
                }));
                setProvinsiDomisiliOptions(options);
            } catch (error) {
                console.error("Error fetching provinsi list:", error);
            }
        };

        fetchProvinsiDomisiliList();
    }, []);

    useEffect(() => {
        if (profileData.kotaIdentitas) {
            fetchKecamatanOptions(profileData.kotaIdentitas).then(setKecamatanIdentitasOptions);
        }
    }, [profileData.kotaIdentitas]);

    useEffect(() => {
        if (profileData.kecamatanIdentitas) {
            fetchDesaOptions(profileData.kecamatanIdentitas).then(setDesaIdentitasOptions);
        }
    }, [profileData.kecamatanIdentitas]);

    useEffect(() => {
        if (profileData.kotaDomisili) {
            fetchKecamatanOptions(profileData.kotaDomisili).then(setKecamatanDomisiliOptions);
        }
    }, [profileData.kotaDomisili]);

    useEffect(() => {
        if (profileData.kecamatanDomisili) {
            fetchDesaOptions(profileData.kecamatanDomisili).then(setDesaDomisiliOptions);
        }
    }, [profileData.kecamatanDomisili]);

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

    const handleSave = async () => {
        if (!validateFields()) {
            return;
        }

        if (isBpddiyRelated === null) {
            showDialog("Field Hubungan dengan BPD wajib diisi.");
            return;
        }

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

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        for (const kontak of kontakList) {
            if (kontak.emailKontak && !emailRegex.test(kontak.emailKontak)) {
                showDialog(`Format email tidak valid! Silahkan periksa email Anda.`);
                setIsLoading(false);
                return;
            }
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
            // provinsi_identitas: provinsiIdentitasOptions.find(option => option.value === profileData.provinsiIdentitas)?.label || "",
            // kota_identitas: kotaIdentitasOptions.find(option => option.value === profileData.kotaIdentitas)?.label || "",
            // kecamatan_identitas: kecamatanIdentitasOptions.find(option => option.value === profileData.kecamatanIdentitas)?.label || "",
            // desa_identitas: desaIdentitasOptions.find(option => option.value === profileData.desaIdentitas)?.label || "",
            // alamat_domisili: profileData.alamatDomisili,
            // provinsi_domisili: provinsiDomisiliOptions.find(option => option.value === profileData.provinsiDomisili)?.label || "",
            // kota_domisili: kotaDomisiliOptions.find(option => option.value === profileData.kotaDomisili)?.label || "",
            // kecamatan_domisili: kecamatanDomisiliOptions.find(option => option.value === profileData.kecamatanDomisili)?.label || "",
            // desa_domisili: desaDomisiliOptions.find(option => option.value === profileData.desaDomisili)?.label || "",
            telp: profileData.telp,
            pendidikan_terakhir: profileData.pendidikanTerakhir,
            status_kawin: profileData.statusKawin,
            tinggi: profileData.tinggi,
            berat: profileData.berat,
            id_session: "29348293923",
            flg_status: "2",
            kontak: kontakList.map(kontak => ({
                id_kontak_peserta: kontak.idKontakPeserta, // Include ID for update/delete
                nama_kontak: kontak.namaKontak,
                hub_kontak: kontak.hubKontak,
                telp_kontak: kontak.telpKontak,
                email_kontak: kontak.emailKontak,
                alamat_kontak: kontak.alamatKontak,
                is_bpddiy_related: isBpddiyRelated,
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

                <div className="flex flex-col justify-center items-center w-full bg-white min-h-[400px] relative z-10 -mt-32 px-4 pt-16 md:px-8 lg:px-16 xl:px-32">
                    <h1 className="text-darkBlue font-semibold text-3xl mt-4 md:mt-2">Edit Profil</h1>
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
                                    <FontAwesomeIcon icon={faBriefcase} className="mr-2" /> Pengalaman Kerja
                                </Tab>
                                <Tab className={`px-4 py-2 mx-2 rounded-lg cursor-pointer custom-tab ${activeTab === 3 ? 'bg-darkBlue text-white' : 'bg-gray-200 text-darkBlue'}`} selectedClassName="custom-tab-selected">
                                    <FontAwesomeIcon icon={faUsers} className="mr-2" /> Organisasi
                                </Tab>
                                <Tab className={`px-4 py-2 mx-2 rounded-lg cursor-pointer custom-tab ${activeTab === 4 ? 'bg-darkBlue text-white' : 'bg-gray-200 text-darkBlue'}`} selectedClassName="custom-tab-selected">
                                    <FontAwesomeIcon icon={faAddressBook} className="mr-2" /> Data Keluarga
                                </Tab>
                            </TabList>

                            <TabPanel>
                                <div className="bg-white p-6 rounded-lg shadow-lg w-full">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Data Identitas Section */}
                                        <h2 className="text-xl font-semibold mb-4 col-span-2">Data Identitas</h2>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor="nama">
                                                Nama <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="nama"
                                                name="nama"
                                                value={profileData.nama || ""}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (!/[<>/]/.test(value) && value.length <= 50) {
                                                        handleChange(e, 0, "profile");
                                                    }
                                                }}
                                                placeholder="Masukkan Nama"
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                maxLength={50}
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
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (/^[a-zA-Z\s]*$/.test(value)) {
                                                        handleChange(e, 0, "profile");
                                                    }
                                                }}
                                                placeholder="Masukkan Tempat Lahir"
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                maxLength={50}
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
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (/^\d*$/.test(value) && value.length <= 15) {
                                                        handleChange(e, 0, "profile");
                                                    }
                                                }}
                                                placeholder="Masukkan No Telepon"
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                maxLength={15}
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
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor="provinsiIdentitas">
                                                Provinsi Identitas <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="provinsiIdentitas"
                                                name="provinsiIdentitas"
                                                value={profileData.provinsiIdentitas || ""}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (/^[a-zA-Z0-9\s]*$/.test(value)) {
                                                        handleChange(e, 0, "profile");
                                                    }
                                                }}
                                                placeholder="Masukkan Provinsi Identitas"
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                maxLength={50}
                                            />
                                            {/* <Select
                                                id="provinsiIdentitas"
                                                name="provinsiIdentitas"
                                                options={provinsiIdentitasOptions}
                                                value={provinsiIdentitasOptions.find(option => option.value === profileData.provinsiIdentitas)}
                                                onChange={(selectedOption: { value: string } | null) => handleChange({ target: { name: 'provinsiIdentitas', value: selectedOption?.value || '' } } as ChangeEvent<HTMLInputElement>, 0, "profile")}
                                                placeholder="Pilih Provinsi Identitas"
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                isSearchable
                                            /> */}
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor="kotaIdentitas">
                                                Kabupaten/Kota Identitas <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="kotaIdentitas"
                                                name="kotaIdentitas"
                                                value={profileData.kotaIdentitas || ""}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (/^[a-zA-Z0-9\s]*$/.test(value)) {
                                                        handleChange(e, 0, "profile");
                                                    }
                                                }}
                                                placeholder="Masukkan Kota Identitas"
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                maxLength={50}
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
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (/^[a-zA-Z0-9\s]*$/.test(value)) {
                                                        handleChange(e, 0, "profile");
                                                    }
                                                }}
                                                placeholder="Masukkan Kecamatan Identitas"
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                maxLength={50}
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
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (/^[a-zA-Z0-9\s]*$/.test(value)) {
                                                        handleChange(e, 0, "profile");
                                                    }
                                                }}
                                                placeholder="Masukkan Desa Identitas"
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                maxLength={50}
                                            />
                                        </div>

                                        <div className="mb-4 col-span-2">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor="alamatIdentitas">
                                                Alamat Identitas <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="alamatIdentitas"
                                                name="alamatIdentitas"
                                                value={profileData.alamatIdentitas || ""}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (/^[a-zA-Z0-9\s]*$/.test(value)) {
                                                        handleChange(e, 0, "profile");
                                                    }
                                                }}
                                                placeholder="Masukkan Alamat Identitas"
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                maxLength={50}
                                            />
                                        </div>

                                        {/* Data Domisili Section */}
                                        <h2 className="text-xl font-semibold mb-4 col-span-2">Data Domisili</h2>

                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor="provinsiDomisili">
                                                Provinsi Domisili <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="provinsiDomisili"
                                                name="provinsiDomisili"
                                                value={profileData.provinsiDomisili || ""}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (/^[a-zA-Z0-9\s]*$/.test(value)) {
                                                        handleChange(e, 0, "profile");
                                                    }
                                                }}
                                                placeholder="Masukkan Provinsi Domisili"
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                maxLength={50}
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
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (/^[a-zA-Z0-9\s]*$/.test(value)) {
                                                        handleChange(e, 0, "profile");
                                                    }
                                                }}
                                                placeholder="Masukkan Kabupaten/Kota Domisili"
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                maxLength={50}
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
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (/^[a-zA-Z0-9\s]*$/.test(value)) {
                                                        handleChange(e, 0, "profile");
                                                    }
                                                }}
                                                placeholder="Masukkan Kecamatan Domisili"
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                maxLength={50}
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor="desaDomisili">
                                                Desa Domisili <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="desaDomisili"
                                                name="desaDomisili"
                                                value={profileData.desaDomisili || ""}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (/^[a-zA-Z0-9\s]*$/.test(value)) {
                                                        handleChange(e, 0, "profile");
                                                    }
                                                }}
                                                placeholder="Masukkan Desa Domisili"
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                maxLength={50}
                                            />
                                        </div>

                                        <div className="mb-4 col-span-2">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor="alamatDomisili">
                                                Alamat Domisili <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="alamatDomisili"
                                                name="alamatDomisili"
                                                value={profileData.alamatDomisili || ""}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (/^[a-zA-Z0-9\s]*$/.test(value)) {
                                                        handleChange(e, 0, "profile");
                                                    }
                                                }}
                                                placeholder="Masukkan Alamat Domisili"
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                maxLength={50}
                                            />
                                        </div>

                                        {/* Data Domisili Section */}
                                        <h2 className="text-xl font-semibold mb-4 col-span-2">Data Diri</h2>

                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor="tinggi">
                                                Tinggi Badan
                                            </label>
                                            <input
                                                type="text"
                                                id="tinggi"
                                                name="tinggi"
                                                value={profileData.tinggi || ""}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (/^\d{0,3}$/.test(value)) {
                                                        handleChange(e, 0, "profile");
                                                    }
                                                }}
                                                placeholder="Masukkan Tinggi Badan (cm)"
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                maxLength={3}
                                            />
                                        </div>

                                        <div className="mb-8">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor="berat">
                                                Berat Badan
                                            </label>
                                            <input
                                                type="text"
                                                id="berat"
                                                name="berat"
                                                value={profileData.berat || ""}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (/^\d{0,3}$/.test(value)) {
                                                        handleChange(e, 0, "profile");
                                                    }
                                                }}
                                                placeholder="Masukkan Berat Badan (kg)"
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                maxLength={3}
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
                                                value={pendidikan.idJenjang.trim() || ""}
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
                                                    Nama Institusi <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="namaInstitusi"
                                                    name="namaInstitusi"
                                                    value={pendidikan.namaInstitusi || ""}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (/^[a-zA-Z0-9\s]*$/.test(value)) {
                                                            handleChange(e, index, "pendidikan");
                                                        }
                                                    }}
                                                    placeholder="Masukkan Nama Institusi"
                                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                    maxLength={50}
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
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (/^[a-zA-Z0-9\s]*$/.test(value)) {
                                                            handleChange(e, index, "pendidikan");
                                                        }
                                                    }}
                                                    placeholder="Masukkan Jurusan"
                                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                    maxLength={50}
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
                                                    maxLength={4}
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
                                                    maxLength={4}
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
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (/^[a-zA-Z0-9.]*$/.test(value)) {
                                                            handleChange(e, index, "pendidikan");
                                                        }
                                                    }}
                                                    placeholder="Masukkan Nilai"
                                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                    maxLength={5}
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
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (/^[a-zA-Z0-9\s]*$/.test(value)) {
                                                            handleChange(e, index, "pendidikan");
                                                        }
                                                    }}
                                                    placeholder="Masukkan Gelar"
                                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                    maxLength={50}
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
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (/^[a-zA-Z0-9\s]*$/.test(value)) {
                                                            handleChange(e, index, "pendidikan");
                                                        }
                                                    }}
                                                    placeholder="Masukkan Penghargaan"
                                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                    maxLength={255}
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
                                            PENGALAMAN KERJA
                                        </label>
                                        <button onClick={() => handleAddEntry("pengalaman")} className="text-blue-500">
                                            <FontAwesomeIcon icon={faPlus} />
                                        </button>
                                    </div>
                                    {pengalamanList.map((pengalaman, index) => (
                                        <div key={index} className="mb-4 border-b pb-4">
                                            <div className="flex justify-between items-center">
                                                <label className="block text-gray-700 font-bold mb-2" htmlFor="namaInstansi">
                                                    Nama Perusahaan / Instansi
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
                                                maxLength={50}
                                            />
                                            <div className="mb-4">
                                                <label className="block text-gray-700 font-bold mb-2" htmlFor="posisiKerja">
                                                    Posisi / Jabatan
                                                </label>
                                                <input
                                                    type="text"
                                                    id="posisiKerja"
                                                    name="posisiKerja"
                                                    value={pengalaman.posisiKerja || ""}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (/^[a-zA-Z0-9\s]*$/.test(value)) {
                                                            handleChange(e, index, "pengalaman");
                                                        }
                                                    }}
                                                    placeholder="Masukkan Posisi Kerja"
                                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                    maxLength={50}
                                                />
                                            </div>

                                            <div className="mb-4">
                                                <label className="block text-gray-700 font-bold mb-2" htmlFor="periodeKerjaStart">
                                                    Tanggal Mulai Bekerja
                                                </label>
                                                <input
                                                    type="date"
                                                    id="periodeKerjaStart"
                                                    name="periodeKerjaStart"
                                                    value={pengalaman.periodeKerjaStart || ""}
                                                    onChange={(e) => handleDateChange(e, index, "pengalaman")}
                                                    placeholder="Masukkan Tanggal Mulai Bekerja"
                                                    className="w-full mb-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                />
                                                <label className="block text-gray-700 font-bold mb-2" htmlFor="periodeKerjaEnd">
                                                    Tanggal Akhir Bekerja
                                                </label>
                                                <input
                                                    type="date"
                                                    id="periodeKerjaEnd"
                                                    name="periodeKerjaEnd"
                                                    value={pengalaman.periodeKerjaEnd || ""}
                                                    onChange={(e) => handleDateChange(e, index, "pengalaman")}
                                                    placeholder="Masukkan Tanggal Akhir Bekerja"
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
                                                    value={pengalaman.deskripsiKerja || ""}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (/^[a-zA-Z0-9\s]*$/.test(value)) {
                                                            handleChange(e, index, "pengalaman");
                                                        }
                                                    }}
                                                    placeholder="Masukkan Deskripsi Pekerjaan"
                                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                    maxLength={255}
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
                                            ORGANISASI
                                        </label>
                                        <button onClick={() => handleAddEntry("organisasi")} className="text-blue-500">
                                            <FontAwesomeIcon icon={faPlus} />
                                        </button>
                                    </div>
                                    {organisasiList.map((organisasi, index) => (
                                        <div key={index} className="mb-4 border-b pb-4">
                                            <div className="flex justify-between items-center">
                                                <label className="block text-gray-700 font-bold mb-2" htmlFor="namaOrganisasi">
                                                    Nama Organisasi
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
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (/^[a-zA-Z0-9\s]*$/.test(value)) {
                                                        handleChange(e, index, "organisasi");
                                                    }
                                                }}
                                                placeholder="Masukkan Nama Organisasi"
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                maxLength={50}
                                            />
                                            <div className="mb-4">
                                                <label className="block text-gray-700 font-bold mb-2" htmlFor="posisiOrganisasi">
                                                    Posisi
                                                </label>
                                                <input
                                                    type="text"
                                                    id="posisiOrganisasi"
                                                    name="posisiOrganisasi"
                                                    value={organisasi.posisiOrganisasi || ""}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (/^[a-zA-Z0-9\s]*$/.test(value)) {
                                                            handleChange(e, index, "organisasi");
                                                        }
                                                    }}
                                                    placeholder="Masukkan Posisi Organisasi"
                                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                    maxLength={50}
                                                />
                                            </div>

                                            <div className="mb-4">
                                                <label className="block text-gray-700 font-bold mb-2" htmlFor="periodeStart">
                                                    Tanggal Mulai
                                                </label>
                                                <input
                                                    type="date"
                                                    id="periodeStart"
                                                    name="periodeStart"
                                                    value={organisasi.periodeStart || ""}
                                                    onChange={(e) => handleDateChange(e, index, "organisasi")}
                                                    placeholder="Masukkan Tanggal Mulai"
                                                    className="w-full mb-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                />
                                                <label className="block text-gray-700 font-bold mb-2" htmlFor="periodeEnd">
                                                    Tanggal Akhir
                                                </label>
                                                <input
                                                    type="date"
                                                    id="periodeEnd"
                                                    name="periodeEnd"
                                                    value={organisasi.periodeEnd || ""}
                                                    onChange={(e) => handleDateChange(e, index, "organisasi")}
                                                    placeholder="Masukkan Tanggal Akhir"
                                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring mt-2"
                                                />
                                            </div>

                                            <div className="mb-4">
                                                <label className="block text-gray-700 font-bold mb-2" htmlFor="deskripsiKerja">
                                                    Deskripsi
                                                </label>
                                                <textarea
                                                    id="deskripsiKerja"
                                                    name="deskripsiKerja"
                                                    value={organisasi.deskripsiKerja || ""}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (/^[a-zA-Z0-9\s]*$/.test(value)) {
                                                            handleChange(e, index, "organisasi");
                                                        }
                                                    }}
                                                    placeholder="Masukkan Deskripsi"
                                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                    maxLength={255}
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
                                            DATA KELUARGA <span className="text-red-500">*</span>
                                        </label>
                                        <button onClick={() => handleAddEntry("kontak")} className="text-blue-500">
                                            <FontAwesomeIcon icon={faPlus} />
                                        </button>
                                    </div>
                                    <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4" role="alert">
                                        <p className="font-bold">Informasi</p>
                                        <p>Isikan data Ayah, Ibu, dan Saudara kandung Anda.</p>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-bold mb-2">
                                            Apakah anda mempunyai hubungan keluarga atau kerabat yang bekerja di Bank BPD DIY? <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                id="hubunganYes"
                                                name="hubunganBPD"
                                                value="yes"
                                                className="mr-2"
                                                checked={isBpddiyRelated === true}
                                                onChange={() => setIsBpddiyRelated(true)}
                                            />
                                            <label htmlFor="hubunganYes" className="mr-4">Ya</label>
                                            <input
                                                type="radio"
                                                id="hubunganNo"
                                                name="hubunganBPD"
                                                value="no"
                                                className="mr-2"
                                                checked={isBpddiyRelated === false}
                                                onChange={() => setIsBpddiyRelated(false)}
                                            />
                                            <label htmlFor="hubunganNo">Tidak</label>
                                        </div>
                                    </div>
                                    {kontakList.map((kontak, index) => (
                                        <div key={index} className="mb-4 border-b pb-4">
                                            <div className="flex justify-between items-center">
                                                <label className="block text-gray-700 font-bold mb-2" htmlFor="namaKontak">
                                                    Nama <span className="text-red-500">*</span>
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
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (/^[a-zA-Z0-9\s]*$/.test(value)) {
                                                        handleChange(e, index, "kontak");
                                                    }
                                                }}
                                                placeholder="Masukkan Nama"
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                maxLength={50}
                                            />
                                            <div className="mb-4">
                                                <label className="block text-gray-700 font-bold mb-2" htmlFor="hubKontak">
                                                    Hubungan Kerabat <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    id="hubKontak"
                                                    name="hubKontak"
                                                    value={kontak.hubKontak || ""}
                                                    onChange={(e) => handleChange(e, index, "kontak")}
                                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                >
                                                    <option value="">Pilih Hubungan Kerabat</option>
                                                    <option value="Ayah">Ayah</option>
                                                    <option value="Ibu">Ibu</option>
                                                    <option value="Saudara Kandung">Saudara Kandung</option>
                                                </select>
                                            </div>
                                            <div className="mb-4">
                                                <label className="block text-gray-700 font-bold mb-2" htmlFor="telpKontak">
                                                    No Telepon
                                                </label>
                                                <input
                                                    type="text"
                                                    id="telpKontak"
                                                    name="telpKontak"
                                                    value={kontak.telpKontak || ""}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (/^\d*$/.test(value) && value.length <= 15) {
                                                            handleChange(e, index, "kontak");
                                                        }
                                                    }}
                                                    placeholder="Masukkan No Telepon"
                                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                    maxLength={15}
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
                                                    value={kontak.emailKontak || ""}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (/^[a-zA-Z0-9.@]*$/.test(value)) {
                                                            handleChange(e, index, "kontak");
                                                        }
                                                    }}
                                                    placeholder="Masukkan Email"
                                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                    maxLength={30}
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
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (/^[a-zA-Z0-9\s]*$/.test(value)) {
                                                            handleChange(e, index, "kontak");
                                                        }
                                                    }}
                                                    placeholder="Masukkan Alamat"
                                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                                                    maxLength={255}
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
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="font-normal">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold">Info</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 flex items-center">
                        {dialogMessage && (
                            <span>{dialogMessage}</span>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
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
