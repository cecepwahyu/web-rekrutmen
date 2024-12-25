import Link from 'next/link';

const DesktopNavLinks = () => {
    return (
        <ul className="flex space-x-8">
            <li>
                <Link href="/">
                    <a className="text-darkBlue hover:text-blue-500">Home</a>
                </Link>
            </li>
            <li>
                <Link href="/karir">
                    <a className="text-darkBlue hover:text-blue-500">Karir</a>
                </Link>
            </li>
            <li>
                <Link href="/info-artikel">
                    <a className="text-darkBlue hover:text-blue-500">Info & Artikel</a>
                </Link>
            </li>
            {/* Add more links as needed */}
        </ul>
    );
};

export default DesktopNavLinks;
