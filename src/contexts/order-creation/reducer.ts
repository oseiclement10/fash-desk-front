import type { Order } from "@/@types/orders";
import type { OrderCreationAction, OrderCreationContextState, OrderInfo, OrderType } from "./types";

export const initialState: OrderCreationContextState = {
    type: null,
    single: null,
    mode: "initiate",
    results: null,
    info: null,
    multi: {
        step: 0,
        customer_id: null,
        order_items: [],
    },
    variable: {
        step: 0,
        order_items: [],
    },
};

const getOrderType = ({ measurement_mode, style_mode }: OrderInfo): OrderType => {
    if (measurement_mode === "multi") return "variable";
    return style_mode === "multi" ? "multiple" : "single";
};



export function orderReducer(state: OrderCreationContextState, action: OrderCreationAction): OrderCreationContextState {
    switch (action.type) {
        case "INITIATE":
            const orderType = getOrderType(action.payload);
            return { ...state, type: orderType, info: action.payload, mode: "order-creation" };
        case "UPDATE_ORDER_CUSTOMER":
            return { ...state, info: { ...state.info as OrderInfo, customer: action.payload } };
        case "SET_SINGLE":
            return { ...state, single: action.payload };

        case "ADD_MULTI_ITEM":
            const { step } = state.multi;
            const newOrderItems = [...state.multi.order_items];

            newOrderItems[step] = action.payload;
            return {
                ...state,
                multi: {
                    ...state.multi,
                    order_items: newOrderItems,
                }
            };
        case "SET_MULTI_STEP": {
            return {
                ...state,
                multi: {
                    ...state.multi,
                    step: action.payload,
                },
            };
        }

        case "ADD_VARIABLE_ITEM":
            const { step: variableStep } = state.variable;
            const newVariableOrderItems = [...state.variable.order_items];

            newVariableOrderItems[variableStep] = action.payload;
            return {
                ...state,
                variable: {
                    ...state.variable,
                    order_items: newVariableOrderItems,
                },
            };

        case "SET_VARIABLE_STEP":
            return { ...state, variable: { ...state.variable, step: action.payload } };

        case "SET_FORM_MODE":
            return {
                ...state, mode: action.payload.mode, results: action.payload.results as Order | null
            }

        case "RESET":
            return initialState;

        default:
            return state;
    }
}
