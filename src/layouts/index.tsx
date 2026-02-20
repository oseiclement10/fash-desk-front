import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import Header from "./header";
import { Drawer } from "antd";
import { Palette } from "lucide-react";
import { appConfig } from '@/config/meta';



const FashionLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const body = document.body;
        body.classList.remove("theme-central");
        body.classList.remove("theme-decor");

        body.classList.add("theme-fashion");

        checkMobile();

        window.addEventListener('resize', checkMobile);

        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    const checkMobile = () => {
        setIsMobile(window.innerWidth < 1024);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    const openSidebar = () => {

        setSidebarOpen(true);
    };

    return (
        <div className="h-screen bg-white font-poppins from-slate-50 to-purple-50 flex overflow-hidden">
            <title>{appConfig.name.toUpperCase()}</title>
            {!isMobile && <Sidebar />}

            <Drawer
                title={
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-linear-to-br from-primary to-foreground rounded-xl flex items-center justify-center">
                            <Palette className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold bg-linear-to-r from-primary to-foreground bg-clip-text text-transparent">
                                {appConfig.name}
                            </h1>
                            <p className="text-xs text-gray-700">{appConfig.tagline}</p>
                        </div>
                    </div>
                }
                placement="left"
                onClose={closeSidebar}
                open={sidebarOpen && isMobile}
                width={280}
                styles={{
                    body: {
                        padding: '0',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(20px)'
                    },
                    header: {
                        padding: '16px 20px',
                        borderBottom: '1px solid #e5e7eb'
                    }
                }}
            >
                <Sidebar onItemClick={closeSidebar} />
            </Drawer>

            {/* Main Content Area */}
            <div className={`flex-1 flex flex-col overflow-hidden ${!isMobile ? '' : ''}`}>
                <Header onMenuClick={openSidebar} isMobile={isMobile} />
                <main className="flex-1 mt-16  overflow-y-auto bg-gray-50/30 md:pt-8 pt-6 px-4 md:px-6">
                    <Outlet />
                </main>
            </div>

        </div>
    )
}

export default FashionLayout


