import React from "react";

export const StatCard: React.FC<{
    title: string;
    isAlt?: boolean;
    isLoading?: boolean;
    value: string | number;
    icon: React.ReactNode;
    trend?: string;
    isSmall?: boolean;
    extra?: React.ReactNode;
}> = ({ title, value, isAlt = false, isSmall = false, isLoading = false, icon, extra, trend }) => (
    <div
        className={`${isAlt ? "bg-primary border-primary" : "bg-white border-gray-100"
            } rounded-xl flex flex-col justify-between shadow-sm border p-6 hover:shadow-md transition-shadow`}
    >
        <div className="flex items-center justify-between ">
            <div>
                <p
                    className={`${isAlt ? "text-white" : "text-gray-600"
                        } text-sm font-medium`}
                >
                    {title}
                </p>

                {isLoading ? (
                    <div className="mt-2 w-24 h-7 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                ) : (
                    <p
                        className={` ${isSmall ? 'text-xl' : 'text-2xl'} font-bold ${isAlt ? "text-white" : "text-gray-900"
                            } mt-2`}
                    >
                        {value}
                    </p>
                )}

                {isLoading ? (
                    <div className="mt-2 w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                ) : (
                    trend && (
                        <p
                            className={`text-xs ${isAlt ? "text-slate-50" : "text-green-600"
                                } mt-1`}
                        >
                            {trend}
                        </p>
                    )
                )}
            </div>

            <div
                className={`p-3 rounded-lg ${isAlt ? "bg-primary-foreground/30" : "bg-primary/20"
                    } flex items-center justify-center`}
            >
                {isLoading ? (
                    <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                ) : (
                    icon
                )}
            </div>
        </div>

        {isLoading ? null : extra ? <div className="mt-2 " >{extra}</div> : null}
    </div>
);

 type StatCardProps = {
  label: string;
  value: string | number;
  bgColor: string;
  loading?: boolean;
  textColor: string;
  onClick?: () => void;
  extra?: React.ReactNode;
};


export const StatCardSmall = ({
    label,
    bgColor,
    textColor,
    value,
    extra,
}: StatCardProps) => {
    return (
        <div className={`px-6 ${bgColor} ${textColor} border-t border-gray-200 shadow-sm font-poppins rounded-lg py-5 space-x-4 flex items-center`}>
            <div className="w-10 h-10 flex items-center justify-center bg-white/90 shadow-sm rounded-md">
                {extra}
            </div>
            <div className="">
                <h4 className="text-sm">{label}</h4>
                <h2 className="font-semibold text-lg ">{value} </h2>
            </div>
        </div>
    )
}
