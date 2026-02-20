import { useEffect, useState } from "react";
import { Table, Modal, Tag } from "antd";
import { HiArrowTrendingDown, HiArrowTrendingUp } from "react-icons/hi2";
import dayjs, { Dayjs } from "dayjs";

import { queryKeys } from "@/constants/query-keys";
import { useModalProps } from "@/hooks/use-modal";
import { useApiQueryFilter } from "@/hooks/use-api-query-filter";
import useQueryFetch from "@/hooks/use-query-fetch";
import { CrudService } from "@/services/CrudService";
import type { Inflow, Outflow, Transaction } from "@/@types/transactions";
import type { RequestError } from "@/@types/error";
import type { ModalMode, AntColumnDef, PaginatedResponse } from "@/@types/common";

import TableHeader from "@/components/crud/table-header";
import TableActions from "@/components/crud/table-actions";
import { ManualPagination } from "@/components/crud/pagination";
import { formatMoney } from "@/utils/format-money";
import { Link } from "react-router-dom";
import { appRoutes } from "@/routes";
import TransactionStats, { type TransactionStatsProps } from "./stats";
import DateRangeFilter from "./date-range-filter";
import TransactionViewModal from "./view";
import { hasPermission } from "@/utils/auth";
import { permissions } from "@/config/permissions";

export const api = new CrudService<Transaction>("transactions");

export type OverviewResponse = PaginatedResponse<Transaction> & {
    date_range: {
        start: string;
        end: string;
    }
    statistics: {
        total_inflows: string | number;
        total_outflows: string | number;
        net_balance: string | number;
    }
}

const TransactionsPage = () => {
    const { search, currentPage, perPage, updateSearchParams } = useApiQueryFilter();
    const { updateModal, modalOpen, closeModal } = useModalProps<Transaction>();

    // State for date range filter
    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
    const [isDateFilterApplied, setIsDateFilterApplied] = useState(false);

    // Build query parameters including date range
    const buildQueryParams = () => {
        const params: any = {
            search,
            page: currentPage,
            per_page: perPage,
        };

        // Add date range to params if selected
        if (dateRange && dateRange[0] && dateRange[1]) {
            params.start_date_time = dateRange[0].format('YYYY-MM-DD HH:mm:ss');
            params.end_date_time = dateRange[1].format('YYYY-MM-DD HH:mm:ss');
        }


        return params;
    };

    const { data: transactions, isLoading } = useQueryFetch<OverviewResponse, RequestError>({
        queryFn: () =>
            api.getRaw<OverviewResponse>(buildQueryParams(), "overview"),
        title: "Transactions",
        queryKeys: [queryKeys.transactions, search, currentPage, perPage?.toString(), dateRange?.[0]?.toISOString() || "", dateRange?.[1]?.toISOString() || ""],
    });

    console.log("transactions", transactions);


    useEffect(() => {
        if (transactions?.date_range && !isDateFilterApplied) {
            const { start, end } = transactions.date_range;
            if (start && end) {
                setDateRange([dayjs(start), dayjs(end)]);
            }
        }
    }, [transactions?.date_range, isDateFilterApplied]);

    const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
        setDateRange(dates);
        setIsDateFilterApplied(!!dates && !!dates[0] && !!dates[1]);
    };

    const handleDateFilterClear = () => {
        setIsDateFilterApplied(false);
    };

    const columns = getTransactionColumns(updateModal);

    return (
        <section>
            <TransactionStats
                statistics={transactions?.statistics as TransactionStatsProps["statistics"]}
                isLoading={isLoading}
            />

            <div className="bg-white mt-6 border rounded-xl overflow-hidden">
                <div className="md:p-4 p-3 border-b border-gray-200">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between md:gap-4">
                        <div className="flex-1">
                            <TableHeader
                                onSearch={updateSearchParams}
                                searchDefaultValue={search}
                                searchPlaceholder={`Search Transactions ...`}
                            />
                        </div>

                        <DateRangeFilter
                            value={dateRange}
                            onChange={handleDateRangeChange}
                            onClear={handleDateFilterClear}
                            isFilterApplied={isDateFilterApplied}
                            recordCount={transactions?.data?.length}
                        />
                    </div>
                </div>

                {/* Table */}
                <Table
                    columns={columns}
                    pagination={false}
                    dataSource={transactions?.data}
                    loading={isLoading}
                    rowKey={"id"}
                    bordered={false}
                    className="border-t border-gray-200/70 px-3 pt-3"
                    scroll={{ x: "max-content" }}
                    rowClassName="text-slate-800"
                />

                <ManualPagination total={transactions?.meta?.total || 0} />
            </div>

            {/* Modals */}
            <Modal
                footer={null}
                open={modalOpen.open}
                width={750}
                onCancel={closeModal}
            >
                <TransactionViewModal
                    transaction={modalOpen?.data as Transaction}
                    onClose={closeModal}
                />
            </Modal>
        </section>
    );
};

export const getTransactionColumns = (
    updateModal: (data: Transaction | null, type: ModalMode) => void
): AntColumnDef<Transaction> => [
        {
            title: "#",
            dataIndex: "id",
            key: "id",
            width: 60,
            render(_, _2, index) {
                return <span className="text-gray-500">{index + 1}</span>;
            },
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            ellipsis: true,
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            width: 120,
            render(type: string) {
                return type === "inflow" ? (
                    <Tag color="green" className="flex! items-center! justify-center! gap-1">
                        <HiArrowTrendingUp className="text-sm" />
                        Inflow
                    </Tag>
                ) : (
                    <Tag color="red" className="flex! items-center! justify-center! gap-1">
                        <HiArrowTrendingDown className="text-sm" />
                        Outflow
                    </Tag>
                );
            }
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            width: 130,
            align: 'right' as const,
            render(amount: string, record) {
                const color = record.type === "inflow"
                    ? "text-green-700 font-semibold"
                    : "text-red-700 font-semibold";
                return (
                    <span className={`${color} font-mono`}>
                        {formatMoney(amount)}
                    </span>
                );
            },
        },
        {
            title: "Date",
            dataIndex: "created_at",
            key: "created_at",
            width: 150,
            render(date: string) {
                return date ? (
                    <span className="text-gray-600">
                        {dayjs(date).format('MMM DD, YYYY')}
                    </span>
                ) : (
                    <span>—</span>
                );
            },
        },
        {
            title: "Linked Order",
            key: "order_item",
            width: 120,
            render(_, record) {
                const orderItem = (record.transaction as Inflow | Outflow)?.order_item;
                return orderItem ? (
                    <Link
                        to={appRoutes.orderDetails.path.replace(":id", `${orderItem.id}`)}
                        className="underline text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        #{orderItem.id}
                    </Link>
                ) : (
                    <span className="text-gray-400">—</span>
                );
            },
        },
        {
            title: "Recorded By",
            key: "creator",
            width: 150,
            ellipsis: true,
            render(_, record) {
                return (
                    <span className="text-gray-700">
                        {record.creator?.name ?? "—"}
                    </span>
                );
            },
        },
        {
            title: "Actions",
            key: "actions",
            width: 100,
            fixed: 'right' as const,
            render(_, record) {
                return (
                    <TableActions
                        onView={() => updateModal(record, "view")}
                        allowView={hasPermission(permissions.viewTransactionDetails)}
                        onEdit={() => null}
                        onDelete={() => null}
                        allowEdit={false}
                        allowDelete={false}
                    />
                );
            },
        },
    ];

export default TransactionsPage;