import { useState } from "react";
import { User, ChevronDown, type LucideIcon } from "lucide-react";
import type { AuthUser } from "@/@types/users";

 interface DropdownItem {
  label: string;
  icon?: LucideIcon;
  onClick?: () => void;
}

type UserDropdownProps = {
    user: AuthUser["user"];
    items: DropdownItem[];
}

const UserDropdown = ({ user, items = [] }: UserDropdownProps) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
            </div>

            {/* Trigger Button */}
            <button
                onClick={() => setOpen(!open)}
                className="relative w-10 h-10 bg-linear-to-br from-primary-foreground via-primary-foreground/80 to-primary-foreground rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
                <User className="w-5 h-5 text-primary" />
                <ChevronDown
                    className={`absolute -bottom-1 right-0 w-3 h-3 text-white transition-transform duration-200 ${open ? "rotate-180" : ""
                        }`}
                />
            </button>

            {/* Dropdown Menu */}
            {open && (
                <div className="absolute right-0 top-14 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 animate-in fade-in-10 slide-in-from-top-2">
                    {items.map((item, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                item.onClick?.();
                                setOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            {item.icon && <item.icon className="w-4 h-4 text-gray-500" />}
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserDropdown;
