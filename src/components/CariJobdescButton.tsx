// components/CariKarirButton.tsx

import { useState } from "react";
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
                        <DropdownMenuItem onClick={() => window.location.href = '/karir/jobdescA'}>
                            Jobdesc A
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.location.href = '/karir/jobdescB'}>
                            Jobdesc B
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                )}
            </DropdownMenu>
        </div>
    );
};

export default CariJobdescButton;