import { FC } from 'react';

interface MobileMenuButtonProps {
    onClick: () => void;
    isScrolled: boolean;
}

const MobileMenuButton: FC<MobileMenuButtonProps> = ({ onClick, isScrolled }) => {
    return (
        <button
            onClick={onClick}
            className={`text-2xl focus:outline-none ${isScrolled ? 'text-darkBlue' : 'text-white'}`}
        >
            &#9776; {/* Hamburger icon */}
        </button>
    );
};

export default MobileMenuButton;
