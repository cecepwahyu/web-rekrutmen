import { ReactNode } from 'react';

type LayoutProps = {
    children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
    return (
        <div>
            {/* Add your header, footer, or other layout components here */}
            {children}
        </div>
    );
};

export default Layout;
