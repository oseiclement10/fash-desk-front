import { Alert, notification } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { OverlayProps, UpdateProps } from "@/@types/common";
import type { OrderItem } from "@/@types/orders";
import { TriangleAlert } from "lucide-react";
import { FormFooter } from "@/components/crud/form-config";
import { api } from "..";
import { parseApiError } from "@/utils/parse-api-errors";
import { queryKeys } from "@/constants/query-keys";

const CancelOrder = ({
    closeModal,
    data: orderItem,
    updateStatus,
    cleanUp
}: Omit<OverlayProps<OrderItem>, "mode"> & { updateStatus: () => void, cleanUp?: () => void }) => {

    const queryClient = useQueryClient();

    const { isPending, mutate } = useMutation({
        mutationFn: async (object: UpdateProps) => api.updateItem(object),
        onSuccess: _ => {
            notification.success({
                message: `Order #${orderItem?.id} has been cancelled`,
                description: `All related transactions have been reverted.`,
            });
            queryClient.invalidateQueries({ queryKey: [queryKeys.orders] })
            closeModal();
            updateStatus();
            cleanUp && cleanUp();
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
            id: orderItem?.id as number,
            data: { status: "cancelled" },
            extraPath: `${orderItem?.id}/status`
        };
        mutate(record);
    };

    return (
        <form onSubmit={handleSubmit} className="py-2">
            <div className="text-center mb-6">
                <TriangleAlert className="mx-auto text-red-500 w-12 h-12 mb-2" />
                <h3 className="text-2xl font-semibold text-red-600">
                    Cancel Order
                </h3>
                <p className="text-gray-600 mt-1">
                    You are about to cancel <strong>Order #{orderItem?.id}</strong>
                </p>
            </div>

            <Alert
                type="error"
                showIcon
                message="Cancelling this order will revert all associated transactions."
                description={
                    <>
                        <ul className="list-disc ml-5 text-sm mt-2 text-gray-700">
                            <li>All inflows (payments received) will be reversed.</li>
                            <li>All outflows (expenses or payouts) will be rolled back.</li>
                            <li>The order will be marked as <strong>cancelled</strong>.</li>
                        </ul>
                    </>
                }
            />

            <div className="bg-gray-50 p-4 rounded-xl mt-5 border border-red-100">
                <h4 className="text-base font-semibold text-gray-800 mb-2">Order Summary</h4>
                <div className="grid grid-cols-2 gap-y-1 text-sm">
                    <p>Item Total:</p>
                    <p className="text-right font-medium">₵ {orderItem?.sub_total}</p>
                    <p>Paid:</p>
                    <p className="text-right font-medium">₵ {orderItem?.amount_paid}</p>
                    <p>Status:</p>
                    <p className="text-right font-semibold capitalize">{orderItem?.status}</p>
                </div>
            </div>

            <div className="mt-8">
                <FormFooter
                    label="Cancel Order"
                    disabled={isPending}
                    loading={isPending}
                    onClose={() => closeModal()}
                    loadMsg="Cancelling..."

                />
            </div>
        </form>
    );
};

export default CancelOrder;
