import { useModalProps } from "@/hooks/use-modal";
import { useApiQueryFilter } from "@/hooks/use-api-query-filter";
import useQueryFetch from "@/hooks/use-query-fetch";
import type { AntColumnDef, PaginatedResponse } from "@/@types/common";
import type { RequestError } from "@/@types/error";
import { queryKeys } from "@/constants/query-keys";
import TableHeader from "@/components/crud/table-header";
import PrimaryButton from "@/components/buttons/primary";
import { LiaPlusCircleSolid } from "react-icons/lia";
import { Table, Modal, Tag, Badge, Dropdown, Button } from "antd";
import { ManualPagination } from "@/components/crud/pagination";
import DeleteCrud from "@/components/crud/delete-item";
import { FaUserTie } from "react-icons/fa6";
import { CrudService } from "@/services/CrudService";
import type { OrderItem, OrderStatus } from "@/@types/orders";
import { appRoutes } from "@/routes";
import { useNavigate } from "react-router-dom";
import { formatMoney } from "@/utils/format-money";
import { formatDate } from "@/utils/date-helper";
import { getOrderStatusStyling, getPaymentColor, getPaymentStatus, orderOptions, type CustomMenuItem } from "./utils";
import FilterOrders from "./components/filter-orders";
import { TfiMoreAlt } from "react-icons/tfi";
import { useMemo } from "react";
import UpdateStatus from "./components/update-status";
import PayOrder from "./components/pay-order";
import UpdateOrderItem from "./components/update-order-item";
import CancelOrder from "./components/cancel-order";
import { hasPermission } from "@/utils/auth";
import { permissions } from "@/config/permissions";
import { useQueryClient } from "@tanstack/react-query";


export const api = new CrudService<OrderItem>("orders");

type OrdersResponse = PaginatedResponse<OrderItem> & {
    statistics: {
        total: number;
        status_counts: Record<OrderStatus | "", number>
    }
}

const FashionOrderMgmt = () => {
    const {
        search,
        currentPage,
        perPage,
        status,
        updateStatus,
        updateSearchParams,
    } = useApiQueryFilter();

    const {
        data: orders,
        isLoading,
    } = useQueryFetch<OrdersResponse, RequestError>({
        queryFn: () =>
            api.getRaw({
                search,
                status,
                page: currentPage,
                per_page: perPage,
            }),
        title: "Orders",
        queryKeys: [queryKeys.orders, status, search, currentPage, perPage?.toString()],
    });


    const queryClient = useQueryClient();


    const navigate = useNavigate();

    const { updateModal, modalOpen, closeModal } = useModalProps<OrderItem>();

    const columns = useMemo(() => {
        return getOrderColumns({
            onClick(type, record) {
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
            },
            actions: orderOptions?.filter(elem => hasPermission(elem.permission))
        })
    }, []);


    return (
        <section>
            <div className="bg-white pb-8 border border-gray-200 rounded-xl overflow-hidden">
                <TableHeader
                    onSearch={updateSearchParams}
                    searchDefaultValue={search}
                    searchPlaceholder="Search orders by customer name, description..."
                    childrenStyle="w-26 md:w-auto"
                >
                    {hasPermission(permissions.createOrder) && (
                        <PrimaryButton
                            label="New Order"
                            onClick={() => null}
                            className="py-1.5!"
                            icon={<LiaPlusCircleSolid className="ml-1" />}
                            asLink={appRoutes.newOrder.path}
                            labelSm="New"
                        />
                    )}
                </TableHeader>

                <div className="max-w-full mb-3 overflow-x-scroll scrollbar-hide border-r-2 border-gray-200 lg:border-r-0">
                    <FilterOrders
                        active={status}
                        filter={(val) => updateStatus(val)}
                        counts={orders?.statistics?.status_counts as OrdersResponse["statistics"]["status_counts"]}
                        total={orders?.statistics?.total || 0}
                    />
                </div>

                <Table
                    columns={columns}
                    pagination={false}
                    dataSource={orders?.data}
                    loading={isLoading}
                    rowKey={"id"}
                    bordered={false}
                    className="border-t border-gray-200/70 px-3 pt-3"
                    scroll={{ x: "max-content" }}
                    rowClassName="text-slate-800 cursor-pointer"
                />

                <ManualPagination total={orders?.meta?.total || 0} />
            </div>

            <Modal open={modalOpen.open} onCancel={closeModal} footer={null}>

                {modalOpen.type === "delete" ? (
                    <DeleteCrud
                        key={modalOpen.data?.id}
                        queryKey={queryKeys.orders}
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
                        updateStatus={() => updateStatus("cancelled")}
                    />
                ) : null}

                {modalOpen.type == "partial-edit" ? (
                    <UpdateStatus
                        api={api}
                        closeModal={closeModal}
                        cleanUp={() => queryClient.invalidateQueries({ queryKey: [queryKeys.orders] })}
                        // updateStatus={(val) => updateStatus(val)}
                        data={modalOpen.data as OrderItem}
                        key={modalOpen.data?.status}
                    />
                ) : null}

                {modalOpen.type == "edit" ? (
                    <UpdateOrderItem
                        api={api}
                        data={modalOpen.data as OrderItem}
                        closeModal={closeModal}
                        key={`${modalOpen.data?.style_img}${modalOpen.data?.sub_total}${modalOpen.data?.description}`}
                    />
                ) : null}

                {modalOpen.type == "pay" ? (
                    <PayOrder
                        api={api}
                        closeModal={closeModal}
                        data={modalOpen.data as OrderItem}
                        key={modalOpen.data?.amount_paid}
                    />
                ) : null}
            </Modal>
        </section>
    );
};

