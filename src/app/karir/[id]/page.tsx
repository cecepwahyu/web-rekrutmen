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
    });
    const [agreementError, setAgreementError] = useState('');
    const [minHeight, setMinHeight] = useState<number | null>(null);
    const [isHeightMandatory, setIsHeightMandatory] = useState<boolean>(false);
    const [tinggiBadan, setTinggiBadan] = useState<number | null>(null);
    const [beratBadan, setBeratBadan] = useState<number | null>(null);
    const [tinggiBadanError, setTinggiBadanError] = useState<string>('');
    const [beratBadanError, setBeratBadanError] = useState<string>('');

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
                    setIsLocked(data.data === 'true');
                }
            } catch (error) {
                console.error('Error fetching lock status:', error);
            }
        };

        fetchLockStatus();
    }, [idPeserta]);

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
        setIsDialogOpen(true);
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

    const handleFileSubmit = async (data: any, endpoint: string, fieldName: string, maxSizeMB: number) => {
        const token = localStorage.getItem('token');
        if (!token) return;
    
        const idPeserta = await getIdFromToken(token);
        if (!idPeserta) return;
    
        console.log('Form data:', data);
        console.log('Field name:', fieldName);
        console.log('File data:', data[fieldName]);
    
        const file = data[fieldName][0];
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
                    reset();
                    // Change the input field to a preview button
                    const inputField = document.querySelector(`input[name="${fieldName}"]`);
                    if (inputField) {
                        const previewButton = document.createElement('button');
                        previewButton.textContent = 'Preview';
                        previewButton.className = 'bg-blue-500 text-white py-2 px-4 rounded-lg';
                        previewButton.onclick = () => window.open(URL.createObjectURL(file), '_blank');
                        inputField.replaceWith(previewButton);

                        // Add change/update button
                        const updateButton = document.createElement('button');
                        updateButton.textContent = 'Change/Update Berkas';
                        updateButton.className = 'bg-yellow-500 text-white py-2 px-4 rounded-lg ml-2';
                        updateButton.onclick = () => {
                            const newInputField = document.createElement('input');
                            newInputField.type = 'file';
                            newInputField.name = fieldName;
                            newInputField.accept = 'application/pdf';
                            newInputField.className = 'mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500';
                            newInputField.onchange = () => {
                                const form = newInputField.closest('form');
                                if (form) {
                                    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                                }
                            };
                            previewButton.replaceWith(newInputField);
                            updateButton.remove(); // Remove the update button
                        };
                        previewButton.after(updateButton);
                    }
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

            if (inputField !== null) {
                allDocumentsUploaded = false;
                inputField.classList.add('border-red-500');
                if (errorMessage) {
                    errorMessage.textContent = 'Please upload this document.';
                    setTimeout(() => {
                        errorMessage.textContent = '';
                        inputField.classList.remove('border-red-500');
                    }, 3000);
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
                                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                                <DialogTrigger asChild>
                                                    <button
                                                        className={`py-2 px-6 rounded-lg shadow-lg transition duration-300 transform ${isLocked ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-darkBlue text-white hover:bg-blue-700 hover:scale-105'}`}
                                                        onClick={isLocked ? undefined : handleApply}
                                                        disabled={isLocked}
                                                    >
                                                        {isLocked ? 'Anda telah mendaftar' : 'Daftar'}
                                                    </button>
                                                </DialogTrigger>
                                                <DialogContent className="overflow-y-auto max-h-[80vh] w-full md:w-[80vw] lg:w-[60vw] p-4 md:p-6 bg-white rounded-lg shadow-lg">
                                                    <DialogTitle className="text-lg md:text-xl font-semibold text-darkBlue">Submit Berkas Lamaran</DialogTitle>
                                                    <DialogDescription className="text-sm md:text-base mt-2 text-gray-700">
                                                        Silakan lengkapi berkas lamaran Anda untuk melanjutkan pendaftaran.
                                                    </DialogDescription>
                                                    <div className="flex flex-col gap-4 mt-4">
                                                        {requiredDocuments.map((doc) => (
                                                            <form key={doc[1]} onSubmit={handleSubmit((data) => handleFileSubmit(data, `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/${idPeserta}/submit-${doc[3].toLowerCase().replace(/\s+/g, '-')}`, doc[3].toLowerCase().replace(/\s+/g, '-'), doc[5]))} className="flex flex-col md:flex-row items-center bg-gray-50 p-4 rounded-lg shadow-sm">
                                                                <div className="flex-1 mb-4 md:mb-0 md:mr-4">
                                                                    <label className="block text-sm font-medium text-gray-700">Upload {doc[3]}</label>
                                                                    <input type="file" {...register(doc[3].toLowerCase().replace(/\s+/g, '-'))} accept="application/pdf" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                                                                    <p id={`error-${doc[3].toLowerCase().replace(/\s+/g, '-')}`} className="text-red-500 text-sm mt-1"></p>
                                                                </div>
                                                                <DialogFooter className="w-full md:w-auto">
                                                                    <button type="submit" className="bg-darkBlue text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 w-full md:w-auto">Simpan</button>
                                                                </DialogFooter>
                                                            </form>
                                                        ))}
                                                        {isHeightMandatory && (
                                                            <>
                                                                <div className="flex flex-col md:flex-row items-center bg-gray-50 p-4 rounded-lg shadow-sm">
                                                                    <div className="flex-1 mb-4 md:mb-0 md:mr-4">
                                                                        <label className="block text-sm font-medium text-gray-700">Tinggi Badan (cm)</label>
                                                                        <input type="number" value={tinggiBadan || ''} onChange={(e) => setTinggiBadan(parseInt(e.target.value))} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                                                                        {tinggiBadanError && <p className="text-red-500 text-sm mt-1">{tinggiBadanError}</p>}
                                                                    </div>
                                                                </div>
                                                                <div className="flex flex-col md:flex-row items-center bg-gray-50 p-4 rounded-lg shadow-sm">
                                                                    <div className="flex-1 mb-4 md:mb-0 md:mr-4">
                                                                        <label className="block text-sm font-medium text-gray-700">Berat Badan (kg)</label>
                                                                        <input type="number" value={beratBadan || ''} onChange={(e) => setBeratBadan(parseInt(e.target.value))} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                                                                        {beratBadanError && <p className="text-red-500 text-sm mt-1">{beratBadanError}</p>}
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )}
                                                        <div className="flex justify-end mt-4">
                                                            <button onClick={handleApplyNow} className="bg-darkBlue text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 w-full md:w-auto">Apply Now</button>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="col-span-2">
                                                <h2 className="font-semibold text-lg">Tentang Pekerjaan</h2>
                                                <p dangerouslySetInnerHTML={{ __html: article.tentangPekerjaan }} />
                                                <h2 className="font-semibold text-lg mt-6">Persyaratan</h2>
                                                <p dangerouslySetInnerHTML={{ __html: article.persyaratan }} />
                                            </div>
                                            <div className="bg-gray-100 p-4 rounded-lg md:sticky md:top-28">
                                                <h2 className="font-semibold text-lg">Periode Pendaftaran</h2>
                                                <p>
                                                    <span>
                                                        {new Date(article.periodeAwal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: new Date(article.periodeAwal).getFullYear() !== new Date(article.periodeAkhir).getFullYear() ? 'numeric' : undefined })} s/d{' '}
                                                        {new Date(article.periodeAkhir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </span>
                                                </p>
                                                <h2 className="font-semibold text-lg mt-4">Lokasi Tes</h2>
                                                <p>Yogyakarta</p>
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
        </div>
    );
};

export default DetailKarir;
