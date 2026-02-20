import { Link } from "react-router-dom";
import type { CommonButtonProps } from "@/@types/common";

export const OutlinedButton = ({ label, className, asLink, icon, ...props }: CommonButtonProps) => {
    const styling = ` flex items-center text-sm border w-fit text-blue-900 cursor-pointer transition-smooth border-blue-800 text-sm py-[4px] bg-white px-4 transition-smooth rounded-sm hover:text-blue-800 hover:bg-blue-50 hover:border-blue-800 active:opacity-10 ${className}`;
    return (
        <>
            {asLink ? (
                <Link to={asLink as string} className={styling}>
                    {" "}
                    {label}  {icon}
                </Link>
            ) : (
                <button className={styling} type="button" {...props}>
                    {label}   {icon}
                </button>
            )}
        </>
    );
};
