import { type ReactNode, useState, createContext, useContext, useMemo } from "react";
import type { CustomerCreationStep, CustomerCreationData } from "./types";

interface CustomerCreationContextType {
    step: CustomerCreationStep;
    stepIndex: number;
    totalSteps: number;
    data: CustomerCreationData;
    clearData: () => void;
    goToStep: (step: CustomerCreationStep) => void;
    nextStep: () => void;
    prevStep: () => void;
    updateData: (step: keyof CustomerCreationData, newData: any) => void;
    reset: () => void;
}

const CustomerCreationContext = createContext<CustomerCreationContextType | null>(null);

const stepOrder: CustomerCreationStep[] = [
    "customer-info",
    "measurements",
    "success",
];

export const CustomerCreationProvider = ({ children }: { children: ReactNode }) => {
    const [step, setStep] = useState<CustomerCreationStep>("customer-info");
    const [data, setData] = useState<CustomerCreationData>({});

    const stepIndex = useMemo(() => stepOrder.indexOf(step), [step]);
    const totalSteps = stepOrder.length;

    const goToStep = (newStep: CustomerCreationStep) => setStep(newStep);

    const nextStep = () => {
        if (stepIndex < stepOrder.length - 1) {
            setStep(stepOrder[stepIndex + 1]);
        }
    };

    const prevStep = () => {
        if (stepIndex > 0) {
            setStep(stepOrder[stepIndex - 1]);
        }
    };

    const updateData = (stepKey: keyof CustomerCreationData, newData: any) => {
        setData((prev) => ({
            ...prev,
            [stepKey]: { ...prev[stepKey], ...newData },
        }));
    };

    const clearData = () => {
        setData({});
    }

    const reset = () => {
        setStep("customer-info");
        clearData();
    };



    return (
        <CustomerCreationContext.Provider
            value={{
                step,
                stepIndex,
                totalSteps,
                data,
                clearData,
                goToStep,
                nextStep,
                prevStep,
                updateData,
                reset,
            }}
        >
            {children}
        </CustomerCreationContext.Provider>
    );
};

export const useCustomerCreation = () => {
    const context = useContext(CustomerCreationContext);
    if (!context) {
        throw new Error("useCustomerCreation must be used within CustomerCreationProvider");
    }
    return context;
};
