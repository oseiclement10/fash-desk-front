import { useApiQueryFilter } from "@/hooks/use-api-query-filter";
import useQueryFetch from "@/hooks/use-query-fetch";
import type { PaginatedResponse } from "@/@types/common";
import type { RequestError } from "@/@types/error";
import TableHeader from "@/components/crud/table-header";
import { Table } from "antd";
import { ManualPagination } from "@/components/crud/pagination";
import { FaExclamationTriangle } from "react-icons/fa";
import type { OrderItem } from "@/@types/orders";
import { api } from "..";
import { useMemo } from "react";
import { getDueOrderColumns } from "./index";
import { orderOptions } from "../utils";
import { hasPermission } from "@/utils/auth";
import type { CustomMenuItem } from "../utils";

type OrdersResponse = PaginatedResponse<OrderItem>;

interface DueOrdersTableProps {
    title: string;
    path: string;
    queryKey: string;
    onAction: (type: string, record: OrderItem) => void;
}

const DueOrdersTable = ({ title, path, queryKey, onAction }: DueOrdersTableProps) => {
    const {
        search,
        currentPage,
        perPage,
        updateSearchParams,
    } = useApiQueryFilter();

    const {
        data: orders,
        isLoading,
    } = useQueryFetch<OrdersResponse, RequestError>({
        queryFn: () =>
            api.getRaw<OrdersResponse>({
                search,
                page: currentPage,
                per_page: perPage,
            }, path),
        title: title,
        queryKeys: [queryKey, search, currentPage, perPage?.toString()],
    });

    console.log("orders ", orders);

    const columns = useMemo(() => {
        return getDueOrderColumns({
            onClick: onAction,
            actions: orderOptions?.filter(elem => hasPermission(elem.permission)) as CustomMenuItem[]
        });
    }, [onAction]);

    return (
        <div className="bg-white pb-8 border border-red-100 rounded-xl overflow-hidden shadow-sm">
            <TableHeader
                onSearch={updateSearchParams}
                searchDefaultValue={search}
                searchPlaceholder={`Search ${title.toLowerCase()} by customer name...`}
            >
                <div className="hidden md:flex items-center space-x-2">
                    <FaExclamationTriangle className="text-red-500" />
                    <span className="font-semibold text-red-700">{title}</span>
                </div>
            </TableHeader>

            <div className="flex md:hidden mb-4 pl-4 items-center space-x-2">
                <FaExclamationTriangle className="text-red-500" />
                <span className="font-semibold text-red-700">{title}</span>
            </div>

            <Table
                columns={columns}
                pagination={false}
                dataSource={orders?.data}
                loading={isLoading}
                rowKey="id"
                bordered={false}
                className="border-t border-gray-200/70 px-3 pt-3"
                scroll={{ x: "max-content" }}
            />

            <ManualPagination total={orders?.meta?.total || 0} />
        </div>
    );
};

export default DueOrdersTable;
