import { Form, Button, InputNumber } from "antd";
import type { MeasurementFormProps } from "./measurement-form";
import { useEffect } from "react";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import { useDataMutationHook } from "@/hooks/use-form-submission";
import { api } from "..";
import { useCustomerCreation } from "@/contexts/customer-registration/customer-registration";
import FormErrorAlert from "@/components/crud/form-error-alert";
import { parseApiError } from "@/utils/parse-api-errors";
import type { RequestError } from "@/@types/error";
import { FormFooter } from "@/components/crud/form-config";

const FemaleForm = ({ onSuccess, onBack, inEditMode, customerId, measurementInfo }: MeasurementFormProps) => {

    const [form] = Form.useForm();
    const editMode = false;
    const {
        data
    } = useCustomerCreation();

    const { saveNew, saving, update, error } = useDataMutationHook({
        api: api,
        title: "Customer",
        onSuccessFn: onSuccess,
        useAlerts: false,
        hasFile: !inEditMode,
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
                    label="Bust"
                    name="bust"
                    rules={[{ required: true }]}
                >
                    <InputNumber size="large" className="w-full!" placeholder="Enter bust measurement" />
                </Form.Item>

                <Form.Item
                    label="Waist"
                    name="waist"
                    rules={[{ required: true }]}
                >
                    <InputNumber size="large" className="w-full!" placeholder="Enter waist measurement" />
                </Form.Item>

                <Form.Item
                    label="Hip"
                    name="hip"
                    rules={[{ required: true }]}
                >
                    <InputNumber size="large" className="w-full!" placeholder="Enter hip measurement" />
                </Form.Item>

                <Form.Item
                    label="Thighs"
                    name="thighs"
                >
                    <InputNumber size="large" className="w-full!" placeholder="Enter thighs measurement" />
                </Form.Item>

                <Form.Item
                    label="Knee"
                    name="knee"
                >
                    <InputNumber size="large" className="w-full!" placeholder="Enter knee measurement" />
                </Form.Item>

                <Form.Item
                    label="Bass"
                    name="bass"
                >
                    <InputNumber size="large" className="w-full!" placeholder="Enter bass measurement" />
                </Form.Item>

                <Form.Item
                    label="Accross Back"
                    name="accross_back"
                    rules={[{ required: true }]}
                >
                    <InputNumber size="large" className="w-full!" placeholder="Enter across back measurement" />
                </Form.Item>

                <Form.Item
                    label="Bicep Up"
                    name="bicep_up"
                    rules={[{ required: true }]}
                >
                    <InputNumber size="large" className="w-full!" placeholder="Enter bicep up measurement" />
                </Form.Item>

                <Form.Item
                    label="Bicep Down"
                    name="bicep_down"
                >
                    <InputNumber size="large" className="w-full!" placeholder="Enter bicep down measurement" />
                </Form.Item>

                <Form.Item
                    label="ArmSyce"
                    name="armsyce"
                >
                    <InputNumber size="large" className="w-full!" placeholder="Enter armsyce measurement" />
                </Form.Item>

                <Form.Item
                    label="Cuff"
                    name="cuff"
                    rules={[{ required: true }]}
                >
                    <InputNumber size="large" className="w-full!" placeholder="Enter cuff measurement" />
                </Form.Item>

                <Form.Item
                    label="Short Sleeve"
                    name="short_sleeve"
                    rules={[{ required: true }]}
                >
                    <InputNumber size="large" className="w-full!" placeholder="Enter short sleeve measurement" />
                </Form.Item>

                <Form.Item
                    label="Three Quaters"
                    name="three_quaters"
                    rules={[{ required: true }]}
                >
                    <InputNumber size="large" className="w-full!" placeholder="Enter three quarters measurement" />
                </Form.Item>

                <Form.Item
                    label="Long Sleeve"
                    name="long_sleeve"
                    rules={[{ required: true }]}
                >
                    <InputNumber size="large" className="w-full!" placeholder="Enter long sleeve measurement" />
                </Form.Item>

                <Form.Item
                    label="Shoulder to Bust"
                    name="shoulder_to_bust"
                    rules={[{ required: true }]}
                >
                    <InputNumber size="large" className="w-full!" placeholder="Enter shoulder to bust measurement" />
                </Form.Item>

                <Form.Item
                    label="Shoulder to Under Bust"
                    name="shoulder_to_under_bust"
                    rules={[{ required: true }]}
                >
                    <InputNumber size="large" className="w-full!" placeholder="Enter shoulder to under bust measurement" />
                </Form.Item>

                <Form.Item
                    label="Shoulder to High Waist"
                    name="shoulder_to_high_waist"
                    rules={[{ required: true }]}
                >
                    <InputNumber size="large" className="w-full!" placeholder="Enter shoulder to high waist measurement" />
                </Form.Item>

                <Form.Item
                    label="Shoulder to Low Waist"
                    name="shoulder_to_low_waist"
                    rules={[{ required: true }]}
                >
                    <InputNumber size="large" className="w-full!" placeholder="Enter shoulder to low waist measurement" />
                </Form.Item>

                <Form.Item
                    label="Top Length"
                    name="top_length"
                    rules={[{ required: true }]}
                >
                    <InputNumber size="large" className="w-full!" placeholder="Enter top length measurement" />
                </Form.Item>

                <Form.Item
                    label="Trouser Length"
                    name="trouser_length"
                >
                    <InputNumber size="large" className="w-full!" placeholder="Enter trouser length measurement" />
                </Form.Item>

                <Form.Item
                    label="Shoulder to Hip"
                    name="shoulder_to_hip"
                    rules={[{ required: true }]}
                >
                    <InputNumber size="large" className="w-full!" placeholder="Enter shoulder to hip measurement" />
                </Form.Item>

                <Form.Item
                    label="Shoulder to Knee"
                    name="shoulder_to_knee"
                    rules={[{ required: true }]}
                >
                    <InputNumber size="large" className="w-full!" placeholder="Enter shoulder to knee measurement" />
                </Form.Item>

                <Form.Item
                    label="Short Dress"
                    name="short_dress"
                    rules={[{ required: true }]}
                >
                    <InputNumber size="large" className="w-full!" placeholder="Enter short dress measurement" />
                </Form.Item>

                <Form.Item
                    label="Mid Dress"
                    name="mid_dress"
                    rules={[{ required: true }]}
                >
                    <InputNumber size="large" className="w-full!" placeholder="Enter mid dress measurement" />
                </Form.Item>

                <Form.Item
                    label="Long Dress"
                    name="long_dress"
                    rules={[{ required: true }]}
                >
                    <InputNumber size="large" className="w-full!" placeholder="Enter long dress measurement" />
                </Form.Item>

                <Form.Item
                    label="Gown Length"
                    name="gown_length"
                    rules={[{ required: true }]}
                >
                    <InputNumber size="large" className="w-full!" placeholder="Enter gown length measurement" />
                </Form.Item>

                <Form.Item
                    label="Slit Length"
                    name="slit_length"
                    rules={[{ required: true }]}
                >
                    <InputNumber size="large" className="w-full!" placeholder="Enter slit length measurement" />
                </Form.Item>

                <Form.Item
                    label="Waist to Hip"
                    name="waist_to_hip"
                    rules={[{ required: true }]}
                >
                    <InputNumber size="large" className="w-full!" placeholder="Enter waist to hip measurement" />
                </Form.Item>

                <Form.Item
                    label="Waist to Knee"
                    name="waist_to_knee"
                    rules={[{ required: true }]}
                >
                    <InputNumber size="large" className="w-full!" placeholder="Enter waist to knee measurement" />
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
                    </div>
                    : (

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
                        </div>)}
            </Form>
        </div>
    );
};

export default FemaleForm;
