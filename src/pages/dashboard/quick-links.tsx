import { Link } from "react-router-dom";
import {
    PlusCircle,
    UserPlus,
    ListOrdered,
    ArrowUpRight,
    Star,
    LayoutDashboard,
    Users
} from "lucide-react";
import { permissions } from "@/config/permissions";
import { hasPermission } from "@/utils/auth";
import { motion } from "framer-motion";

const QUICK_LINKS = [
    {
        label: "Create Order",
        icon: PlusCircle,
        path: "/orders/new",
        permission: permissions.createOrder,
        iconColor: "text-blue-500",
        iconContainerBg: "bg-blue-500/10 ring-blue-500/20",
        hoverGlow: "group-hover:shadow-blue-500/20"
    },
    {
        label: "Register Customer",
        icon: UserPlus,
        path: "/customers/new",
        permission: permissions.createCustomer,
        iconColor: "text-emerald-500",
        iconContainerBg: "bg-emerald-500/10 ring-emerald-500/20",
        hoverGlow: "group-hover:shadow-emerald-500/20"
    },
    {
        label: "View Orders",
        icon: ListOrdered,
        path: "/orders",
        permission: permissions.viewOrders,
        iconColor: "text-amber-500",
        iconContainerBg: "bg-amber-500/10 ring-amber-500/20",
        hoverGlow: "group-hover:shadow-amber-500/20"
    },
    {
        label: "Track Inflows",
        icon: ArrowUpRight,
        path: "/inflows",
        permission: permissions.viewInflows,
        iconColor: "text-indigo-500",
        iconContainerBg: "bg-indigo-500/10 ring-indigo-500/20",
        hoverGlow: "group-hover:shadow-indigo-500/20"
    },
    {
        label: "Manage Reviews",
        icon: Star,
        path: "/reviews",
        permission: permissions.viewReviews,
        iconColor: "text-rose-500",
        iconContainerBg: "bg-rose-500/10 ring-rose-500/20",
        hoverGlow: "group-hover:shadow-rose-500/20"
    },
    {
        label: "Staff Mgmt",
        icon: Users,
        path: "/staff-mgmt",
        permission: permissions.viewUsers,
        iconColor: "text-slate-400",
        iconContainerBg: "bg-slate-500/10 ring-slate-500/20",
        hoverGlow: "group-hover:shadow-slate-500/20"
    }
];

export default function QuickLinks() {
    const allowedLinks = QUICK_LINKS.filter(link => hasPermission(link.permission));

    if (allowedLinks.length === 0) return null;

    return (
        <section className="mb-8">
            <div className="flex items-center gap-2.5 mb-6">
                <div className="p-2 rounded-xl bg-primary text-primary-foreground shadow-lg ring-1 ring-white/10">
                    <LayoutDashboard className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Fast Access</h2>
                    <div className="h-1 w-12 bg-primary rounded-full mt-1" />
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
                {allowedLinks.map((link, index) => (
                    <motion.div
                        key={link.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            duration: 0.5,
                            delay: index * 0.05,
                            ease: [0.16, 1, 0.3, 1]
                        }}
                    >
                        <Link
                            to={link.path}
                            className={`group relative flex flex-col items-center p-5 rounded-[2rem] bg-primary-foreground shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] border border-gray-200 ${link.hoverGlow}`}
                        >
                            {/* Accent Light (Differentiated by color) */}
                            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 blur-md opacity-50 group-hover:opacity-100 transition-opacity ${link.iconColor.replace('text-', 'bg-')}`} />

                            <div className={`w-13 h-13 rounded-2xl ${link.iconContainerBg} flex items-center justify-center mb-4 transition-all duration-500 group-hover:rotate-[10deg] group-hover:scale-110 ring-1`}>
                                <link.icon className={`w-6 h-6 ${link.iconColor} filter drop-shadow-[0_0_8px_rgba(current-color,0.5)]`} />
                            </div>

                            <span className="text-sm font-medium text-primary uppercase group-hover:text-primary transition-colors text-center leading-tight">
                                {link.label}
                            </span>

                            {/* Corner Decoration */}
                            <div className="absolute bottom-3 right-3 opacity-10 group-hover:opacity-30 transition-opacity">
                                <PlusCircle className="w-4 h-4 text-white" />
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
