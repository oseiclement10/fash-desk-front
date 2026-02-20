import { Form, Button, InputNumber } from "antd";
import type { MeasurementFormProps } from "./measurement-form";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import { useEffect } from "react";
import { useCustomerCreation } from "@/contexts/customer-registration/customer-registration";
import { useDataMutationHook } from "@/hooks/use-form-submission";
import { api } from "..";
import FormErrorAlert from "@/components/crud/form-error-alert";
import { parseApiError } from "@/utils/parse-api-errors";
import type { RequestError } from "@/@types/error";
import { FormFooter } from "@/components/crud/form-config";


const MaleForm = ({
    measurementInfo,
    inEditMode,
    onBack,
    onSuccess,
    customerId
}: MeasurementFormProps) => {

    const {
        data
    } = useCustomerCreation();

    const [form] = Form.useForm();

    const editMode = false;

    const { saveNew, saving, update, error } = useDataMutationHook({
        api: api,
        title: "Customer",
        onSuccessFn: onSuccess,
        hasFile: !inEditMode,
        useAlerts: false,
        extraPath: inEditMode ? `${customerId}/measurement` : undefined
    });

    const handleSubmit = async (values: any) => {
        const payload = inEditMode ? values : {
            ...data?.customerInfo,
            ...values
        };

        if (inEditMode) {
            update({ id: customerId as number, data: payload, extraPath: `${customerId}/measurement` });
        } else {
            saveNew(payload);

        }


    }

    useEffect(() => {
        if (measurementInfo) {
            form.setFieldsValue(measurementInfo);
        }
    }, [measurementInfo]);

    return (
        <div className={`${editMode ? "md:m-2" : "md:ml-4 md:mt-4"}`}>
            {editMode && (
                <h2 className="mb-4 text-xl font-semibold text-center text-emerald-800">
                    Update Customer Measurement
                </h2>
            )}
            <Form
                layout="vertical"
                form={form}
                onFinish={handleSubmit}
                className="grid grid-cols-2 gap-3 md:gap-6"
            >



                <Form.Item
                    label="Neck"
                    name="neck"
                    rules={[{ required: true, message: 'Please enter neck measurement' }, { type: "number" }]}
                >
                    <InputNumber size="large" className="w-full!" placeholder="Enter neck measurement" />
                </Form.Item>

                <Form.Item
                    label="Chest"
                    name="chest"
                    rules={[{ required: true, message: 'Please enter chest measurement' }, { type: "number" }]}
                >
                    <InputNumber size="large" className="w-full!" placeholder="Enter chest measurement" />
                </Form.Item>

                <Form.Item
                    label="Waist"
                    name="waist"
                    rules={[{ required: true, message: 'Please enter waist measurement' }, { type: "number" }]}
                >
                    <InputNumber size="large" className="w-full!" placeholder="Enter waist measurement" />
                </Form.Item>

                <Form.Item
                    label="Hip"
                    name="hip"
                    rules={[{ required: true, message: 'Please enter hip measurement' }, { type: "number" }]}
                >
                    <InputNumber size="large" className="w-full!" placeholder="Enter hip measurement" />
                </Form.Item>

                <Form.Item
                    label="Thigh"
                    name="thigh"
                    rules={[{ required: true, message: 'Please enter thigh measurement' }, { type: "number" }]}
                >
                    <InputNumber size="large" className="w-full!" placeholder="Enter thigh measurement" />
                </Form.Item>

                <Form.Item
                    label="Knee"
                    name="knee"
                    rules={[{ required: true, message: 'Please enter knee measurement' }, { type: "number" }]}
                >
                    <InputNumber size="large" className="w-full!" placeholder="Enter knee measurement" />
                </Form.Item>

                <Form.Item
                    label="Ankle"
                    name="ankle"
                    rules={[{ required: true, message: 'Please enter ankle measurement' }, { type: "number" }]}
                >
                    <InputNumber size="large" className="w-full!" placeholder="Enter ankle measurement" />
                </Form.Item>

                <Form.Item
                    label="Waist To Knee"
                    name="waist_to_knee"
                    rules={[{ required: true, message: 'Please enter waist to knee measurement' }, { type: "number" }]}
                >
                    <InputNumber size="large" className="w-full!" placeholder="Enter waist to knee measurement" />
                </Form.Item>

                <Form.Item
                    label="Short Sleeve"
                    name="short_sleeve"
                    rules={[{ required: true, message: 'Please enter short sleeve measurement' }, { type: "number" }]}
                >
                    <InputNumber size="large" className="w-full!" placeholder="Enter short sleeve measurement" />
                </Form.Item>

                <Form.Item
                    label="Short"
                    name="short"
                    rules={[{ required: true, message: 'Please enter short measurement' }, { type: "number" }]}
                >
                    <InputNumber size="large" className="w-full!" placeholder="Enter short measurement" />
                </Form.Item>

                <Form.Item
                    label="Bicep"
                    name="bicep"
                    rules={[{ required: true, message: 'Please enter bicep measurement' }, { type: "number" }]}
                >
                    <InputNumber size="large" className="w-full!" placeholder="Enter bicep measurement" />
                </Form.Item>

                <Form.Item
                    label="Wrist"
                    name="wrist"
                    rules={[{ required: true, message: 'Please enter wrist measurement' }, { type: "number" }]}
                >
                    <InputNumber size="large" className="w-full!" placeholder="Enter wrist measurement" />
                </Form.Item>

                <Form.Item
                    label="Across Back"
                    name="across_back"
                    rules={[{ required: true, message: 'Please enter across back measurement' }, { type: "number" }]}
                >
                    <InputNumber size="large" className="w-full!" placeholder="Enter across back measurement" />
                </Form.Item>

                <Form.Item
                    label="Top Length"
                    name="top_length"
                    rules={[{ required: true, message: 'Please enter top length measurement' }, { type: "number" }]}
                >
                    <InputNumber size="large" className="w-full!" placeholder="Enter top length measurement" />
                </Form.Item>

                <Form.Item
                    label="Trouser Length"
                    name="trouser_length"
                    rules={[{ required: true, message: 'Please enter trouser length measurement' }, { type: "number" }]}
                >
                    <InputNumber size="large" className="w-full!" placeholder="Enter trouser length measurement" />
                </Form.Item>

                <Form.Item
                    label="Sleeve Length"
                    name="sleeve_length"
                    rules={[{ required: true, message: 'Please enter sleeve length measurement' }, { type: "number" }]}
                >
                    <InputNumber size="large" className="w-full!" placeholder="Enter sleeve length measurement" />
                </Form.Item>

                {error && <div className="md:col-span-2">
                    <FormErrorAlert message={parseApiError(error as RequestError)} />
                </div>}

                {inEditMode ?
                    <div className="md:col-span-2">
                        <FormFooter
                            label="Update Measurement Info"
                            onClose={onBack}
                            loading={saving}
                        />
                    </div> : (

                        <div className="md:col-span-2 border-t space-x-8 pt-5 mt-4 flex items-center justify-between">
                            <Button
                                type="default"
                                htmlType="button"
                                size="large"
                                icon={<IoMdArrowBack />}
                                className="w-2/6!"
                                onClick={onBack}
                                disabled={saving}
                                loading={false}
                            >
                                Back
                            </Button>

                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                icon={<IoMdArrowForward />}
                                loading={saving}
                                disabled={saving}
                                className="bg-primary/80! hover:bg-primay! lg:w-4/6! shadow-md hover:shadow-lg"
                            >
                                Create Customer
                            </Button>
                        </div>
                    )}
            </Form>

        </div>
    );
};

export default MaleForm;
