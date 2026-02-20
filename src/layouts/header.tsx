import { useAuthContext } from "@/contexts/auth/auth-context";
import { appRoutes, appRoutesCollection } from "@/routes";
import {
    Search,
    Bell,
    LogOut,
    Home,
    Menu,
} from 'lucide-react';
import { matchPath, useLocation, useNavigate } from "react-router-dom";
import UserDropdown from "./dropdown-user";
import type { User as UserType } from "@/@types/users";


interface HeaderProps {
    onMenuClick: () => void;
    isMobile: boolean;
}

const Header = ({ onMenuClick, isMobile }: HeaderProps) => {

    const {
        user,
        removeUser
    } = useAuthContext();

    const { pathname } = useLocation();
    const activeRoute = appRoutesCollection.find(route => matchPath({ path: route.path, end: true }, pathname));

    const navigate = useNavigate();

    const dropdownItems = [
        {
            label: "Dashboard",
            icon: Home,
            onClick: () => {
                navigate(appRoutes.dashboard.path);
            },
        },
       
        {
            label: "Logout",
            icon: LogOut,
            onClick: () => {
                removeUser();
            },
        },
    ];

    return (
        <header className={`absolute top-0 right-0 ${isMobile ? 'left-0' : 'left-56'} h-18 bg-white/90 backdrop-blur-xl border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 z-10 transition-all duration-300`}>
            <div className="flex items-center gap-4">
                {/* Mobile Menu Button */}
                {isMobile && (
                    <button
                        onClick={onMenuClick}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <Menu className="w-5 h-5 text-gray-600" />
                    </button>
                )}

                <div>
                    <h2 className="text-[17px] md:text-lg lg:text-xl font-semibold text-slate-800">
                        {activeRoute?.title || 'Dashboard'}
                    </h2>
                </div>
            </div>

            <div className="flex items-center gap-3 lg:gap-4">
                {/* Search - Hidden on mobile, simplified on tablet */}
                <div className={`relative ${isMobile ? 'hidden' : 'lg:block'}`}>
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder={isMobile ? "Search..." : "enter order number or customer name..."}
                        className={`pl-10 pr-4 py-2.5 ${isMobile ? 'w-40' : 'lg:w-80'} bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all shadow-sm`}
                    />
                </div>

                {/* Mobile Search Icon */}
                {isMobile && (
                    <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                        <Search className="w-5 h-5 text-gray-600" />
                    </button>
                )}

                {/* Notifications */}
                <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-linear-to-r from-red-500 to-amber-600 rounded-full animate-pulse"></div>
                </button>

                {/* User Dropdown */}
                <div className={isMobile ? "scale-90" : ""}>
                    <UserDropdown user={user?.user as UserType} items={dropdownItems} />
                </div>
            </div>
        </header>
    )
}

export default Header