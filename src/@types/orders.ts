import type { CommonModel } from "./common";
import type { Customer } from "./customer";
import type { Transaction } from "./transactions";

export type PaymentStatus = "Full Payment" | "Part Payment" | "No Payment";
export type OrderStatus = "pending" | "cutting" | "sewing" | "fitting" | "packaging" | "delivering" | "complete" | "cancelled";

type OrderType = "single" | "multi" | "variable";

export interface Order extends Omit<CommonModel, "status"> {
    id: number;
    status: string;
    order_items: OrderItem[];
    shipping_address: string;
    description: string;
    sub_total: string;
    type: OrderType;
    transactions: Transaction[];
    total: string;
    customer?: Customer;
    total_amount?: string;
    total_paid?: string;
    balance?: string;
    due_date?: string;
}

export interface OrderItem extends Omit<CommonModel, "status"> {
    id: number;
    order: Order;
    order_id: number;
    customer: Customer;
    measurement: string;
    transactions: any[];
    description: string;
    quantity: number;
    cost: string;
    price: string;
    status: OrderStatus;
    sub_total: string;
    amount_paid: string;
    style_img: string | null;
    fabric_img: string | null;
    due_date: string;
    fitting_date: string;
    completed_at: string | null;
}