import type { OrderStatus } from "@/@types/orders";

type OrderItemStatus = OrderStatus | "";

type FilterOrdersProps = {
    filter: (str: string) => void;
    active: string;
    counts: Record<OrderItemStatus, number>;
    total: number;
};

export const status: { key: OrderItemStatus; label: string }[] = [
    { key: "", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "cutting", label: "Cutting" },
    { key: "sewing", label: "Sewing" },
    { key: "fitting", label: "Fitting" },
    { key: "packaging", label: "Packaging" },
    { key: "delivering", label: "Delivering" },
    { key: "complete", label: "Complete" },
    { key: "cancelled", label: "Cancelled" },
];

const FilterOrders = ({ filter, active, counts, total }: FilterOrdersProps) => {
    const getCount = (key: OrderItemStatus) => {
        return key == "" ? total : counts ? counts[key] ?? 0 : 0;
    };

    return (
        <div className="flex mb-4 pl-3 pr-3 md:pr-0  md:pl-6 space-x-3 ">
            {status.map((elem) => (
                <button
                    key={elem.key}
                    onClick={() => filter(elem.key)}
                    className={`px-4 py-1 min-w-fit text-sm capitalize  rounded-md  ${active == elem.key
                        ? "bg-primary-foreground border-none text-white"
                        : "border-slate-300 border text-gray-900 hover:bg-slate-100"
                        } `}
                >
                    {elem.label}{" "}
                    <span
                        className={`text-xs  ${active !== elem.key && "text-gray-600"
                            } `}
                    >
                        ({getCount(elem.key)})
                    </span>
                </button>
            ))}
        </div>
    );
};

export default FilterOrders;
