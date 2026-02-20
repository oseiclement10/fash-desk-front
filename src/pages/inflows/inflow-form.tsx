import type { OverlayProps } from "@/@types/common";
import type { Transaction } from "@/@types/transactions";
import { FormHeader, FormFooter, FormConfig } from "@/components/crud/form-config";
import { Form, InputNumber, Input } from "antd";
import { useEffect, useState } from "react";
import { useDataMutationHook } from "@/hooks/use-form-submission";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { AiOutlineEdit } from "react-icons/ai";
import FormErrorAlert from "@/components/crud/form-error-alert";
import { parseApiError } from "@/utils/parse-api-errors";
import type { RequestError } from "@/@types/error";

const TransactionForm = ({
    closeModal,
    mode,
    data,
    api,
}: OverlayProps<Transaction>) => {
    const [form] = Form.useForm();
    const [showError, setShowError] = useState(false);
    const queryClient = useQueryClient();

    const onSuccess = () => {
        queryClient.refetchQueries({ queryKey: [queryKeys.transactions] });
        closeModal();
        form.resetFields();
    };

    const { saving, saveNew: saveTransaction, update: updateTransaction, error } =
        useDataMutationHook({
            title: "Transaction",
            onSuccessFn: onSuccess,
            onError: () => setShowError(true),
            api,
            extraPath: "inflows"
        });

    const onFinish = (values: any) => {
        const payload = {
            ...values,
            type: "inflow",
        };

        if (mode === "add") {
            saveTransaction(payload);
        } else {
            updateTransaction({ id: data?.id as number, data: payload, extraPath: `inflows/${data?.id}` });
        }
    };

    // Auto-generate description based on order_item_id
    const handleOrderItemChange = (value: number | null) => {
        if (!value) return;
        const currentDescription = form.getFieldValue("description");
        if (!currentDescription || currentDescription.startsWith("Payment for order item")) {
            form.setFieldsValue({
                description: `Payment for order item #${value}`,
            });
        }
    };

    useEffect(() => {
        if (mode === "edit" && data) {
            form.setFieldsValue({
                order_item_id: data.transaction?.order_item?.id,
                amount: data.amount,
                description: data.description,
            });
        } else {
            form.resetFields();
        }
    }, [mode, data]);

    return (
        <FormConfig>
            <FormHeader>
                {mode === "edit" ? "Edit Inflow Transaction" : "Add New Inflow Transaction"}
                {mode === "edit" ? <AiOutlineEdit className="ml-1" /> : null}
            </FormHeader>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                onValuesChange={() => setShowError(false)}
            >
                <Form.Item
                    name="order_item_id"
                    label="Order Item ID"
                    rules={[{ required: true, message: "Please enter order item ID" }]}
                >
                    <InputNumber
                        min={1}
                        size="large"
                        className="!w-full"
                        placeholder="Enter order item ID"
                        onChange={handleOrderItemChange}
                    />
                </Form.Item>

                <Form.Item
                    name="amount"
                    label="Amount (GH₵)"
                    rules={[
                        { required: true, message: "Please enter amount" },
                        { type: "number", min: 0, message: "Amount must be at least 0" },
                    ]}
                >
                    <InputNumber
                        min={0}
                        size="large"
                        className="!w-full"
                        placeholder="Enter amount"
                    />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ max: 500, message: "Max 500 characters" }]}
                >
                    <Input.TextArea
                        rows={3}
                        placeholder="Payment for order item #..."
                    />
                </Form.Item>

                {showError && error && (
                    <FormErrorAlert
                        className="md:col-span-2"
                        message={parseApiError(error as RequestError)}
                    />
                )}

                <div className="md:col-span-2">
                    <FormFooter
                        label={mode === "edit" ? "Update Inflow" : "Add Inflow"}
                        onClose={closeModal}
                        loading={saving}
                    />
                </div>
            </Form>
        </FormConfig>
    );
};

export default TransactionForm;
