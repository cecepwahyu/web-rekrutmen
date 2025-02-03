// components/CariKarirButton.tsx

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

const CariJobdescButton = () => {
    const [showOptions, setShowOptions] = useState(false);
    const [jobdescs, setJobdescs] = useState<{ posisi: string, slug: string }[]>([]);

    useEffect(() => {
        const fetchJobdescs = async () => {
            try {
                const token = localStorage.getItem("token"); // Get token from localStorage
                if (!token) {
                    console.error("No token found in localStorage");
                    return;
                }

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/lowongan/jobdesc/paginated?page=0`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (data.responseCode === "000") {
                    const jobdescList = data.data.content.map((job: any) => ({
                        posisi: job.posisi,
                        slug: job.slug
                    }));
                    setJobdescs(jobdescList);
                }
            } catch (error) {
                console.error("Error fetching job descriptions:", error);
            }
        };

        fetchJobdescs();
    }, []);

    const handleClick = () => {
        setShowOptions(!showOptions);
    };

    return (
        <div className="fixed bottom-8 right-8 z-50">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white px-6 py-3 rounded-full shadow-xl flex items-center transition-transform transform hover:scale-105 duration-300"
                        aria-label="Temukan Karir"
                        onClick={handleClick}
                    >
                        {/* <FontAwesomeIcon icon={faChevronDown} className="h-6 w-6 mr-2" /> */}
                        Cari Job Desc
                    </button>
                </DropdownMenuTrigger>
                {showOptions && (
                    <DropdownMenuContent className="mb-2 flex flex-col items-center space-y-2">
                        {jobdescs.map((jobdesc, index) => (
                            <DropdownMenuItem key={index} onClick={() => window.location.href = `/karir/${jobdesc.slug}`}>
                                {jobdesc.posisi}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                )}
            </DropdownMenu>
        </div>
    );
};

export default CariJobdescButton;