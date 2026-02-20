import type { Review } from "@/@types/entities";
import { FormConfig, FormHeader } from "@/components/crud/form-config";
import { Rate, Tag } from "antd";
import { Calendar, MessageSquare, Star, User, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { appRoutes } from "@/routes";
import dayjs from "dayjs";

interface ViewReviewDetailsProps {
    review: Review;
}

const ViewReviewDetails = ({ review }: ViewReviewDetailsProps) => {
    const statusColors = {
        pending: "orange",
        approved: "green",
        rejected: "red",
    };

    return (
        <FormConfig>
            <div className="py-1">
                <FormHeader>
                    Review Details <Star className="ml-2 w-5 h-5" />
                </FormHeader>

                <div className="space-y-6 mt-4">
                    {/* Order Information */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                            <Package className="w-4 h-4 text-gray-600" />
                            <h3 className="font-semibold text-gray-700">Order Information</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Order ID:</span>
                                {review.order_item_id ? (
                                    <Link
                                        to={appRoutes.orderDetails.path.replace(":id", review.order_item_id.toString())}
                                        className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                                    >
                                        #{review.order_item_id}
                                    </Link>
                                ) : (
                                    <span className="text-gray-400">—</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Customer Information */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                            <User className="w-4 h-4 text-gray-600" />
                            <h3 className="font-semibold text-gray-700">Customer Information</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Name:</span>
                                <span className="font-medium">
                                    {review.customer_name || review.order?.customer?.full_name || "—"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Rating & Review */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                            <Star className="w-4 h-4 text-gray-600" />
                            <h3 className="font-semibold text-gray-700">Rating & Review</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Rating:</span>
                                <Rate disabled defaultValue={review.rating} style={{ fontSize: 16 }} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <MessageSquare className="w-4 h-4 text-gray-600" />
                                    <span className="text-gray-600 font-medium">Comment:</span>
                                </div>
                                <div className="bg-white p-3 rounded border border-gray-200">
                                    <p className="text-gray-800 whitespace-pre-wrap">
                                        {review.comment || "No comment provided"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status & Timestamps */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                            <Calendar className="w-4 h-4 text-gray-600" />
                            <h3 className="font-semibold text-gray-700">Status & Timeline</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Status:</span>
                                <Tag color={statusColors[review.status]}>
                                    {review.status.toUpperCase()}
                                </Tag>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Submitted:</span>
                                <span className="font-medium">
                                    {review.created_at ? dayjs(review.created_at).format("MMM D, YYYY h:mm A") : "—"}
                                </span>
                            </div>
                            {review.updated_at && review.updated_at !== review.created_at && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Last Updated:</span>
                                    <span className="font-medium">
                                        {dayjs(review.updated_at).format("MMM D, YYYY h:mm A")}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </FormConfig>
    );
};

export default ViewReviewDetails;
