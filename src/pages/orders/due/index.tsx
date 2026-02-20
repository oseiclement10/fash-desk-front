import type { AntColumnDef } from "@/@types/common";
import { queryKeys } from "@/constants/query-keys";
import { Modal, Tag, Dropdown, Button, Tabs } from "antd";
import type { OrderItem } from "@/@types/orders";
import { appRoutes } from "@/routes";
import { useNavigate } from "react-router-dom";
import { formatMoney } from "@/utils/format-money";
import { formatDate } from "@/utils/date-helper";
import { getOrderStatusStyling, type CustomMenuItem } from "../utils";
import { TfiMoreAlt } from "react-icons/tfi";
import UpdateStatus from "../components/update-status";
import PayOrder from "../components/pay-order";
import UpdateOrderItem from "../components/update-order-item";
import CancelOrder from "../components/cancel-order";
import { useModalProps } from "@/hooks/use-modal";
import { api } from "..";
import { useQueryClient } from "@tanstack/react-query";
import DueStatistics from "./due-statistics";
import DueOrdersTable from "./due-orders-table"
import DeleteCrud from "@/components/crud/delete-item";




const DueOrdersPage = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { updateModal, modalOpen, closeModal } = useModalProps<OrderItem>();

    const updateData = () => {
        queryClient.invalidateQueries({ queryKey: [queryKeys.ordersDue] });
    };

    const handleAction = (type: string, record: OrderItem) => {
        if (type == "pay") {
            updateModal(record, "pay");
        } else if (type == "change-status") {
            updateModal(record, "partial-edit");
        } else if (type == "update") {
            updateModal(record, "edit");
        } else if (type == "cancel") {
            updateModal(record, "cancel");
        } else if (type == "delete") {
            updateModal(record, "delete");
        } else if (type == "view-parent") {
            navigate(appRoutes.orderSummary.path?.replace(":id", record.order_id?.toString()));
        } else {
            navigate(appRoutes.orderDetails.path?.replace(":id", record.id?.toString()));
        }
    };

    return (
        <section className="space-y-6">
            <DueStatistics />

            <Tabs
                items={[

                    {
                        key: "due",
                        label: "Orders Due Soon",
                        children: (
                            <DueOrdersTable
                                title="Orders Due Soon"
                                path="due"
                                queryKey={queryKeys.ordersDue + "-due-soon"}
                                onAction={handleAction}
                            />
                        ),
                    },

                    {
                        key: "overdue",
                        label: "Overdue Orders",
                        children: (
                            <DueOrdersTable
                                title="Overdue Orders"
                                path="overdue"
                                queryKey={queryKeys.ordersDue + "-overdue"}
                                onAction={handleAction}
                            />
                        ),
                    }
                ]}
            />




            {/* Modals for order management */}
            <Modal open={modalOpen.open} onCancel={closeModal} footer={null}>
                {modalOpen.type === "delete" ? (
                    <DeleteCrud
                        key={modalOpen.data?.id}
                        queryKey={queryKeys.ordersDue}
                        closeModal={closeModal}
                        itemName={`Order #${modalOpen.data?.id}`}
                        item={modalOpen.data}
                        title="Order"
                        mutateFn={(id: number) => api.deleteItem(id)}
                    />
                ) : null}

                {modalOpen.type == "cancel" ? (
                    <CancelOrder
                        api={api}
                        closeModal={closeModal}
                        data={modalOpen?.data as OrderItem}
                        updateStatus={() => null}
                        cleanUp={updateData}
                    />
                ) : null}

                {modalOpen.type == "partial-edit" ? (
                    <UpdateStatus
                        api={api}
                        closeModal={closeModal}
                        data={modalOpen.data as OrderItem}
                        key={modalOpen.data?.status}
                        cleanUp={updateData}
                    />
                ) : null}

                {modalOpen.type == "edit" ? (
                    <UpdateOrderItem
                        api={api}
                        data={modalOpen.data as OrderItem}
                        closeModal={closeModal}
                        key={`${modalOpen.data?.style_img}${modalOpen.data?.sub_total}${modalOpen.data?.description}`}
                        cleanUp={updateData}
                    />
                ) : null}

                {modalOpen.type == "pay" ? (
                    <PayOrder
                        api={api}
                        closeModal={closeModal}
                        data={modalOpen.data as OrderItem}
                        key={modalOpen.data?.amount_paid}
                        cleanUp={updateData}
                    />
                ) : null}
            </Modal>
        </section>
    );
};

