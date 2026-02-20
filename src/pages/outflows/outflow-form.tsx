import type { OverlayProps } from "@/@types/common";
import type { Outflow, Transaction } from "@/@types/transactions";
import { FormHeader, FormFooter, FormConfig } from "@/components/crud/form-config";
import { Form, Input, InputNumber, Select } from "antd";
import { useEffect, useState } from "react";
import { useDataMutationHook } from "@/hooks/use-form-submission";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { AiOutlineEdit } from "react-icons/ai";
import FormErrorAlert from "@/components/crud/form-error-alert";
import { parseApiError } from "@/utils/parse-api-errors";
import type { RequestError } from "@/@types/error";

const expenseOptions = [
    { label: "Order Item", value: "order_item" },
    { label: "General Purchase", value: "general_purchase" },
    { label: "Other", value: "others" },
];

const OutflowForm = ({
    closeModal,
    mode,
    data,
    api,
}: OverlayProps<Transaction>) => {
    const [form] = Form.useForm();
    const [showError, setShowError] = useState(false);
    const queryClient = useQueryClient();
    const [expenseType, setExpenseType] = useState<string>("general_purchase");

    const onSuccess = () => {
        queryClient.refetchQueries({ queryKey: [queryKeys.transactions, "outflows"] });
        closeModal();
        form.resetFields();
    };

    const { saving, saveNew, update, error } = useDataMutationHook({
        title: "Outflow",
        onSuccessFn: onSuccess,
        onError: () => setShowError(true),
        api,
        extraPath: "outflows"
    });

    const onFinish = (values: any) => {
        if (mode === "add") {
            saveNew(values);
        } else {
            update({ id: data?.id as number, data: values, extraPath: `outflows/${data?.id}` });
        }
    };

    // Handle dynamic description based on expense type and order item id
    const handleValueChange = (changedValues: any, allValues: any) => {
        setShowError(false);

        if (changedValues.expense_type) {
            setExpenseType(changedValues.expense_type);
        }

        if (
            (changedValues.expense_type && changedValues.expense_type === "order_item") ||
            changedValues.order_item_id
        ) {
            const orderId = allValues.order_item_id;
            form.setFieldsValue({
                description: orderId
                    ? `Cost incurred for order item #${orderId}`
                    : "Cost incurred for order item",
            });
        } else if (changedValues.expense_type && changedValues.expense_type !== "order_item") {
            form.setFieldsValue({
                description: `Outflow for ${changedValues.expense_type.replace("_", " ")}`,
            });
        }
    };

    useEffect(() => {
        if (mode === "edit" && data) {
            const outflow = data.transaction as Outflow;
            form.setFieldsValue({
                expense_type: outflow?.expense_type,
                order_item_id: outflow?.order_item?.id,
                amount: data.amount,
                description: data.description,
            });
            setExpenseType(outflow?.expense_type);
        } else {
            form.resetFields();
            setExpenseType("general_purchase");
        }
    }, [mode, data]);

    return (
        <FormConfig>
            <FormHeader>
                {mode === "edit" ? "Edit Outflow" : "Add New Outflow"}
                {mode === "edit" ? <AiOutlineEdit className="ml-1" /> : null}
            </FormHeader>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                onValuesChange={handleValueChange}
                initialValues={{
                    expense_type: "general_purchase",
                }}
            >
                <Form.Item
                    name="expense_type"
                    label="Expense Type"
                    rules={[{ required: true, message: "Please select expense type" }]}
                >
                    <Select
                        size="large"
                        placeholder="Select expense type"
                        options={expenseOptions}
                    />
                </Form.Item>

                {expenseType === "order_item" && (
                    <Form.Item
                        name="order_item_id"
                        label="Order Item ID"
                        rules={[{ required: true, message: "Please enter Order Item ID" }]}
                    >
                        <InputNumber
                            min={1}
                            size="large"
                            placeholder="Enter order item ID"
                            className="!w-full"
                        />
                    </Form.Item>
                )}

                <Form.Item
                    name="amount"
                    label="Amount"
                    rules={[
                        { required: true, message: "Please enter amount" },
                        { type: "number", min: 0, message: "Amount must be positive" },
                    ]}
                >
                    <InputNumber
                        size="large"
                        min={0}
                        className="!w-full"
                        placeholder="Enter amount"
                    />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ max: 255, message: "Max length 255 characters" }]}
                >
                    <Input.TextArea
                        rows={3}
                        placeholder="Enter description (auto-filled based on expense type)"
                        maxLength={255}
                        showCount
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
                        label={mode === "edit" ? "Update Outflow" : "Add Outflow"}
                        onClose={closeModal}
                        loading={saving}
                    />
                </div>
            </Form>
        </FormConfig>
    );
};

export default OutflowForm;
