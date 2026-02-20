import { notification } from "antd";
import { useMutation } from "@tanstack/react-query";
import type { OverlayProps, UpdateProps } from "@/@types/common";
import type { Review } from "@/@types/entities";
import { FormConfig, FormFooter, FormHeader } from "@/components/crud/form-config";
import { useState } from "react";
import { parseApiError } from "@/utils/parse-api-errors";
import { Star } from "lucide-react";
import RadioGroup from "@/components/crud/radio-group";

const UpdateReviewStatus = ({
    closeModal,
    data: review,
    cleanUp,
    api
}: Omit<OverlayProps<Review>, "mode"> & {
    cleanUp?: () => void;
}) => {
    const [selectedStatus, setSelectedStatus] = useState<Review["status"]>(review?.status as Review["status"]);

    const statusOptions = [
        { label: "Pending", value: "pending" },
        { label: "Approved", value: "approved" },
        { label: "Rejected", value: "rejected" },
    ];

    const { isPending, mutate } = useMutation({
        mutationFn: async (object: UpdateProps) => api?.updateItem(object),
        onSuccess: (data: Review) => {
            notification.success({
                message: `Review marked as ${data?.status}`,
            });
            cleanUp && cleanUp();
            closeModal();
        },
        onError: (error: any) => {
            notification.error({
                message: parseApiError(error),
            });
        },
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const record: UpdateProps = {
            id: review?.id as number,
            data: { status: selectedStatus },
            extraPath: `${review?.id}/status`
        };
        mutate(record);
    };

    return (
        <FormConfig>
            <form onSubmit={handleSubmit} className="py-1">
                <FormHeader>
                    Update Review Status <Star className="ml-2 w-5 h-5" />
                </FormHeader>

                <div className="grid grid-cols-1 gap-2 text-base mb-4">
                    <p><span className="font-semibold">Customer:</span> {review?.customer_name || review?.order?.customer?.full_name || "—"}</p>
                    <p><span className="font-semibold">Current Status:</span> <span className="capitalize">{review?.status}</span></p>
                </div>

                <div className="grid gap-8 my-4 ">
                    <RadioGroup
                        name="Change Status"
                        options={statusOptions}
                        onChange={(val) => setSelectedStatus(val as Review["status"])}
                        value={selectedStatus}
                    />
                </div>

                <FormFooter
                    label="Update Status"
                    disabled={isPending}
                    loading={isPending}
                    onClose={() => closeModal()}
                    loadMsg="Saving..."
                />
            </form>
        </FormConfig>
    );
};

export default UpdateReviewStatus;
