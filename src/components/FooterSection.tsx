import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram, faYoutube } from "@fortawesome/free-brands-svg-icons";

const FooterSection = () => {
    const currentYear = new Date().getFullYear();

    return (
        <div className="bg-white pt-14 px-6 md:px-12 lg:px-24 text-black pb-8">
            {/* Responsive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:justify-center text-left lg:px-24">
                {/* Office Information */}
                <div className="flex flex-col items-start lg:items-center">
                    <h2 className="text-xl font-bold text-darkBlue mb-4">Kantor Pusat</h2>
                    <p className="text-sm text-gray-700 leading-relaxed">
                        Jl. Tentara Pelajar No.7, Bumijo, Kec. Jetis, Kota Yogyakarta, Daerah Istimewa Yogyakarta 55231
                        <br />
                        <br />
                        PHONE : +62274561614
                        <br />
                        EMAIL : sdm@bpddiy.co.id
                        <br />
                        FAX : +62274561614
                        <br />
                    </p>
                </div>

                {/* Contact Us */}
                <div className="flex flex-col items-start lg:items-center">
                    <h2 className="text-xl font-bold text-darkBlue mb-4">Hubungi Kami</h2>
                    <ul className="text-sm text-gray-700 space-y-4">
                        <li>
                            <button
                                onClick={() => window.open("https://www.facebook.com/bpddiy.official/", "_blank")}
                                className="flex items-center justify-start lg:justify-center hover:text-blue-700 transition"
                            >
                                <FontAwesomeIcon icon={faFacebook} className="mr-2" />
                                FACEBOOK
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => window.open("https://www.instagram.com/bpddiy", "_blank")}
                                className="flex items-center justify-start lg:justify-center hover:text-purple-700 transition"
                            >
                                <FontAwesomeIcon icon={faInstagram} className="mr-2" />
                                INSTAGRAM
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => window.open("https://www.youtube.com/@bankbpddiy4861", "_blank")}
                                className="flex items-center justify-start lg:justify-center hover:text-red-700 transition"
                            >
                                <FontAwesomeIcon icon={faYoutube} className="mr-2" />
                                YOUTUBE
                            </button>
                        </li>
                    </ul>
                </div>

                {/* Placeholder for Future Content */}
                <div className="flex flex-col items-start lg:items-center"></div>
            </div>
        </div>
    );
};

export default FooterSection;
