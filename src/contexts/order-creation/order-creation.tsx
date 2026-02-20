import { useReducer, createContext, useContext } from "react";
import { initialState, orderReducer } from "./reducer";
import type { OrderCreationAction, OrderCreationContextState } from "./types";

interface OrderCreationContextProps {
    state: OrderCreationContextState;
    dispatch: React.Dispatch<OrderCreationAction>;
}

const OrderCreationContext = createContext<OrderCreationContextProps>({
    state: initialState,
    dispatch: () => { },
});

export const OrderCreationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(orderReducer, initialState);
    return (
        <OrderCreationContext.Provider value={{ state, dispatch }}>
            {children}
        </OrderCreationContext.Provider>
    );
};

export const useOrderCreation = () => {
    const context = useContext(OrderCreationContext);

    if (!context) {
        throw new Error('useOrderCreation must be used within a OrderCreationProvider');
    }

    return context;
} 
