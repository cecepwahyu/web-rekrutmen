import { ReactNode } from 'react';
import MenuBar from "../../components/MenuBar";
import FooterSection from './FooterSection';
import FooterCopyright from './FooterCopyright';
import { ScrollToTopButton } from './ScrollToTopButton';
import CariKarirButton from './CariKarirButton';

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="min-h-screen bg-gray-100 font-sans relative">
            <MenuBar />
            <main className="pt-20 bg-gradient-to-r from-[#015CAC] to-[#018ED2] relative z-10">
                {children}
            </main>
            <FooterSection />
            <FooterCopyright />
            <ScrollToTopButton />
            <CariKarirButton />
        </div>
    );
};

export default Layout;
