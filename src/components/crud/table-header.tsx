
import type { PropsWithChildren } from "react";
import { SearchInput } from "./search-input"

type TableHeaderProps = {
    searchPlaceholder?: string;
    onSearch: (input: string) => void;
    searchDefaultValue?: string;
    className?: string;
    childrenStyle?: string;
} & PropsWithChildren

const TableHeader = ({ onSearch, searchPlaceholder, searchDefaultValue, children, className, childrenStyle }: TableHeaderProps) => {
    return (
        <div className={`flex items-center justify-between md:px-6 px-3 py-5 ${className}`}>
            <SearchInput onSearch={onSearch} defaultValue={searchDefaultValue} placeholder={searchPlaceholder} />
            <div className={`overflow-x-hidden ${childrenStyle} `}>
                {children}
            </div>
        </div>
    )
}

export default TableHeader