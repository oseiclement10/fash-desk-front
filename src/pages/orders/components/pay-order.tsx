import { notification, Input, Form } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { OverlayProps } from "@/@types/common";
import type { OrderItem } from "@/@types/orders";
import { formatMoney } from "@/utils/format-money";
import { FormConfig, FormFooter, FormHeader } from "@/components/crud/form-config";
import { parseApiError } from "@/utils/parse-api-errors";
import { FiSend } from "react-icons/fi";
import { queryKeys } from "@/constants/query-keys";

const PayOrder = ({ closeModal, data: orderItem, api, cleanUp }: Omit<OverlayProps<OrderItem>, "mode"> & { cleanUp?: () => void }) => {

    const queryClient = useQueryClient();

    const [form] = Form.useForm();

    const { isPending, mutate } = useMutation({
        mutationFn: async (object: object) => api.addNewItem(object, `${orderItem?.id}/payment`),
        onSuccess: _ => {
            notification.success({
                message: `Payment for Order Item #${orderItem?.id} recorded successfully.`,
            });
            queryClient.refetchQueries({ queryKey: [queryKeys.orders, orderItem?.id] });
            queryClient.invalidateQueries({ queryKey: [queryKeys.orders] })
            cleanUp && cleanUp();
            form.resetFields();
            closeModal();
        },
        onError: (error: any) => {
            notification.error({
                message: parseApiError(error),
            });
        },
    });

    const handleSubmit = (values: { amount: number }) => {
        mutate(values);
    };

    const remaining =
        Number(orderItem?.sub_total) - Number(orderItem?.amount_paid);

    return (
        <FormConfig>
            <Form onFinish={handleSubmit} layout="vertical" className="py-1">
                <FormHeader>
                    Pay for Order <FiSend />
                </FormHeader>

                {
                    remaining <= 0 ? (
                        <div className="bg-rose-100 text-rose-700 p-4 rounded-md mb-4 text-center font-medium">
                            This order item has been fully paid.
                        </div>
                    ) : <div className="">
                        <div className="font-poppins text-sm sm:text-base mb-4 bg-white shadow-sm rounded-2xl p-4 border border-gray-100">
                            <div className="grid gap-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 font-medium">Item Total</span>
                                    <span className="font-semibold text-gray-800">
                                        {formatMoney(orderItem?.sub_total as string)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 font-medium">Paid</span>
                                    <span className="font-semibold text-emerald-600">
                                        {formatMoney(orderItem?.amount_paid as string)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between border-t pt-3">
                                    <span className="text-gray-500 font-medium">Remaining</span>
                                    <span
                                        className={`font-bold ${remaining > 0 ? "text-rose-600" : "text-emerald-600"
                                            }`}
                                    >
                                        {formatMoney(remaining)}
                                    </span>
                                </div>
                            </div>
                        </div>


                        <Form.Item label="Amount" rules={[{ required: true, max: remaining }]} name="amount">
                            <Input
                                name="amount"
                                type="number"
                                placeholder="Enter amount"
                                min={1}
                                size="large"
                                max={remaining}
                                required
                            />
                        </Form.Item>

                        <FormFooter
                            label="Pay for Order"
                            disabled={isPending}
                            loading={isPending}
                            onClose={() => closeModal()}
                            loadMsg="Paying..."
                        />

                    </div>
                }


            </Form>

        </FormConfig>

    );
};

export default PayOrder;