type OrderColumnsProps = {
    viewOnly?: boolean;
    onClick: (type: string, record: OrderItem) => void;
    actions: CustomMenuItem[]
};

export const getOrderColumns = ({ viewOnly, onClick, actions }: OrderColumnsProps): AntColumnDef<OrderItem> => [
    {
        title: "Order ID",
        key: "item_order",
        render: (_, record) => (
            <div className="flex flex-col leading-tight">
                <span className="font-medium text-gray-800">#{record.id}</span>
                <span className="text-xs text-gray-500">OD- {record.order?.id ?? "—"}</span>
            </div>
        ),
    },
    {
        title: "Actions",
        dataIndex: "actions",
        render(_, record) {
            const menuItems = viewOnly
                ? actions?.filter((option) => option.key === "view")
                : actions?.filter((option) => {
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
                        items: menuItems,
                        onClick: (item) => onClick(item.key, record),
                    }}
                    trigger={["click"]}
                    placement="bottomRight"
                >
                    <Button
                        type="primary"
                        ghost
                        size="small"
                        className="rounded-lg  px-3"
                    >
                        <TfiMoreAlt />
                    </Button>
                </Dropdown>
            );
        },
    },
    {
        title: (
            <span className="flex items-center">
                <FaUserTie className="mr-1" /> Customer
            </span>
        ),
        key: "customer",
        render: (_, record) => {
            const customer = record.customer;
            return (
                <div className="flex items-center space-x-3!">
                    <div>
                        <p className="font-medium text-slate-800">{customer?.full_name}</p>
                        <p className="text-sm text-slate-500">{customer?.phone_full}</p>
                    </div>
                </div>
            );
        },
        hidden: viewOnly
    },
    {
        title: "Description",
        dataIndex: "description",
        key: "description",
        render: (description) => (
            <p className="max-w-xs truncate" title={description}>
                {description}
            </p>
        ),
    },

    {
        title: "Quantity",
        dataIndex: "quantity",
        key: "quantity",
        align: "center",
        render: (quantity) => (
            <Badge count={quantity} showZero color="blue" />
        ),
    },
    {
        title: "Order Status",
        dataIndex: "status",
        key: "status",
        render: (status) => {

            return (
                <span className={` ${getOrderStatusStyling(status)}`}>
                    {status}
                </span>
            );
        },
    },
    {
        title: "Due Date",
        dataIndex: "due_date",
        key: "due_date",
        render: (dueDate) => formatDate(dueDate, false),
    },

    {
        title: "Fitting Date",
        dataIndex: "fitting_date",
        key: "fitting_date",
        render: (date) => formatDate(date, false),
    },

    {
        title: "Price",
        dataIndex: "sub_total",
        key: "sub_total",
        render: (subTotal) => formatMoney(subTotal),
    },
    {
        title: "Amount Paid",
        dataIndex: "amount_paid",
        key: "amount_paid",
        render: (amountPaid) => (
            <Tag color={parseFloat(amountPaid) > 0 ? "green" : "red"}>
                {formatMoney(amountPaid)}
            </Tag>
        ),
    },
    {
        title: "Amount Owed",
        dataIndex: "amount_owed",
        key: "amount_owed",
        render: (_, record) => {
            const amountOwed =
                Number(record.sub_total || 0) - Number(record.amount_paid || 0);
            return amountOwed <= 0 ? <Tag color="green" > Paid </Tag> : <span className="text-red-600 font-semibold">
                {formatMoney(amountOwed || 0)}
            </span>
        },
    },
    {
        title: "Payment Status",
        dataIndex: "amount_paid",
        key: "paymentStatus",
        render(value, record) {
            const status = getPaymentStatus(parseFloat(record?.sub_total), value);
            return (
                <span
                    className={` text-xs    px-2 py-0.5 ${getPaymentColor(
                        status
                    )}`}
                >
                    {status}
                </span>
            );
        },
    },
    {
        title: "Order Date",
        dataIndex: "created_at",
        key: "created_at",
        render: (createdAt) => formatDate(createdAt),
    }

];

export default FashionOrderMgmt;