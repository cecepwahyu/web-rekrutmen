"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
  } from "@/components/ui/dialog"
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';

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

const getHeaders = (token: string) => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
});

const checkProfileCompletion = async (idPeserta: string) => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    const endpoints = [
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/${idPeserta}`,
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/pengalaman/${idPeserta}`,
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/pendidikan/${idPeserta}`,
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/kontak/${idPeserta}`,
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/organisasi/${idPeserta}`
    ];

    for (const endpoint of endpoints) {
        try {
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: getHeaders(token),
            });
            const data = await response.json();
            if (data.responseCode !== '000' || data.data.length === 0) {
                return false;
            }
        } catch (error) {
            console.error('Error fetching profile data:', error);
            return false;
        }
    }
    return true;
};

const deleteDocument = async (endpoint: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const idPeserta = await getIdFromToken(token);
    if (!idPeserta) return;

    try {
        const response = await fetch(endpoint.replace('{idPeserta}', idPeserta), {
            method: 'DELETE',
            headers: getHeaders(token),
        });

        const data = await response.json();
        if (data.responseCode !== '000') {
            console.error('Failed to delete document:', data.responseMessage);
        }
    } catch (error) {
        console.error('Error deleting document:', error);
    }
};

const fetchProfileDetails = async (idPeserta: string) => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/${idPeserta}/details`, {
            method: 'GET',
            headers: getHeaders(token),
        });

        const data = await response.json();
        if (data.responseCode === '000') {
            return data.data;
        } else {
            console.error('Error fetching profile details:', data.responseMessage);
            return null;
        }
    } catch (error) {
        console.error('Error fetching profile details:', error);
        return null;
    }
};

const isProfileDataComplete = (profileData: any) => {
    const requiredFields = [
        'organisasi_periode', 'achievements', 'kontak_id', 'thn_masuk', 'nilai', 'nama_instansi', 'posisi_kerja',
        'telp_kontak', 'periode_kerja', 'pendidikan_jenjang', 'organisasi_id', 'organisasi_deskripsi', 'gelar',
        'pengalaman_id', 'email_kontak', 'nama_kontak', 'jurusan', 'nama_institusi', 'pengalaman_deskripsi',
        'pendidikan_id', 'thn_lulus', 'peserta_id', 'nama_organisasi', 'hub_kontak', 'posisi_organisasi', 'alamat_kontak',
        'profile_picture'
    ];

    return requiredFields.every(field => profileData[field] !== null && profileData[field] !== '');
};

