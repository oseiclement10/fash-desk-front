import type { OrderStatus, PaymentStatus } from "@/@types/orders";
import type { MenuProps } from "antd";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { FiSend } from "react-icons/fi";
import { TfiExchangeVertical } from "react-icons/tfi";
import { Printer } from "lucide-react";
import { permissions, type PermissionValue } from "@/config/permissions";


export const getOrderColor = (status: OrderStatus) => {
    switch (status) {
        case "pending":
            return "text-blue-700 bg-blue-50 border-blue-200";
        case "cutting":
            return "text-purple-700 bg-purple-50 border-purple-200";
        case "sewing":
            return "text-orange-700 bg-orange-50 border-orange-200";
        case "packaging":
            return "text-amber-700 bg-amber-50 border-amber-200";
        case "delivering":
            return "text-emerald-700 bg-emerald-50 border-emerald-200";
        case "complete":
            return "text-emerald-800 bg-emerald-50 border-emerald-200 font-semibold";
        case "cancelled":
            return "text-red-700 bg-red-50 border-red-200 font-semibold";
        default:
            return "text-violet-700 bg-violet-50 border-violet-200";
    }
};

export const getOrderStatusStyling = (status: OrderStatus) => {
    return `
        inline-flex items-center gap-1 px-2.5 py-1.5 
        rounded-lg border text-xs font-medium 
        capitalize transition-all duration-200
        ${getOrderColor(status)}
    `.trim();
};


export const getPaymentColor = (payment: PaymentStatus): string => {
    switch (payment) {
        case "Full Payment":
            return "bg-emerald-100/70 text-emerald-600";
        case "Part Payment":
            return "bg-amber-100/70 text-amber-500";
        default:
            return "bg-red-100/70 text-red-600";
    }
}


export const getPaymentStatus = (price: number, paid: number): PaymentStatus => {

    const priceVal = parseFloat(`${price}`);
    const paidVal = parseFloat(`${paid}`);

    return paidVal >= priceVal ? "Full Payment" : paidVal > 0 ? "Part Payment" : "No Payment";
}

export type CustomMenuItem = Required<MenuProps>["items"][number] & {
    permission: PermissionValue;
};

export const orderOptions: CustomMenuItem[] = [
    {
        label: (
            <span className="flex items-center py-1 font-semibold text-primary hover:text-blue-600" >
                Pay Order<FiSend className="ml-1" />
            </span>
        ),
        key: "pay",
        permission: permissions.payForOrder,
    },
    {
        label: (
            <span className="flex items-center py-1 text-slate-800 hover:text-blue-600" >
                Change Status < TfiExchangeVertical className="ml-1" />
            </span>
        ),
        key: "change-status",
        permission: permissions.updateOrder,
    },
    {
        label: (
            <span className="flex items-center py-1 text-slate-800 hover:text-blue-600" >
                Update Order < AiOutlineEdit className="ml-1" />
            </span>
        ),
        key: "update",
        permission: permissions.updateOrder,
    },

    {
        label: (
            <span className="flex items-center py-1 text-slate-800 hover:text-blue-600" >
                View Details
            </span>
        ),
        key: "view",
        permission: permissions.viewOrderDetails,
    },
    {
        label: (
            <span className="flex items-center py-1 text-slate-600 hover:text-blue-700 font-semibold" >
                View Parent Order
            </span>
        ),
        key: "view-parent",
        permission: permissions.viewOrderDetails,
    },
    {
        label: (
            <span className="flex items-center py-1 text-slate-800 hover:text-red-600" >
                Cancel Order Item < AiOutlineDelete className="ml-1" />
            </span>
        ),
        key: "cancel",
        permission: permissions.updateOrder,
    },
    {
        label: (
            <span className="flex items-center py-1 text-slate-800 hover:text-red-600" >
                Delete Order Item < AiOutlineDelete className="ml-1" />
            </span>
        ),
        key: "delete",
        permission: permissions.deleteOrder,
    },
];


interface PrintOrderButtonProps {
    onClick?: () => void;
    className?: string;
}

const PrintOrderButton: React.FC<PrintOrderButtonProps> = ({ onClick, className }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-white border border-blue-300 rounded-lg hover:bg-blue-50 hover:border-blue-400 active:scale-95 transition-all duration-200 shadow-sm ${className}`}
        >
            <Printer className="w-4 h-4" />
            Print Order
        </button>
    );
};

export default PrintOrderButton;