type DueOrderColumnsProps = {
    onClick?: (type: string, record: OrderItem) => void;
    useActions?: boolean;
    actions: CustomMenuItem[]
};

export const getDueOrderColumns = ({ onClick, useActions = true, actions }: DueOrderColumnsProps): AntColumnDef<OrderItem> => [
    {
        title: "Order ID",
        key: "item_order",
        width: 120,
        render: (_, record) => (
            <div className="flex flex-col leading-tight">
                <span className="font-medium text-gray-800">#{record.id}</span>
                <span className="text-xs text-gray-500">OD-{record.order?.id ?? "—"}</span>
            </div>
        ),
    },

    {
        title: "Urgency",
        key: "urgency",
        width: 120,
        render: (_, record) => <UrgencyTag dueDate={record.due_date} />,
    },

    {
        title: "Actions",
        dataIndex: "actions",
        width: 100,
        fixed: 'right' as const,
        hidden: !useActions,
        render(_, record) {
            const filteredOptions = actions?.filter((option) => {
                if (option.key === "cancel") {
                    return record.status !== "cancelled";
                }
                if (option.key === "delete") {
                    return record.status === "cancelled";
                }
                return true;
            });

            return (
                <Dropdown
                    menu={{
                        items: filteredOptions,
                        onClick: (item) => onClick && onClick(item.key, record),
                    }}
                    trigger={["click"]}
                    placement="bottomRight"
                >
                    <Button
                        type="primary"
                        ghost
                        size="small"
                        className="rounded-lg px-3 border-blue-200 hover:border-blue-300"
                    >
                        <TfiMoreAlt />
                    </Button>
                </Dropdown>
            );
        },
    },
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: 120,
        render: (status) => (
            <span className={`text-xs font-medium ${getOrderStatusStyling(status)}`}>
                {status}
            </span>
        ),
    },
    {
        title: "Due Date",
        dataIndex: "due_date",
        key: "due_date",
        width: 140,
        render: (dueDate) => {
            const date = new Date(dueDate);
            const now = new Date();
            const isOverdue = date < now;
            const isToday = date.toDateString() === now.toDateString();

            return (
                <div className={`text-sm font-medium ${isOverdue ? 'text-red-600' :
                    isToday ? 'text-amber-600' : 'text-blue-600'
                    }`}>
                    {formatDate(dueDate, false)}
                    {isToday && <div className="text-xs text-amber-500">TODAY!</div>}
                </div>
            );
        },
    },
    {
        title: "Customer",
        key: "customer",
        width: 200,
        render: (_, record) => {
            const customer = record.customer;
            return (
                <div className="flex items-center space-x-3">
                    <div>
                        <p className="font-medium text-slate-800">{customer?.full_name}</p>
                        <p className="text-sm text-slate-500">{customer?.phone_full}</p>
                    </div>
                </div>
            );
        },
    },
    {
        title: "Description",
        dataIndex: "description",
        key: "description",
        width: 180,
        render: (description) => (
            <p className="max-w-xs truncate" title={description}>
                {description}
            </p>
        ),
    },

    {
        title: "Amount Owed",
        key: "amount_owed",
        width: 130,
        render: (_, record) => {
            const amountOwed = Number(record.sub_total || 0) - Number(record.amount_paid || 0);
            const isOverdue = new Date(record.due_date) < new Date();

            return amountOwed <= 0 ? (
                <Tag color="green">Paid</Tag>
            ) : (
                <div className={`font-semibold ${isOverdue ? 'text-red-600' : 'text-amber-600'}`}>
                    {formatMoney(amountOwed)}
                </div>
            );
        },
    }

];

export default DueOrdersPage;



interface UrgencyTagProps {
    dueDate: string | Date;
}

export const UrgencyTag: React.FC<UrgencyTagProps> = ({ dueDate }) => {
    const due = new Date(dueDate);
    const now = new Date();
    const daysUntilDue = Math.ceil(
        (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    let label = "";
    let colorClass = "";

    if (daysUntilDue < 0) {
        label = "OVERDUE";
        colorClass = "bg-red-500";
    } else if (daysUntilDue <= 3) {
        label = "URGENT";
        colorClass = "bg-amber-500";
    } else {
        label = "DUE SOON";
        colorClass = "bg-blue-500";
    }

    return (
        <span
            className={`${colorClass} text-white text-xs font-semibold px-2 py-1 rounded-full`}
        >
            {label}
        </span>
    );
};


