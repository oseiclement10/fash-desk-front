import type { Transaction } from "@/@types/transactions"
import TableHeader from "@/components/crud/table-header"
import { useModalProps } from "@/hooks/use-modal";
import { Modal, Table, Tag } from "antd";
import { useState } from "react";
import TransactionViewModal from "../../transactions/view";
import DeleteCrud from "@/components/crud/delete-item";
import { queryKeys } from "@/constants/query-keys";
import InflowForm from "../../inflows/inflow-form";
import { api as transactionApi } from "../../transactions";
import OutflowForm from "../../outflows/outflow-form";
import TableActions from "@/components/crud/table-actions";
import type { AntColumnDef, ModalMode } from "@/@types/common";
import { formatMoney } from "@/utils/format-money";
import dayjs from "dayjs";
import { HiArrowTrendingUp, HiArrowTrendingDown } from "react-icons/hi2";
import PayOrder from "../components/pay-order";
import type { OrderItem } from "@/@types/orders";
import { api as ordersApi } from "..";
import PrimaryButton from "@/components/buttons/primary";
import { IoMdArrowForward } from "react-icons/io";
import { hasPermission } from "@/utils/auth";
import { permissions } from "@/config/permissions";

type TransactionProps = {
    transactions: Transaction[];
    orderItem?: OrderItem;
}

const Transactions = ({ transactions, orderItem }: TransactionProps) => {

    const [searchVal, setSearchVal] = useState("");

    const {
        closeModal,
        modalOpen,
        updateModal
    } = useModalProps<Transaction>();

    const columns = getTransactionColumns(updateModal);

    const filteredTransactions = transactions.filter((transaction) =>
        transaction.description.toLowerCase().includes(searchVal.toLowerCase()) ||
        transaction.amount.toLowerCase().includes(searchVal.toLowerCase()) ||
        transaction.type.toLowerCase().includes(searchVal.toLowerCase())
    );

    return (
        <div>
            <div className="bg-white mt-6 border rounded-xl overflow-hidden">
                <div className="md:p-4  border-b border-gray-200">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1 ">
                            <TableHeader
                                onSearch={(val) => setSearchVal(val)}
                                searchDefaultValue={""}
                                searchPlaceholder={`Search Transactions ...`}
                            >
                                {hasPermission(permissions.payForOrder) && orderItem && parseFloat(orderItem?.amount_paid) < parseFloat(orderItem?.sub_total) ? (
                                    <PrimaryButton className="!py-[6px]" label="Pay Order" labelSm="Pay " icon={<IoMdArrowForward className="ml-1" />} onClick={() => updateModal(null, "pay")} />
                                ) : null}
                            </TableHeader>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <Table
                    columns={columns}
                    dataSource={filteredTransactions}
                    loading={false}
                    rowKey={"id"}
                    bordered={false}
                    className="border-t border-gray-200/70 px-3 pt-3"
                    scroll={{ x: "max-content" }}
                    rowClassName="text-slate-800"
                />

            </div>

            {/* Modals */}
            <Modal
                footer={null}
                open={modalOpen.open}
                width={modalOpen.type === "view" ? 750 : 500}
                onCancel={closeModal}
            >
                {(modalOpen.type === "pay" && orderItem) && (
                    <PayOrder
                        closeModal={closeModal}
                        api={ordersApi}
                        data={orderItem}
                        altQueryKey={`${queryKeys.orders}-${orderItem.id}`}
                    />
                )}

                {(modalOpen.type === "edit") && (
                    <InflowForm
                        api={transactionApi}
                        closeModal={closeModal}
                        data={modalOpen.data as Transaction}
                        mode={"edit"}
                    />
                )}

                {(modalOpen.type === "complete-action") && (
                    <OutflowForm
                        api={transactionApi}
                        closeModal={closeModal}
                        mode={"edit"}
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
                        mutateFn={(id: number) => transactionApi.deleteItem(id)}
                    />
                )}
                {modalOpen.type == "view" && (
                    <TransactionViewModal
                        transaction={modalOpen?.data as Transaction}
                        onClose={closeModal}
                    />

                )}
            </Modal>
        </div>
    )
}

const getTransactionColumns = (
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
                    <Tag color="green" className="!flex !items-center !justify-center gap-1">
                        <HiArrowTrendingUp className="text-sm" />
                        Inflow
                    </Tag>
                ) : (
                    <Tag color="red" className="!flex !items-center !justify-center gap-1">
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
            title: "Recorded By",
            key: "creator",
            width: 150,
            ellipsis: true,
            render(_, record) {
                return (
                    <span className="text-gray-700">
                        {record.creator?.central_user?.name ?? "—"}
                    </span>
                );
            },
        },
        {
            title: "Actions",
            key: "actions",
            width: 100,
            render(_, record) {
                return (
                    <TableActions
                        onView={() => updateModal(record, "view")}
                        allowView={hasPermission(permissions.viewOrderDetails)}
                        onEdit={() => record.type === "inflow" ? updateModal(record, "pay") : updateModal(record, "complete-action")}
                        onDelete={() => updateModal(record, "delete")}
                        allowEdit={hasPermission(permissions.updateTransaction)}
                        allowDelete={hasPermission(permissions.deleteTransaction)}
                    />
                );
            },
        },
    ];


export default Transactions