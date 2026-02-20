import React, {
    useState,
    useRef,
    forwardRef,
    useCallback,
    useEffect,
} from "react";
import { Input, Popover, Spin } from "antd";
import { FaTimesCircle } from "react-icons/fa";
import { TbCaretDown, TbCaretUp } from "react-icons/tb";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { debounce } from "lodash";
import useCloseDialogs from "@/hooks/useCloseDialogs";
import type { PaginatedResponse } from "@/@types/common";
import type { Customer } from "@/@types/customer";

interface CustomerSearchSelectProps {
    placeholder: string;
    queryKey: string;
    fetchFn: (search?: string) => Promise<PaginatedResponse<Customer>>;
    value?: Customer | null;
    onChange?: (value?: Customer | null) => void;
    withCaret?: boolean;
    debounceMs?: number;
    contentClassName?: string;
}

const CustomerSearchSelect: React.FC<CustomerSearchSelectProps> = ({
    placeholder,
    queryKey,
    fetchFn,
    value,
    onChange,
    withCaret = true,
    debounceMs = 500,
    contentClassName,
}) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const ref = useRef(null);

    const { data, isLoading, isFetching } = useQuery<PaginatedResponse<Customer>>({
        queryKey: [queryKey, search],
        queryFn: () => fetchFn(search),
        placeholderData: keepPreviousData,
    });

    const customers = data?.data ?? [];

    // Debounced search handler
    const debouncedSearch = useCallback(
        debounce((val: string) => {
            setSearch(val);
        }, debounceMs),
        [debounceMs]
    );

    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    const handleSelected = (customer: Customer) => {
        setOpen(false);
        onChange?.(customer);
    };

    const handleClear = () => {
        onChange?.(null);
        setOpen(false);
    };

    const content = (
        <SelectOptions
            ref={ref}
            customers={customers}
            selected={value}
            onSelected={handleSelected}
            onClear={handleClear}
            placeholder={placeholder}
            onSearch={debouncedSearch}
            isLoading={isLoading}
            isFetching={isFetching}
            contentClassName={contentClassName}
        />
    );

    useCloseDialogs(ref as any, setOpen);

    return (
        <Popover
            open={open}
            content={content}
            placement="bottom"
            className="shadow-xs hover:shadow-md  mt-[2px] active:bg-slate-200  transition-smooth w-full!"
        >
            <button
                type="button"
                onClick={() => setOpen((old) => !old)}
                className="flex items-center text-sm w-full border py-2!  md:py-3! px-3 cursor-pointer !text-left border-slate-400/90 rounded-md text-slate-800 active:opacity-10"
            >
                <span className="flex flex-1">
                    {value ? (
                        `${value.full_name} - ${value.address ?? ""}`
                    ) : (
                        <span className="text-slate-500 text-sm">{placeholder}</span>
                    )}
                </span>

                {withCaret && (
                    <span>
                        {open ? (
                            <TbCaretUp className="mr-1 text-lg text-primary" />
                        ) : (
                            <TbCaretDown className="mr-1 text-lg text-primary" />
                        )}
                    </span>
                )}
            </button>
        </Popover>
    );
};

interface CustomerSearchSelectOptionsProps {
    customers: Customer[];
    selected?: Customer | null;
    onSelected: (customer: Customer) => void;
    onClear: () => void;
    placeholder?: string;
    onSearch: (val: string) => void;
    isLoading: boolean;
    isFetching: boolean;
    contentClassName?: string;
}

const { Search } = Input;

const SelectOptions = forwardRef<HTMLDivElement, CustomerSearchSelectOptionsProps>(
    (
        {
            customers,
            selected,
            onSelected,
            onClear,
            onSearch,
            isLoading,
            isFetching,
            contentClassName,
        },
        ref
    ) => (
        <div
            className={`bg-white flex flex-col px-1 overflow-y-auto ${contentClassName ?? ""}`}
            ref={ref}
        >
            {selected && (
                <button
                    onClick={onClear}
                    type="button"
                    className="mb-2 ml-auto transition-smooth cursor-pointer flex items-center hover:text-blue-700 active:scale-80 text-primary"
                >
                    clear <FaTimesCircle className="ml-1" />
                </button>
            )}

            <div>
                <Search
                    placeholder="enter name or phone number"
                    allowClear
                    size="large"
                    onChange={(e) => onSearch(e.target.value)}
                />
            </div>

            <div className="flex-grow max-h-[200px] overflow-y-auto mt-2 text-sm">
                {isLoading && (
                    <div className="flex justify-center items-center py-4">
                        <Spin size="small" /> <span className="ml-2">Loading...</span>
                    </div>
                )}

                {!isLoading && isFetching && (
                    <p className="flex justify-center items-center py-2 text-xs text-slate-600">
                        Searching...
                    </p>
                )}

                {!isLoading &&
                    customers.map((customer) => (
                        <button
                            key={customer.id}
                            type="button"
                            onClick={() => onSelected(customer)}
                            className={`flex w-full px-2 py-2 my-1 text-[13px] text-left cursor-pointer font-poppins hover:text-primary hover:bg-blue-50 ${selected?.id === customer.id ? "bg-blue-100/80" : ""
                                }`}
                        >
                            {customer.full_name} - {customer.address ?? ""}
                        </button>
                    ))}

                {!isLoading && customers.length === 0 && (
                    <p className="flex justify-center items-center py-2 text-xs text-slate-600">
                        No results found
                    </p>
                )}
            </div>
        </div>
    )
);

export default CustomerSearchSelect;
