import type { CustomerCreationStep } from "@/contexts/customer-registration/types";
import Step from "./step";
import { useCustomerCreation } from "@/contexts/customer-registration/customer-registration";
import { motion } from "framer-motion";
import { useRef, type ReactNode } from "react";
import BasicInfoForm from "./basic-info";
import MeasurementForm from "./measurement-form";
import { Button, Result } from "antd";
import { appRoutes } from "@/routes";
import { useNavigate } from "react-router-dom";
import { FormHeader } from "@/components/crud/form-config";
import { GoBackBtn } from "@/components/buttons/backbutton";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";

interface CustomerRegistrationProcessProps {
    inModalMode?: boolean;
    closeModal?: () => void;
}

const CustomerRegistrationProcess = ({ inModalMode = false, closeModal }: CustomerRegistrationProcessProps) => {
    const {
        step,
        stepIndex,
        data,
        clearData,
        reset,
        nextStep,
        prevStep,
        updateData,
        totalSteps
    } = useCustomerCreation();

    const lastStepIndex = useRef(stepIndex);
    const direction = stepIndex > lastStepIndex.current ? "forward" : "backward";
    lastStepIndex.current = stepIndex;

    const queryClient = useQueryClient();

    const handleCompletion = () => {
        clearData();
        nextStep();
        queryClient.invalidateQueries({ queryKey: [queryKeys.customers] });
    };

    const navigate = useNavigate();

    const sectionPadding = inModalMode ? "py-3 px-2" : "py-8 px-4";
    const sidePadding = inModalMode ? "p-3 lg:p-4" : "p-6 lg:p-8";

    return (
        <section className={`bg-white ${sectionPadding}`}>
            {!inModalMode && <GoBackBtn />}
            <div className={`${inModalMode ? "" : "container mx-auto"}`}>
                <title>Register Customer</title>

                {/* Header Section */}
                {inModalMode ? <FormHeader> Register Customer </FormHeader> : (
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-semibold text-primary">
                            Register New Customer
                        </h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Complete the following steps to register a new customer in our system
                        </p>
                    </div>
                )}

                {/* Main Content Card */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-4">
                        <div className={`${sidePadding}`}>
                            <Steps inModalMode={inModalMode} />

                            <div className="mt-8 pt-6 border-t border-primary">
                                <div className="flex justify-between text-sm text-slate-700 mb-2">
                                    <span>Progress</span>
                                    <span>{Math.round((stepIndex / (totalSteps - 1)) * 100)}%</span>
                                </div>
                                <div className="w-full bg-primary rounded-full h-2">
                                    <div
                                        className="bg-primary h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${(stepIndex / (totalSteps - 1)) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className={`lg:col-span-3 ${inModalMode ? "" : "lg:w-5/6"}  border-l border-gray-200 ${sidePadding}`}>
                            <div>


                                {step === "customer-info" && (
                                    <StepTransition direction={direction} key="customer-info">
                                        <BasicInfoForm
                                            onSuccess={(data) => {
                                                updateData("customerInfo", data);
                                                nextStep();
                                            }}
                                            mode="add"
                                            onBack={prevStep}
                                            customerInfo={data?.customerInfo}
                                        />
                                    </StepTransition>
                                )}

                                {step === "measurements" && (
                                    <StepTransition direction={direction} key="measurements">
                                        <MeasurementForm
                                            gender={data?.customerInfo?.gender as "male" | "female"}
                                            measurementInfo={data?.measurements}
                                            onSuccess={handleCompletion}
                                            onBack={prevStep}
                                        />
                                    </StepTransition>
                                )}

                                {step === "success" && (

                                    <StepTransition direction={direction} key="success">
                                        <Result
                                            title="Customer Registered Successfully"
                                            status="success"
                                            subTitle="Customer has been registered successfully"
                                            extra={
                                                <div className="flex flex-wrap items-center justify-center md:gap-4 gap-2">
                                                    <Button type="primary" onClick={reset}>
                                                        Add New Customer
                                                    </Button>
                                                    <Button
                                                        type={inModalMode ? "link" : "default"} 
                                                        onClick={() => navigate(appRoutes.customers.path)}
                                                    >
                                                        View Customers
                                                    </Button>
                                                    {inModalMode ? (
                                                        <Button
                                                            type="default"
                                                            onClick={() => closeModal && closeModal()}
                                                        >
                                                            Close
                                                        </Button>
                                                    ) : null}

                                                </div>
                                            }
                                        />
                                    </StepTransition>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

interface StepDefinition {
    id: CustomerCreationStep;
    label: string;
    number: number;
}

const Steps = ({ inModalMode = false }: { inModalMode?: boolean }) => {
    const { step } = useCustomerCreation();

    const steps: StepDefinition[] = [
        { label: "Basic Information", number: 1, id: "customer-info" },
        { label: "Measurement Details", number: 2, id: "measurements" },
        { label: "Success", number: 3, id: "success" }
    ];

    const activeStep = steps.find((s) => s.id === step)!.number;

    return (
        <div className="flex flex-col space-y-6">
            {steps.map(({ label, number }) => (
                <Step
                    key={number}
                    label={label}
                    inModalMode={inModalMode}
                    number={number}
                    isActive={activeStep === number}
                    isCompleted={activeStep > number}
                />
            ))}
        </div>
    );
};

interface StepTransitionProps {
    children: ReactNode;
    direction: "forward" | "backward";
}

const StepTransition = ({ children, direction }: StepTransitionProps) => {
    const xOffset = direction === "forward" ? 40 : -40;

    return (
        <motion.div
            key={Math.random()}
            initial={{ opacity: 0, x: xOffset }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -xOffset }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full"
        >
            {children}
        </motion.div>
    );
};

export default CustomerRegistrationProcess;
