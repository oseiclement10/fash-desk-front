import { useModalProps } from "@/hooks/use-modal";
import { useApiQueryFilter } from "@/hooks/use-api-query-filter";
import useQueryFetch from "@/hooks/use-query-fetch";
import type { Outflow, Transaction } from "@/@types/transactions";
import type { ModalMode, AntColumnDef, PaginatedResponse } from "@/@types/common";
import type { RequestError } from "@/@types/error";
import { queryKeys } from "@/constants/query-keys";

import TableHeader from "@/components/crud/table-header";
import PrimaryButton from "@/components/buttons/primary";
import { LiaPlusCircleSolid } from "react-icons/lia";
import { HiArrowTrendingDown } from "react-icons/hi2";
import { Table, Modal } from "antd";
import { ManualPagination } from "@/components/crud/pagination";
import TableActions from "@/components/crud/table-actions";
import DeleteCrud from "@/components/crud/delete-item";
import OutflowForm from "./outflow-form";
import { formatMoney } from "@/utils/format-money";
import { Link } from "react-router-dom";
import { appRoutes } from "@/routes";
import { api } from "../transactions";
import TransactionViewModal from "../transactions/view";
import { hasPermission } from "@/utils/auth";
import { permissions } from "@/config/permissions";

const OutflowsMgmt = () => {
    const { search, currentPage, perPage, updateSearchParams } = useApiQueryFilter();

    const {
        data: transactions,
        isLoading,
    } = useQueryFetch<PaginatedResponse<Transaction>, RequestError>({
        queryFn: () =>
            api.getPaginatedData({
                search,
                page: currentPage,
                per_page: perPage,
                type: "outflow",
            }),
        title: "Outflows",
        queryKeys: [queryKeys.transactions, "outflows", search, currentPage, perPage?.toString()],
    });

    const { updateModal, modalOpen, closeModal } = useModalProps<Transaction>();
    const columns = getOutflowColumns(updateModal);

    return (
        <section>
            <div className="bg-white pb-8 border rounded-xl overflow-hidden">
                <TableHeader
                    onSearch={updateSearchParams}
                    searchDefaultValue={search}
                    searchPlaceholder="Search outflows..."
                    childrenStyle="w-30  md:w-auto"
                >
                    {hasPermission(permissions.createTransaction) && (
                        <PrimaryButton
                            label="Add Outflow"
                            labelSm="New"
                            onClick={() => updateModal(null, "add")}
                            className="!py-[6px]"
                            icon={<LiaPlusCircleSolid className="ml-1" />}
                        />
                    )}

                </TableHeader>

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

            <Modal footer={null} open={modalOpen.open} width={modalOpen.type == "view" ? 750 : 500} onCancel={closeModal}>
                {(modalOpen.type === "add" || modalOpen.type === "edit") && (
                    <OutflowForm
                        api={api}
                        closeModal={closeModal}
                        data={modalOpen.data as Transaction}
                        mode={modalOpen.type}
                    />
                )}

                {modalOpen.type === "view" && (
                    <TransactionViewModal
                        transaction={modalOpen?.data as Transaction}
                        onClose={closeModal}
                    />
                )}

                {modalOpen.type === "delete" && (
                    <DeleteCrud
                        key={modalOpen.data?.id}
                        queryKey={queryKeys.transactions}
                        closeModal={closeModal}
                        itemName={modalOpen.data?.description}
                        item={modalOpen.data}
                        title="Transaction"
                        mutateFn={(id: number) => api.deleteItem(id)}
                    />
                )}
            </Modal>
        </section>
    );
};

export const getOutflowColumns = (
    updateModal: (data: Transaction | null, type: ModalMode) => void
): AntColumnDef<Transaction> => [
        {
            title: "#",
            dataIndex: "id",
            key: "id",
            render(_, _2, index) {
                return <span>{index + 1}</span>;
            },
        },
        {
            title: (
                <span className="flex items-center">
                    <HiArrowTrendingDown className="mr-1 text-red-600" /> Description
                </span>
            ),
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render(amount: string) {
                return <span className="font-semibold ">{formatMoney(amount)}</span>;
            },
        },
        {
            title: "Expense Type",
            key: "expense_type",
            render(_, record) {
                if (record.type === "outflow") {
                    const outflow = record.transaction as Outflow;
                    return <span className="capitalize">{outflow.expense_type ?? "—"}</span>;
                }
                return <span>—</span>;
            },
        },
        {
            title: "Order Item",
            key: "order_item",
            render(_, record) {
                const orderItemId = (record.transaction as Outflow)?.order_item?.id;
                return orderItemId ? (
                    <Link
                        to={appRoutes.orderDetails?.path?.replace(":id", `${orderItemId}`)}
                        className="!underline"
                    >
                        #{orderItemId}
                    </Link>
                ) : (
                    <span>—</span>
                );
            },
        },
        {
            title: "Recorded By",
            key: "creator",
            render(_, record) {
                return <span>{record.creator?.name ?? "—"}</span>;
            },
        },
        {
            title: "Actions",
            dataIndex: "actions",
            render(_, record) {
                return (
                    <TableActions
                        onEdit={() => updateModal(record, "edit")}
                        onDelete={() => updateModal(record, "delete")}
                        allowEdit={hasPermission(permissions.updateTransaction)}
                        allowView={hasPermission(permissions.viewTransactionDetails)}
                        onView={() => updateModal(record, "view")}
                        allowDelete={hasPermission(permissions.deleteTransaction)}
                    />
                );
            },
        },
    ];

export default OutflowsMgmt;
