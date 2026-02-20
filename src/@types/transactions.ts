import type { Staff } from "./entities";
import type { CommonModel } from "./common";
import type { Customer } from "./customer";
import type { OrderItem } from "./orders";

type TransactionType = "inflow" | "outflow";

export interface Transaction extends CommonModel {
    type: TransactionType;
    description: string;
    amount: string;
    transaction: Inflow | Outflow;
    creator: Staff;
    updater: Staff;
}

export interface Inflow extends CommonModel {
    customer: Customer;
    order_item: OrderItem;

}
export interface Outflow extends CommonModel {
    expense_type: "order_item" | "general_purchase" | "other";
    order_item?: OrderItem;
}

