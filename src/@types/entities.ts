import type { Role, User } from "./users";
import type { CommonModel } from "./common";
import type { OrderItem } from "./orders";

export interface Staff extends User {
    roles: Role[];
}

export type DashboardResponse = {
    finance: {
        total_inflow: string;
        total_outflow: string;
        revenue: number;
        performance: {
            months: string[];
            inflows: number[];
            outflows: number[];
        },
    },
    orders: {
        due_this_week: number;
        due_next_week: number;
        orders_due: OrderItem[];
        placed_this_month: number;
    },

    customers: {
        total: number;
    }
}

export interface Review extends Omit<CommonModel, "status"> {
    order_item_id: number;
    order?: any;
    customer_name: string | null;
    rating: number;
    comment: string;
    status: "pending" | "approved" | "rejected";
}

export interface Appointment extends Omit<CommonModel, "status"> {
    name: string;
    phone_number: string;
    phone_code: string;
    preferred_date: string;
    status: "pending" | "confirmed" | "cancelled" | "completed";
    notes: string | null;
}