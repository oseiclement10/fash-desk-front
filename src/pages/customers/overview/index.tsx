import { useApiQueryFilter } from "@/hooks/use-api-query-filter";
import useQueryFetch from "@/hooks/use-query-fetch";
import type { AntColumnDef, PaginatedResponse } from "@/@types/common";
import type { RequestError } from "@/@types/error";
import { queryKeys } from "@/constants/query-keys";

import TableHeader from "@/components/crud/table-header";
import { Table, Tag, Image, Badge } from "antd";
import { ManualPagination } from "@/components/crud/pagination";

import { FaCrown, FaMedal, FaTrophy } from "react-icons/fa";
import { MdEmojiEvents } from "react-icons/md";
import { api } from "..";
import type { Customer } from "@/@types/customer";
import { formatDate } from "@/utils/date-helper";
import { Link } from "react-router-dom";
import { appRoutes } from "@/routes";
import dayjs from "dayjs";
import { hasPermission } from "@/utils/auth";
import { permissions } from "@/config/permissions";

export interface TopCustomer extends Customer {
    amount_spent: string | null;
    last_order_date: string | null;
    total_orders: number;
}



const TopCustomersPage = () => {
    const {
        search,
        currentPage,
        perPage,
        updateSearchParams,
    } = useApiQueryFilter();

    const {
        data: topCustomers,
        isLoading,
    } = useQueryFetch<PaginatedResponse<TopCustomer>, RequestError>({
        queryFn: () =>
            api.getRaw({
                search,
                page: currentPage,
                per_page: perPage,
            }, 'reports'),
        title: "Top Customers",
        queryKeys: [queryKeys.customerReport, search, currentPage, perPage?.toString()],
    });

    const columns = getTopCustomerColumns();

    console.log("Top Customers:", topCustomers);

    return (
        <section className="space-y-6">


            {/* Main Content */}
            <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                <TableHeader
                    onSearch={updateSearchParams}
                    searchDefaultValue={search}
                    searchPlaceholder="Search top customers..."
                >
                    <div className="md:flex items-center hidden  space-x-2">
                        <MdEmojiEvents className="text-amber-500 text-xl" />
                        <span className="text-lg font-semibold">Top  Customers</span>
                    </div>
                </TableHeader>

                <div className="flex items-center md:hidden px-3 mb-2  space-x-2">
                    <MdEmojiEvents className="text-amber-500 text-xl" />
                    <span className="text-lg font-semibold">Top  Customers</span>
                </div>

                <Table
                    columns={columns}
                    pagination={false}
                    dataSource={topCustomers?.data}
                    loading={isLoading}
                    rowKey={"id"}
                    bordered={false}
                    className="border-t border-gray-200/70 px-3 pt-3"
                    scroll={{ x: "max-content" }}
                    rowClassName="hover:bg-blue-50/50 transition-colors duration-200"
                />

                <ManualPagination total={topCustomers?.meta?.total || 0} />
            </div>
        </section>
    );
};

export const getTopCustomerColumns = (): AntColumnDef<TopCustomer> => [
    {
        title: "Rank",
        dataIndex: "rank",
        key: "rank",
        width: 80,
        render: (_, __, index) => {
            const rank = index + 1;
            let icon;
            let bgColor;

            if (rank === 1) {
                icon = <FaCrown className="text-amber-400" />;
                bgColor = "bg-gradient-to-r from-amber-500 to-yellow-500";
            } else if (rank === 2) {
                icon = <FaMedal className="text-gray-400" />;
                bgColor = "bg-gradient-to-r from-gray-400 to-gray-300";
            } else if (rank === 3) {
                icon = <FaMedal className="text-amber-600" />;
                bgColor = "bg-gradient-to-r from-amber-600 to-amber-700";
            } else {
                icon = <span className="text-sm font-bold">{rank}</span>;
                bgColor = "bg-gradient-to-r from-blue-500 to-cyan-500";
            }

            return (
                <div className="flex items-center">
                    {rank <= 3 ? (
                        <Badge count={rank}
                            size="small"
                            className="bg-linear-to-r mr-2 "
                            offset={[-7, 4]}
                        />
                    ) : null}
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-white ${bgColor} shadow-md`}>
                        {icon}
                    </div>

                </div>
            );
        },
    },
    {
        title: "Customer",
        key: "customer",
        render: (_, record) => {
            const c = record;
            return (
                <div className="flex items-center space-x-3">
                    <Image
                        src={record?.image as string}
                        alt={record?.firstname}
                        width={50}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{c?.full_name}</p>
                        <p className="text-gray-600 text-sm flex items-center gap-1">
                            🎂 {dayjs(c?.birthdate).format("MMM D")}
                        </p>

                    </div>
                </div>
            );
        },
    },
    {
        title: "Contact",
        key: "contact",
        render: (_, record) => (
            <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900">{record?.phone_full}</p>
                <Tag color="blue" className="text-xs">
                    {record?.gender?.toUpperCase()}
                </Tag>
            </div>
        ),
    },
    {
        title: (
            <span className="flex items-center">
                <FaTrophy className="mr-2 text-amber-500" />
                Performance
            </span>
        ),
        key: "performance",
        width: 250,
        render: (_, record) => (
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Amount Spent:</span>
                    <span className="font-bold text-green-600">
                        GHS {parseFloat(record.amount_spent || "0").toLocaleString()}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Orders:</span>
                    <Tag color="purple" className="font-semibold">
                        {record.total_orders}
                    </Tag>
                </div>
            </div>
        ),
    },
    {
        title: "Last Order",
        dataIndex: "last_order_date",
        key: "last_order_date",
        width: 150,
        render: (lastOrderDate: string) => (
            <div className="text-center">
                {lastOrderDate ? (
                    <Tag color="green" className="text-xs">
                        {formatDate(lastOrderDate, false)}
                    </Tag>
                ) : (
                    <Tag color="gray" className="text-xs">
                        No orders
                    </Tag>
                )}
            </div>
        ),
    },
    {
        title: "Location",
        dataIndex: "address",
        key: "address",
        width: 200,
        render: (_, record) => (
            <div className="text-sm text-gray-600">
                {record?.address || "Not specified"}
                {record?.occupation && (
                    <p className="text-xs text-gray-400 mt-1">
                        {record?.occupation}
                    </p>
                )}
            </div>
        ),
    },
    {
        title: "Status",
        key: "status",
        render: (_, record) => {
            const amount = parseFloat(record.amount_spent || "0");
            let status = "New";
            let color = "gray";

            if (amount > 2000) {
                status = "VIP";
                color = "gold";
            } else if (amount > 1000) {
                status = "Regular";
                color = "blue";
            } else if (amount > 0) {
                status = "Active";
                color = "green";
            }

            return (
                <Tag color={color} className="font-semibold capitalize">
                    {status}
                </Tag>
            );
        },
    },
    {
        title: "Actions",
        dataIndex: "actions",
        hidden: !hasPermission(permissions.viewCustomerDetails),
        render(_, record) {
            return (
                <Link className="text-sm! underline!" to={appRoutes?.customerDetails?.path?.replace(":id", record.id.toString())}>
                    View Profile
                </Link>
            );
        },
    }
];

export default TopCustomersPage;