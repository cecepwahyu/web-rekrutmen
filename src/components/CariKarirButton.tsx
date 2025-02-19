// components/CariKarirButton.tsx

const CariKarirButton = () => {
    const handleClick = () => {
        window.location.href = '/karir';
    };

    return (
        <button
            className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white px-6 py-3 rounded-full shadow-xl flex items-center transition-transform transform hover:scale-105 duration-300 z-50"
            aria-label="Temukan Karir"
            onClick={handleClick}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6 mr-2"
            >
                <path
                    d="M4 12H3V8C3 6.89543 3.89543 6 5 6H9M4 12V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V12M4 12H10M20 12H21V8C21 6.89543 20.1046 6 19 6H15M20 12H14M14 12V10H10V12M14 12V14H10V12M9 6V5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V6M9 6H15"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Cari Karir
        </button>
    );
};

export default CariKarirButton;