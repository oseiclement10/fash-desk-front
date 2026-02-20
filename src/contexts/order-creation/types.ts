import type { Customer } from "@/@types/customer";
import type { Order } from "@/@types/orders";

type OrderItemRecord = {
    quantity: number;
    cost: number;
    price: number;
    description: string;
    customer_id: number;
    customer: Customer;
    due_date: string;
    fitting_date: string;
    style_img: File | string | null;
    fabric_img: File | string | null;
    amount_paid: number;

};

export type OrderType = "single" | "multiple" | "variable";

type FormMode = "initiate" | "order-creation";


interface BaseOrderState {
    type: OrderType | null;
}

interface SingleOrderState extends BaseOrderState {
    type: "single";
    data: OrderItemRecord;
}

interface MultiOrderState extends BaseOrderState {
    type: "multiple";
    step: number;
    customer_id: number | null;
    order_items: (Omit<OrderItemRecord, "customer_id"> & { id: string })[];
}

interface VariableOrderState extends BaseOrderState {
    type: "variable";
    step: number;
    order_items: (OrderItemRecord & { id: string })[];
}

export type OrderCreationContext =
    | SingleOrderState
    | MultiOrderState
    | VariableOrderState
    | BaseOrderState;

export type OrderCreationAction =
    | { type: "INITIATE"; payload: OrderInfo }
    | { type: "UPDATE_ORDER_CUSTOMER"; payload: Customer }
    | { type: "SET_FORM_MODE"; payload: { mode: FormMode, results?: Order | null } }
    | { type: "SET_SINGLE"; payload: OrderItemRecord }
    | { type: "ADD_MULTI_ITEM"; payload: Omit<OrderItemRecord, "customer_id"> }
    | { type: "UPDATE_MULTI_CUSTOMER"; payload: number }
    | { type: "SET_MULTI_STEP"; payload: number }
    | { type: "ADD_VARIABLE_ITEM"; payload: OrderItemRecord }
    | { type: "SET_VARIABLE_STEP"; payload: number }
    | { type: "RESET" };


export type OrderInfo = {
    customer: Customer;
    quantity: number;
    style_mode?: "single" | "multi";
    measurement_mode?: "single" | "multi";
}

type MultiOrderItem = Omit<OrderItemRecord, "customer_id">;

export type OrderCreationContextState = {
    type: OrderType | null;
    mode: FormMode;
    info: OrderInfo | null;

    results: Order | null;
    single: OrderItemRecord | null;

    multi: {
        step: number;
        customer_id: number | null;
        order_items: MultiOrderItem[];
    };
    variable: {
        step: number;
        order_items: OrderItemRecord[];
    };
};