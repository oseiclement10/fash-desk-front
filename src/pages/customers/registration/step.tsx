type StepProps = {
    label: string;
    number: number;
    isActive: boolean;
    isCompleted?: boolean;
    inModalMode?: boolean;
};

function Step({ label, number, isActive, isCompleted = false, inModalMode = false }: StepProps) {
    return (
        <div
            className={`flex items-center ${inModalMode ? "space-x-2" : "space-x-4"} group cursor-pointer`}
        >
            {/* Step Number Indicator */}
            <div className="relative flex flex-col items-center">
                <div
                    className={`flex items-center justify-center rounded-full border-2 transition-all duration-300
                        ${inModalMode ? "w-6 h-6 text-xs" : "w-10 h-10"}
                        ${
                            isCompleted
                                ? "bg-primary border-primary text-white"
                                : isActive
                                ? "bg-primary text-white shadow-md"
                                : "border-primary bg-white text-primary"
                        }`}
                >
                    {isCompleted ? (
                        <svg
                            className={`${inModalMode ? "w-3 h-3" : "w-5 h-5"}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    ) : (
                        <span
                            className={`font-semibold ${
                                isActive ? "text-white" : "text-primary"
                            }`}
                        >
                            {number}
                        </span>
                    )}
                </div>

                {/* Connector line */}
                {number < 3 && (
                    <div
                        className={`absolute top-full left-1/2 w-0.5 ${
                            inModalMode ? "h-5" : "h-8"
                        } -translate-x-1/2 ${
                            isCompleted ? "bg-primary" : "bg-primary/70"
                        }`}
                    />
                )}
            </div>

            {/* Step Label (hidden in modal mode) */}
          
                <div className="flex-1">
                    <span
                        className={`transition-colors ${inModalMode ? "text-xs" : ""} duration-300 ${
                            isCompleted || isActive
                                ? "text-primary"
                                : "text-gray-600"
                        } ${isActive ? "font-medium" : ""}`}
                    >
                        {label}
                    </span>
                    {isActive && (
                        <div className="w-8 h-1 bg-primary rounded-full mt-1"></div>
                    )}
                </div>
            
        </div>
    );
}

export default Step;
