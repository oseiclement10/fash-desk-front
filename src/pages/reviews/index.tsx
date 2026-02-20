import { useModalProps } from "@/hooks/use-modal";
import { useApiQueryFilter } from "@/hooks/use-api-query-filter";
import useQueryFetch from "@/hooks/use-query-fetch";
import type { AntColumnDef, PaginatedResponse } from "@/@types/common";
import type { RequestError } from "@/@types/error";
import { queryKeys } from "@/constants/query-keys";
import TableHeader from "@/components/crud/table-header";
import { Table, Modal, Tag, Rate, Tooltip } from "antd";
import { ManualPagination } from "@/components/crud/pagination";
import DeleteCrud from "@/components/crud/delete-item";
import type { Review } from "@/@types/entities";
import { CrudService } from "@/services/CrudService";
import Timestamps from "@/components/crud/timestamps";
import { hasPermission } from "@/utils/auth";
import { permissions } from "@/config/permissions";
import { useQueryClient } from "@tanstack/react-query";
import TableActions from "@/components/crud/table-actions";
import { MessageSquareQuote } from "lucide-react";
import UpdateReviewStatus from "./components/update-status";
import ViewReviewDetails from "./components/view-details";
import { Link } from "react-router-dom";
import { appRoutes } from "@/routes";

export const reviewApi = new CrudService<Review>("reviews");

export default function ReviewMgmt() {
    const { search, currentPage, perPage, status, updateStatus, updateSearchParams, queryParams, updateParam } = useApiQueryFilter();
    const rating = queryParams.get("rating") || "";
    const queryClient = useQueryClient();

    const {
        data: reviews,
        isLoading,
    } = useQueryFetch<PaginatedResponse<Review>, RequestError>({
        queryFn: () =>
            reviewApi.getPaginatedData({
                status,
                search,
                rating,
                page: currentPage,
                per_page: perPage,
            }),
        title: "Reviews",
        queryKeys: [queryKeys.reviews, search, currentPage, status, rating, perPage?.toString()],
    });



    const { updateModal, modalOpen, closeModal } = useModalProps<Review>();

    const handleCleanUp = () => {
        queryClient.invalidateQueries({ queryKey: [queryKeys.reviews] });
    };

    const columns: AntColumnDef<Review> = [
        {
            title: "Order",
            key: "order",
            render: (_, record) => (
                record.order_item_id ? (
                    <Link
                        to={appRoutes.orderDetails.path.replace(":id", record.order_item_id.toString())}
                        className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                    >
                        #{record.order_item_id}
                    </Link>
                ) : (
                    <span className="text-gray-400">—</span>
                )
            ),
        },
        {
            title: "Customer",
            key: "customer",
            render: (_, record) => (
                <span>{record.customer_name || record.order?.customer?.full_name || "—"}</span>
            ),
        },
        {
            title: "Rating",
            dataIndex: "rating",
            key: "rating",
            render: (rating) => <Rate disabled defaultValue={rating} style={{ fontSize: 14 }} />,
        },
        {
            title: "Comment",
            dataIndex: "comment",
            key: "comment",
            render: (comment) => (
                <Tooltip title={comment}>
                    <span className="truncate max-w-[200px] block">{comment}</span>
                </Tooltip>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: Review["status"]) => {
                const statusColors = {
                    pending: "orange",
                    approved: "green",
                    rejected: "red",
                };
                return (
                    <Tag color={statusColors[status]}>
                        {status.toUpperCase()}
                    </Tag>
                );
            },
        },
        {
            title: "Timestamps",
            dataIndex: "created_at",
            render: (_, record) => <Timestamps created_at={record?.created_at} updated_at={record?.updated_at} />,
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <TableActions
                    onView={() => updateModal(record, "view")}
                    onEdit={() => updateModal(record, "partial-edit")}
                    onDelete={() => updateModal(record, "delete")}
                    allowView={true}
                    allowEdit={hasPermission(permissions.updateReview)}
                    allowDelete={hasPermission(permissions.deleteReview)}
                />
            ),
        },
    ];

    return (
        <section>
            <div className="bg-white pb-8 border rounded-xl overflow-hidden">
                <TableHeader
                    onSearch={updateSearchParams}
                    searchDefaultValue={search}
                    searchPlaceholder="Search reviews..."
                    childrenStyle="w-30 md:w-auto"
                >
                    <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border">
                        <MessageSquareQuote size={18} />
                        <span className="font-medium">Customer Reviews</span>
                    </div>
                </TableHeader>

                <div className="flex gap-3 px-4 mb-4 overflow-x-auto scrollbar-hide items-center">
                    <div className="flex gap-2">
                        {[
                            { label: "All", key: "" },
                            { label: "Pending", key: "pending" },
                            { label: "Approved", key: "approved" },
                            { label: "Rejected", key: "rejected" },
                        ].map((item) => (
                            <button
                                key={item.key}
                                onClick={() => updateStatus(item.key)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${(status || "") === item.key
                                    ? "bg-primary text-white shadow-md shadow-primary/20"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 ml-auto">
                        <label className="text-sm font-medium text-gray-600 whitespace-nowrap">Filter by Rating:</label>
                        <select
                            value={rating}
                            onChange={(e) => updateParam("rating", e.target.value)}
                            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                        >
                            <option value="">All Ratings</option>
                            <option value="5">5 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="2">2 Stars</option>
                            <option value="1">1 Star</option>
                        </select>
                    </div>
                </div>

                <Table
                    columns={columns}
                    pagination={false}
                    dataSource={reviews?.data}
                    loading={isLoading}
                    rowKey={"id"}
                    bordered={false}
                    className="border-t border-gray-200/70 px-3 pt-3"
                    scroll={{ x: "max-content" }}
                    rowClassName="text-slate-800"
                />

                <ManualPagination total={reviews?.meta?.total || 0} />
            </div>

            <Modal footer={null} open={modalOpen.open} width={modalOpen.type === "view" ? 600 : 500} onCancel={closeModal}>
                {modalOpen.type === "view" && (
                    <ViewReviewDetails review={modalOpen.data as Review} />
                )}

                {modalOpen.type === "delete" && (
                    <DeleteCrud
                        key={modalOpen.data?.id}
                        queryKey={queryKeys.reviews}
                        closeModal={closeModal}
                        itemName={`Review for Order #${modalOpen.data?.order_item_id}`}
                        item={modalOpen.data}
                        title="Review"
                        mutateFn={(id: number) => reviewApi.deleteItem(id)}
                    />
                )}

                {modalOpen.type === "partial-edit" && (
                    <UpdateReviewStatus
                        api={reviewApi}
                        closeModal={closeModal}
                        data={modalOpen.data as Review}
                        cleanUp={handleCleanUp}
                    />
                )}
            </Modal>
        </section>
    );
}
