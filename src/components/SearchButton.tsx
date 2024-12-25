// components/SearchButton.tsx
import React from 'react';
import Image from 'next/image';

type SearchButtonProps = {
    onClick: () => void;
    className?: string;
};

const SearchButton: React.FC<SearchButtonProps> = ({ onClick, className = '' }) => {
    return (
        <button onClick={onClick} className={`flex items-center justify-center px-4 py-2 bg-darkBlue text-white rounded-lg ${className}`}>
            <Image src="/searchIcon.svg" alt="Search Icon" width={16} height={16} />
        </button>
    );
};

export default SearchButton;
