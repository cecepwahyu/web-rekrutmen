// components/FooterCopyright.tsx

import React from 'react';

const FooterCopyright = () => {
    const currentYear = new Date().getFullYear();
    return (
        <div className="flex relative z-10 bg-darkBlue h-10 items-center">
            <div className="w-full px-4 text-white flex items-center text-xs ml-4 md:ml-32">
                &copy; {currentYear} BANK BPD DIY. All Rights Reserved.
            </div>
        </div>
    );
};

export default FooterCopyright;