const DetailKarir = () => {
    const params = useParams();
    const slug = params?.id as string;
    const [isLoading, setIsLoading] = useState(true);
    const [article, setArticle] = useState<Article | null>(null);
    const [tahapan, setTahapan] = useState<Tahapan[]>([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { register, handleSubmit, reset } = useForm();
    const router = useRouter();
    const [idPeserta, setIdPeserta] = useState<string | null>(null);
    const [idUserDocuments, setIdUserDocuments] = useState<number[]>([]);
    const [requiredDocuments, setRequiredDocuments] = useState<any[]>([]);
    const [isAgreementDialogOpen, setIsAgreementDialogOpen] = useState(false);
    const [agreements, setAgreements] = useState({
        recruitment: false,
        dataUsage: false,
        holdDiploma: false,
        submitCv: false,
    });
    const [agreementError, setAgreementError] = useState('');
    const [minHeight, setMinHeight] = useState<number | null>(null);
    const [isHeightMandatory, setIsHeightMandatory] = useState<boolean>(false);
    const [tinggiBadan, setTinggiBadan] = useState<number | null>(null);
    const [beratBadan, setBeratBadan] = useState<number | null>(null);
    const [tinggiBadanError, setTinggiBadanError] = useState<string>('');
    const [beratBadanError, setBeratBadanError] = useState<string>('');
    const [status, setStatus] = useState<string | null>(null);
    const [isSubmitCvDialogOpen, setIsSubmitCvDialogOpen] = useState(false);
    const [isProfileIncompleteDialogOpen, setIsProfileIncompleteDialogOpen] = useState(false);
    const [isCvSubmitWarningDialogOpen, setIsCvSubmitWarningDialogOpen] = useState(false);
    const [showPreviewButton, setShowPreviewButton] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File | null }>({});
    const [showPreviewButtons, setShowPreviewButtons] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);

        const fetchIdPeserta = async () => {
            if (token) {
                const id = await getIdFromToken(token);
                setIdPeserta(id);
            }
        };

        fetchIdPeserta();
    }, []);

    useEffect(() => {
        const fetchArticle = async () => {
            setIsLoading(true);
            const token = localStorage.getItem('token');

            if (!token) return;

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/lowongan/slug/${slug}`, {
                    method: 'GET',
                    headers: getHeaders(token),
                });

                const data = await response.json();
                if (data.responseCode === '000') {
                    setArticle(data.data);
                    setMinHeight(data.data.minHeight);
                    setIsHeightMandatory(data.data.isHeightMandatory);
                    setStatus(data.data.status); // Set status
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
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tahapan/lowongan/slug/${slug}/tahapan`, {
                    method: 'GET',
                    headers: getHeaders(token),
                });

                const data = await response.json();
                if (data.responseCode === '000') {
                    const tahapanData = data.data.map((item: any) => ({
                        idTahapan: item[2],
                        namaTahapan: item[4],
                        deskripsi: item[5],
                        sortOrder: item[3],
                        isActive: false,
                    }));
                    tahapanData.sort((a: any, b: any) => a.sortOrder - b.sortOrder);
                    setTahapan(tahapanData);
                }
            } catch (error) {
                console.error('Error fetching Tahapan Seleksi:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticle();
        fetchTahapan();
    }, [slug]);

    useEffect(() => {
        const fetchLockStatus = async () => {
            const token = localStorage.getItem('token');
            if (!token || !idPeserta) return;

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/lowongan/lock-status/${idPeserta}`, {
                    method: 'GET',
                    headers: getHeaders(token),
                });

                const data = await response.json();
                if (data.responseCode === '000') {
                    setIsLocked(data.data === 'true' && status === '1'); // Only lock if status is '1'
                }
            } catch (error) {
                console.error('Error fetching lock status:', error);
            }
        };

        fetchLockStatus();
    }, [idPeserta, status]);

    useEffect(() => {
        const fetchUserDocuments = async () => {
            const token = localStorage.getItem('token');
            if (!token || !idPeserta) return;

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/${idPeserta}/documents`, {
                    method: 'GET',
                    headers: getHeaders(token),
                });

                const data = await response.json();
                setIdUserDocuments(data);
            } catch (error) {
                console.error('Error fetching user documents:', error);
            }
        };

        fetchUserDocuments();
    }, [idPeserta]);

    useEffect(() => {
        const fetchRequiredDocuments = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/lowongan/dokumen/slug/${slug}`, {
                    method: 'GET',
                    headers: getHeaders(token),
                });

                const data = await response.json();
                if (data.responseCode === '000') {
                    setRequiredDocuments(data.data);
                }
            } catch (error) {
                console.error('Error fetching required documents:', error);
            }
        };

        fetchRequiredDocuments();
    }, [slug]);

    const handleApply = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const idPeserta = await getIdFromToken(token);
        if (!idPeserta) return;

        const profileData = await fetchProfileDetails(idPeserta);
        if (!profileData || !isProfileDataComplete(profileData)) {
            setIsProfileIncompleteDialogOpen(true);
            return;
        }

        const isProfileComplete = await checkProfileCompletion(idPeserta);
        if (!isProfileComplete) {
            setIsProfileIncompleteDialogOpen(true);
            return;
        }

        setIsDialogOpen(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/lowongan/dokumen/slug/${slug}`, {
                method: 'GET',
                headers: getHeaders(token),
            });

            const data = await response.json();
            if (data.responseCode === '000') {
                setRequiredDocuments(data.data);
            }
        } catch (error) {
            console.error('Error fetching required documents:', error);
        }
    };

    const handleFileSubmit = async (data: any, endpoint: string, fieldName: string, maxSizeMB: number) => {
        const token = localStorage.getItem('token');
        if (!token) return;
    
        const idPeserta = await getIdFromToken(token);
        if (!idPeserta) return;
    
        const file = data[fieldName]?.[0];
        if (!file) {
            console.error('No file selected');
            return;
        }
    
        if (!(file instanceof File)) {
            console.error('File is not of type File', file);
            return;
        }
    
        if (file.size > maxSizeMB * 1024 * 1024) {
            const errorMessage = document.querySelector(`#error-${fieldName}`);
            if (errorMessage) {
                errorMessage.textContent = `Maximum size file is ${maxSizeMB} MB`;
            }
            return;
        }
    
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
            const base64data = reader.result as string;
            const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove file extension
            const fileType = `.${file.name.split('.').pop()}`; // Add dot to file type
    
            const payload = {
                document_data: base64data,
                file_name: fileName,
                file_type: fileType
            };
    
            try {
                const response = await fetch(endpoint.replace('{idPeserta}', idPeserta), {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                    body: JSON.stringify(payload),
                });
    
                const responseData = await response.json();
                if (responseData.responseCode === '000') {
                    toast.success("Document submitted successfully", { style: { backgroundColor: 'white', color: 'green' } });
                    setShowPreviewButtons(prev => ({ ...prev, [fieldName]: true })); // Show preview button for the specific field
                    setUploadedFiles(prev => ({ ...prev, [fieldName]: file })); // Store the uploaded file for the specific field
                } else {
                    toast.error("Failed to submit document: " + responseData.responseMessage, { style: { backgroundColor: 'white', color: 'red' } });
                }
            } catch (error) {
                console.error('Error submitting document:', error);
                alert('An error occurred. Please try again.');
            }
        };
    };
    

    const handleApplyNow = async () => {
        const token = localStorage.getItem('token');
        if (!token || !idPeserta) return;
    
        let allDocumentsUploaded = true;
    
        requiredDocuments.forEach(doc => {
            const docName = doc[3].toLowerCase().replace(/\s+/g, '-');
            const inputField = document.querySelector(`input[name="${docName}"]`);
            const errorMessage = document.querySelector(`#error-${docName}`);
    
            if (!uploadedFiles[docName]) {
                allDocumentsUploaded = false;
                if (inputField !== null) {
                    inputField.classList.add('border-red-500');
                    if (errorMessage) {
                        errorMessage.textContent = 'Please upload this document.';
                        setTimeout(() => {
                            errorMessage.textContent = '';
                            inputField.classList.remove('border-red-500');
                        }, 3000);
                    }
                }
            } else {
                if (errorMessage) {
                    errorMessage.textContent = '';
                }
            }
        });
    
        if (!allDocumentsUploaded) {
            return;
        }
    
        if (isHeightMandatory && (tinggiBadan === null)) {
            setTinggiBadanError('Anda harus mengisikan field ini');
            return;
        }
    
        if (isHeightMandatory && (beratBadan === null)) {
            setBeratBadanError('Anda harus mengisikan field ini');
            return;
        }
    
        setIsAgreementDialogOpen(true);
    };
    
    const isApplyButtonDisabled = () => {
        if (isHeightMandatory && (tinggiBadan === null || beratBadan === null)) {
            return true;
        }
    
        return requiredDocuments.some(doc => !uploadedFiles[doc[3].toLowerCase().replace(/\s+/g, '-')]);
    };

    const handleAgreementSubmit = async () => {
        if (!agreements.recruitment || !agreements.dataUsage || !agreements.holdDiploma) {
            setAgreementError('Please check all the boxes to proceed.');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token || !idPeserta) return;

        const payload = {
            id_peserta: idPeserta,
            id_user_documents: idUserDocuments,
            tinggi_badan: tinggiBadan,
            berat_badan: beratBadan,
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/lowongan/slug/${slug}/apply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const responseData = await response.json();
            if (responseData.responseCode === '000') {
                toast.success("Application submitted successfully", { style: { backgroundColor: 'white', color: 'green' } });
                setTimeout(() => {
                    router.push('/karir');
                }, 3000);
            } else {
                toast.error("Failed to submit application: " + responseData.responseMessage, { style: { backgroundColor: 'white', color: 'red' } });
            }
        } catch (error) {
            console.error('Error submitting application:', error);
            alert('An error occurred. Please try again.');
        }
    };

    const handleSubmitCv = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const idPeserta = await getIdFromToken(token);
        if (!idPeserta) return;

        const profileData = await fetchProfileDetails(idPeserta);
        if (!profileData || !isProfileDataComplete(profileData)) {
            setIsProfileIncompleteDialogOpen(true);
            return;
        }

        const isProfileComplete = await checkProfileCompletion(idPeserta);
        if (!isProfileComplete) {
            setIsProfileIncompleteDialogOpen(true);
            return;
        }

        setIsSubmitCvDialogOpen(true);
    };

    const handleSubmitCvOk = () => {
        if (!agreements.submitCv) {
            setAgreementError('Please check the box to proceed.');
        } else {
            setIsSubmitCvDialogOpen(false);
            setAgreementError('');
            setAgreements({ ...agreements, submitCv: true }); // Check the checkbox
            handleApply(); // Call handleApply to hit the apply endpoint
        }
    };

    const handleAgreementSubmitForCv = async () => {
        if (!agreements.submitCv) {
            setAgreementError('Silahkan ceklist persetujuan untuk melanjutkan.');
            return;
        }
    
        const token = localStorage.getItem('token');
        if (!token || !idPeserta) return;
    
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/history/peserta/id/${idPeserta}`, {
                method: 'GET',
                headers: getHeaders(token),
            });
    
            const responseData = await response.json();
            if (responseData.responseCode === '000') {
                if (!responseData.data.isRekrutmen) {
                    setIsCvSubmitWarningDialogOpen(true);
                    return;
                }
            } else {
                toast.error("Failed to fetch application history: " + responseData.responseMessage, { style: { backgroundColor: 'white', color: 'red' } });
                return;
            }
        } catch (error) {
            console.error('Error fetching application history:', error);
            alert('An error occurred. Please try again.');
            return;
        }
    
        const payload = {
            id_peserta: idPeserta,
        };
    
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/lowongan/slug/${slug}/applyJobdesc`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
                body: JSON.stringify(payload),
            });
    
            const responseData = await response.json();
            if (responseData.responseCode === '000') {
                toast.success("Application submitted successfully", { style: { backgroundColor: 'white', color: 'green' } });
                setTimeout(() => {
                    router.push('/karir');
                }, 3000);
            } else {
                toast.error("Failed to submit application: " + responseData.responseMessage, { style: { backgroundColor: 'white', color: 'red' } });
            }
        } catch (error) {
            console.error('Error submitting application:', error);
            alert('An error occurred. Please try again.');
        }
    };

    if (!isAuthenticated) {
        return null; // Return null during SSR to avoid hydration mismatch
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-200 font-sans relative">
            <MenuBar />
            <div className="pt-28 bg-gradient-to-r from-[#015CAC] to-[#018ED2] relative z-10">
                <div className="bg-white relative z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                        <defs>
                            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%">
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
            </div>
            <main className="relative z-10 -mt-32">
                <div className="flex flex-col justify-center items-center w-full bg-white h-min-[400px] relative z-10">
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
                            <motion.div 
                                className="w-11/12 lg:w-4/5 mt-6 mb-10"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
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
                                            <a
                                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                                                className="text-blue-500"
                                                title="Share on Facebook"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <FontAwesomeIcon icon={faFacebookF} />
                                            </a>
                                            <a
                                                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(window.location.href)}`}
                                                className="text-green-500"
                                                title="Share on WhatsApp"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <FontAwesomeIcon icon={faWhatsapp} />
                                            </a>
                                            <a
                                                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`}
                                                className="text-blue-400"
                                                title="Share on Twitter"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <FontAwesomeIcon icon={faTwitter} />
                                            </a>
                                            <a
                                                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}`}
                                                className="text-blue-700"
                                                title="Share on LinkedIn"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <FontAwesomeIcon icon={faLinkedinIn} />
                                            </a>
                                        </div>
                                        <div className="flex justify-center mt-8">
                                            {(status === '1' || status === '4') && (
                                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                                    <DialogTrigger asChild>
                                                        <button
                                                            className={`py-2 px-6 rounded-lg shadow-lg transition duration-300 transform ${isLocked ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-darkBlue text-white hover:bg-blue-700 hover:scale-105'}`}
                                                            onClick={isLocked ? undefined : (status === '4' ? handleSubmitCv : handleApply)}
                                                            disabled={isLocked}
                                                        >
                                                            {status === '4' ? (
                                                                'Submit'
                                                            ) : (
                                                                isLocked ? 'Anda sudah mendaftar pada periode ini' : 'Apply'
                                                            )}
                                                        </button>
                                                    </DialogTrigger>
                                                    <DialogContent className="overflow-y-auto max-h-[80vh] w-full md:w-[80vw] lg:w-[60vw] p-6 bg-white rounded-lg shadow-lg">
                                                        <DialogTitle className="text-lg md:text-xl font-semibold text-darkBlue">{status === '4' ? 'Submit CV' : 'Submit Berkas Lamaran'}</DialogTitle>
                                                        <DialogDescription className="text-sm md:text-base mt-2 text-gray-700">
                                                            {status === '4' ? (
                                                                <>
                                                                    Pastikan data pada profil Anda adalah data terbaru. Mengunggah Curriculum Vitae (CV) bukan berarti Anda telah mengajukan lamaran. Ketika ada lowongan yang telah dibuka, Anda diwajibkan melengkapi berkas persyaratan dan melakukan pendaftaran sesuai dengan posisi yang diinginkan. Informasi selanjutnya akan diberitahukan melalui email.
                                                                    <FormGroup className="mt-4 space-y-4">
                                                                        <FormControlLabel
                                                                            control={<Checkbox checked={agreements.submitCv} onChange={(e) => setAgreements({ ...agreements, submitCv: e.target.checked })} />}
                                                                            label="Saya setuju dengan syarat dan ketentuan."
                                                                            className="text-gray-700"
                                                                        />
                                                                    </FormGroup>
                                                                    {agreementError && <p className="text-red-500 text-sm mt-2">{agreementError}</p>}
                                                                    <DialogFooter className="mt-6 flex justify-end">
                                                                        <button
                                                                            onClick={handleAgreementSubmitForCv}
                                                                            className="bg-darkBlue text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                                                                        >
                                                                            Submit
                                                                        </button>
                                                                    </DialogFooter>
                                                                </>
                                                            ) : (
                                                                'Pastikan data pada profil Anda adalah data terbaru dan silakan melengkapi berkas lamaran Anda untuk melanjutkan pendaftaran.'
                                                            )}
                                                        </DialogDescription>
                                                        {status !== '4' && (
                                                            <div className="flex flex-col gap-6 mt-4">
                                                                {requiredDocuments.map((doc) => (
                                                                    <form key={doc[1]} onSubmit={handleSubmit((data) => handleFileSubmit(data, `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/${idPeserta}/submit-${doc[3].toLowerCase().replace(/\s+/g, '-')}`, doc[3].toLowerCase().replace(/\s+/g, '-'), doc[5]))} className="flex flex-col md:flex-row items-center bg-gray-50 p-4 rounded-lg shadow-sm">
                                                                        <div className="flex-1 mb-4 md:mb-0 md:mr-4">
                                                                            <label className="block text-sm font-medium text-gray-700">Upload {doc[3]}</label>
                                                                            {!showPreviewButtons[doc[3].toLowerCase().replace(/\s+/g, '-')] && (
                                                                                <>
                                                                                    <input type="file" {...register(doc[3].toLowerCase().replace(/\s+/g, '-'))} accept="application/pdf, image/jpeg" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                                                                                    <p className="text-gray-500 text-sm mt-1">Format file: PDF, JPG</p>
                                                                                    <p className="text-gray-500 text-sm mt-1">Ukuran maksimal file: {doc[5]} MB</p>
                                                                                    <p id={`error-${doc[3].toLowerCase().replace(/\s+/g, '-')}`} className="text-red-500 text-sm mt-1"></p>
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                        {!showPreviewButtons[doc[3].toLowerCase().replace(/\s+/g, '-')] && (
                                                                            <DialogFooter className="w-full md:w-auto">
                                                                                <button type="submit" className="bg-darkBlue text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 w-full md:w-auto">Simpan</button>
                                                                            </DialogFooter>
                                                                        )}
                                                                        {showPreviewButtons[doc[3].toLowerCase().replace(/\s+/g, '-')] && uploadedFiles[doc[3].toLowerCase().replace(/\s+/g, '-')] && (
                                                                            <>
                                                                                <button onClick={() => {
                                                                                    const file = uploadedFiles[doc[3].toLowerCase().replace(/\s+/g, '-')];
                                                                                    if (file) {
                                                                                        window.open(URL.createObjectURL(file), '_blank');
                                                                                    }
                                                                                }} className="bg-gray-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-700 transition duration-300 w-full md:w-auto ml-4">Preview</button>
                                                                                <button onClick={() => setShowPreviewButtons(prev => ({ ...prev, [doc[3].toLowerCase().replace(/\s+/g, '-')]: false }))} className="bg-yellow-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-yellow-700 transition duration-300 w-full md:w-auto ml-4">Change File</button>
                                                                            </>
                                                                        )}
                                                                    </form>
                                                                ))}
                                                                {isHeightMandatory && (
                                                                    <>
                                                                        <div className="flex flex-col md:flex-row items-center bg-gray-50 p-4 rounded-lg shadow-sm">
                                                                            <div className="flex-1 mb-4 md:mb-0 md:mr-4">
                                                                                <label className="block text-sm font-medium text-gray-700">Tinggi Badan (cm)</label>
                                                                                <div className="relative mt-1">
                                                                                    <input
                                                                                        type="number"
                                                                                        value={tinggiBadan || ''}
                                                                                        onChange={(e) => setTinggiBadan(parseInt(e.target.value))}
                                                                                        className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                                                    />
                                                                                    {tinggiBadanError && (
                                                                                        <p className="absolute text-red-500 text-sm mt-1">{tinggiBadanError}</p>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex flex-col md:flex-row items-center bg-gray-50 p-4 rounded-lg shadow-sm">
                                                                            <div className="flex-1 mb-4 md:mb-0 md:mr-4">
                                                                                <label className="block text-sm font-medium text-gray-700">Berat Badan (kg)</label>
                                                                                <div className="relative mt-1">
                                                                                    <input
                                                                                        type="number"
                                                                                        value={beratBadan || ''}
                                                                                        onChange={(e) => setBeratBadan(parseInt(e.target.value))}
                                                                                        className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                                                    />
                                                                                    {beratBadanError && (
                                                                                        <p className="absolute text-red-500 text-sm mt-1">{beratBadanError}</p>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                )}
                                                                <div className="flex justify-end mt-4">
                                                                    <button onClick={handleApplyNow} className={`bg-darkBlue text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 w-full md:w-auto ${isApplyButtonDisabled() ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isApplyButtonDisabled()}>Apply Now</button>
                                                                    {showPreviewButton && uploadedFile && (
                                                                        <>
                                                                            <button onClick={() => {
                                                                                if (uploadedFile) {
                                                                                    window.open(URL.createObjectURL(uploadedFile), '_blank');
                                                                                }
                                                                            }} className="bg-gray-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-700 transition duration-300 w-full md:w-auto ml-4">Preview</button>
                                                                            <button onClick={() => setShowPreviewButton(false)} className="bg-yellow-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-yellow-700 transition duration-300 w-full md:w-auto ml-4">Change File</button>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </DialogContent>
                                                </Dialog>
                                            )}
                                        </div>
                                        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="col-span-2">
                                                <h2 className="font-semibold text-lg text-darkBlue mb-4">TENTANG PEKERJAAN</h2>
                                                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                                                    <div className="prose prose-blue">
                                                        <p dangerouslySetInnerHTML={{ __html: article.tentangPekerjaan }} />
                                                    </div>
                                                </div>
                                                <h2 className="font-semibold text-lg text-darkBlue mt-6 mb-4">PERSYARATAN</h2>
                                                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                                                    <div className="prose prose-blue">
                                                        <p dangerouslySetInnerHTML={{ __html: article.persyaratan }} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-gray-100 p-4 rounded-lg md:sticky md:top-28">
                                                <h2 className="font-semibold text-lg">Periode Pendaftaran</h2>
                                                <p>
                                                    {status === '4' ? '-' : (
                                                        <span>
                                                            {new Date(article.periodeAwal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: new Date(article.periodeAwal).getFullYear() !== new Date(article.periodeAkhir).getFullYear() ? 'numeric' : undefined })} s/d{' '}
                                                            {new Date(article.periodeAkhir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                        </span>
                                                    )}
                                                </p>
                                                <h2 className="font-semibold text-lg mt-4">Lokasi Tes</h2>
                                                <p>{status === '4' ? '-' : 'Yogyakarta'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Tahapan Seleksi Section */}
                            <motion.div 
                                className="w-11/12 lg:w-4/5 mt-6 mb-10"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="bg-white shadow-lg rounded-lg overflow-hidden p-4">
                                    <h2 className="text-darkBlue font-bold text-xl mb-4">Tahapan Seleksi</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                        {tahapan.map((step) => (
                                            <motion.div 
                                                key={step.idTahapan} 
                                                className="flex flex-col items-center bg-blue-100 p-4 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105"
                                                whileHover={{ scale: 1.1 }}
                                            >
                                                <div className={`bg-blue-500 text-white w-12 h-12 flex items-center justify-center rounded-full mb-2 ${step.isActive ? 'animate-bounce' : ''}`}>
                                                    {tahapan.findIndex(t => t.idTahapan === step.idTahapan) + 1}
                                                </div>
                                                <p className="text-center text-sm font-medium text-darkBlue">
                                                    {step.namaTahapan}
                                                </p>
                                                <p className="text-center text-xs text-gray-600 mt-2">
                                                    {step.deskripsi}
                                                </p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </div>

                <FooterSection />
                <FooterCopyright />
            </main>

            <ScrollToTopButton />
            <CariKarirButton />
            <Dialog open={isAgreementDialogOpen} onOpenChange={setIsAgreementDialogOpen}>
                <DialogContent className="overflow-y-auto max-h-[80vh] w-full md:w-[80vw] lg:w-[60vw] p-4 md:p-6 bg-white rounded-lg shadow-lg">
                    <DialogTitle className="text-lg md:text-xl font-semibold text-darkBlue">Persetujuan</DialogTitle>
                    <DialogDescription className="text-sm md:text-base mt-2 text-gray-700">
                        Silakan menyetujui syarat dan ketentuan berikut untuk melanjutkan aplikasi Anda.
                    </DialogDescription>
                    <FormGroup className="mt-4 space-y-4">
                        <FormControlLabel
                            control={<Checkbox checked={agreements.recruitment} onChange={(e) => setAgreements({ ...agreements, recruitment: e.target.checked })} />}
                            label="Saya bersedia memberikan/menyerahkan/mengisi data pribadi saya kepada PT Bank BPD DIY untuk memproses dan/atau menggunakan dan/atau memanfaatkan data pribadi tersebut sebatas keperluan rekrutmen Bank."
                            className="text-gray-700"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={agreements.dataUsage} onChange={(e) => setAgreements({ ...agreements, dataUsage: e.target.checked })} />}
                            label="Data dan dokumen yang saya input melalui web rekrutmen Bank BPD DIY adalah benar dan sesuai dengan data diri saya."
                            className="text-gray-700"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={agreements.holdDiploma} onChange={(e) => setAgreements({ ...agreements, holdDiploma: e.target.checked })} />}
                            label="Apabila terdapat ketidakbenaran atas data dan dokumen tersebut, saya bertanggung jawab penuh atas segala akibatnya."
                            className="text-gray-700"
                        />
                    </FormGroup>
                    {agreementError && <p className="text-red-500 text-sm mt-2">{agreementError}</p>}
                    <DialogFooter className="mt-6 flex justify-end">
                        <button onClick={handleAgreementSubmit} className="bg-darkBlue text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
                            Apply
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={isProfileIncompleteDialogOpen} onOpenChange={() => {}}>
                <DialogContent className="overflow-y-auto max-h-[80vh] w-full md:w-[80vw] lg:w-[60vw] p-4 md:p-6 bg-white rounded-lg shadow-lg">
                    <DialogTitle className="text-lg md:text-xl font-semibold text-darkBlue">Data Profil Tidak Lengkap</DialogTitle>
                    <DialogDescription className="text-sm md:text-base mt-2 text-gray-700">
                        Data anda belum lengkap silahkan lengkapi data Anda dan kembali ke halaman ini.
                    </DialogDescription>
                    <DialogFooter className="mt-6 flex justify-end">
                        <button onClick={() => { router.push('/profil'); }} className="bg-darkBlue text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
                            Lengkapi data
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={isCvSubmitWarningDialogOpen} onOpenChange={setIsCvSubmitWarningDialogOpen}>
                <DialogContent className="overflow-y-auto max-h-[80vh] w-full md:w-[80vw] lg:w-[60vw] p-4 md:p-6 bg-white rounded-lg shadow-lg">
                    <DialogTitle className="text-lg md:text-xl font-semibold text-darkBlue">Peringatan</DialogTitle>
                    <DialogDescription className="text-sm md:text-base mt-2 text-gray-700">
                        Anda hanya bisa submit CV sekali, silahkan perbarui data anda secara berkala di halaman profil.
                    </DialogDescription>
                    <DialogFooter className="mt-6 flex justify-end">
                        <button onClick={() => setIsCvSubmitWarningDialogOpen(false)} className="bg-darkBlue text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
                            OK
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default DetailKarir;
