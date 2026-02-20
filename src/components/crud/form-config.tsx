import { Button, ConfigProvider } from "antd";
import type { PropsWithChildren } from "react";
import PrimaryButton from "../buttons/primary";


export const FormHeader = ({ children }: PropsWithChildren) => {
    return (
        <div className="pb-4 mb-5 flex  items-center text-xl font-semibold  text-primary border-b border-slate-300">
            {children}
        </div>
    );
};





export const FormConfig = ({ children, className }: PropsWithChildren & { className?: string }) => {




    const tone = {
        colorBorder: "#CBD5E1",          // slate-300
        activeBorderColor: "#94A3B8",    // slate-400
        colorTextPlaceholder: "#64748B", // slate-500
    };





    return (
        <ConfigProvider
            theme={{
                token: {
                    fontFamily: "Poppins",
                },

                components: {
                    Form: {
                        labelFontSize: 15,
                        fontFamily: "DM Sans",
                    },

                    Input: {
                        colorBorder: tone.colorBorder,
                        colorTextPlaceholder: tone.colorTextPlaceholder,
                        paddingBlockLG: 10,
                        activeBorderColor: tone.activeBorderColor,
                        borderRadius: 10,
                        borderRadiusOuter: 10,
                        fontFamily: "DM Sans",
                    },

                    InputNumber: {
                        colorBorder: tone.colorBorder,
                        colorTextPlaceholder: tone.colorTextPlaceholder,
                        controlHeightLG: 45,
                        activeBorderColor: tone.activeBorderColor,
                        fontFamily: "DM Sans",
                    },

                    Select: {
                        colorBorder: tone.colorBorder,
                        colorTextPlaceholder: tone.colorTextPlaceholder,
                        controlHeightLG: 45,
                        activeBorderColor: tone.activeBorderColor,
                        fontFamily: "DM Sans",
                    },

                    Radio: {
                        colorPrimary: "#21037D",
                    },

                    DatePicker: {
                        colorBorder: tone.colorBorder,
                    },
                },
            }}
        >
            <section className={`px-2 ${className ?? ""}`}>{children}</section>
        </ConfigProvider>
    );
};


interface FormFooterProps {
    label: string;
    onClose: () => void;
    loading?: boolean;
    disabled?: boolean;
    loadMsg?: string;
    onSubmit?: () => void;
    className?: string;
    hideCancel?: boolean;
    dangerMode?: boolean;
    hideSubmit?: boolean;
    cancelLabel?: string;
    icon?: React.JSX.Element;
    children?: React.ReactNode,
    successMode?: boolean;
}

export const FormFooter = ({
    label,
    onClose,
    loading = false,
    onSubmit,
    className,
    loadMsg = "saving...",
    hideCancel = false,
    cancelLabel = "Cancel",
    successMode,
    dangerMode,
    hideSubmit = false,
    disabled = false,
    children,
    icon
}: FormFooterProps) => {
    return (
        <div className={`flex items-end justify-end pt-6 space-x-3 border-t ${className}`}>
            {children}
            {!hideCancel && (
                <Button
                    type="default"
                    onClick={onClose}
                    className="mr-2"
                    danger={!hideSubmit}
                >
                    {cancelLabel}
                </Button>
            )}
            {!hideSubmit && (
                <PrimaryButton
                    icon={icon}
                    loading={loading}
                    disabled={disabled || loading}
                    label={loading ? loadMsg : label}
                    htmlType={onSubmit ? "button" : "submit"}
                    onClick={() => onSubmit && onSubmit()}
                    className={` ${dangerMode
                        ? "bg-red-600 hover:bg-red-700" : successMode ? "bg-emerald-600 hover:bg-emerald-700"
                            : ""
                        }  py-1 `}
                />
            )}
        </div>
    );
};

