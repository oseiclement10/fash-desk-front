import type { Customer } from "@/@types/customer";
import type { UploadFile } from "antd";
import { useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, Select, Space, Modal } from "antd";
import { AiOutlineEdit, AiOutlineUserAdd } from "react-icons/ai";
import { FormConfig, FormFooter, FormHeader } from "@/components/crud/form-config";
import UploadImage, { setupImageForDisplay } from "@/components/crud/image-upload";
import { countries } from "@/utils/countries";
import type { CustomerInfoData } from "@/contexts/customer-registration/types";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import dayjs from "dayjs";
import { useDataMutationHook } from "@/hooks/use-form-submission";
import { api } from "..";

interface BasicInfoFormProps {
    mode: "add" | "edit";
    onSuccess: (data: Omit<Customer, "id" | "image_url" | "primary_business" | "created_at" | "updated_at"> & { image?: File }) => void;
    onBack: () => void;
    customerInfo?: CustomerInfoData | null;
    customerId?: number;
    existsWithinBusiness?: boolean;
}

const BasicInfoForm = ({
    mode,
    onSuccess,
    onBack,
    customerInfo,
    existsWithinBusiness,
    customerId,
}: BasicInfoFormProps) => {


    const [form] = Form.useForm();
    const [customerImage, setCustomerImage] = useState<UploadFile[]>([]);
    const [status, setStatus] = useState(false);
    const [showDuplicateAlert, setShowDuplicateAlert] = useState(false);

    const { saving, update } = useDataMutationHook({
        api,
        onSuccessFn: (resp) => {
            onSuccess(resp);
        },
        hasFile: true,
        title: "Customer",
    });

    /** handle population of form */
    useEffect(() => {
        if (customerInfo && !existsWithinBusiness) {
            form.setFieldsValue({
                firstname: customerInfo.firstname,
                othernames: customerInfo.othernames,
                email: (customerInfo as any).email,
                gender: customerInfo.gender,
                phone_code: customerInfo.phone_code,
                phone_number: customerInfo.phone_number,
                birthdate: customerInfo.birthdate ? dayjs(customerInfo.birthdate) : null,
                alternate_phone_code: customerInfo.alternate_phone_code,
                alternate_phone_number: customerInfo.alternate_phone_number,
                secondary_phone_code: customerInfo.secondary_phone_code,
                secondary_phone_number: customerInfo.secondary_phone_number,
                address: customerInfo.address,
                occupation: customerInfo.occupation,
            });

            if (customerInfo.image) {
                setCustomerImage(
                    setupImageForDisplay(customerInfo.image, customerInfo.firstname + "_customer")
                );
            }
        } else {
            setCustomerImage([]);
            form.resetFields();
           
            setStatus(false);
        }
    }, [customerInfo]);

    /** handle submission */
    const handleSubmit = (values: any) => {
        const payload = {
            ...values,
            status,
            birthdate: values.birthdate?.format("YYYY-MM-DD"),
            image: customerImage[0]?.originFileObj,
        };

        if (mode === "edit" && customerInfo) {
            update({ id: customerId as number, data: payload });
        } else {
            onSuccess(payload);
        }
    };

    /** duplicate phone number alert */
    useEffect(() => {
        if (existsWithinBusiness) {
            setShowDuplicateAlert(true);
        }
    }, [existsWithinBusiness]);

    const handleContinueWithDuplicate = () => {
        setShowDuplicateAlert(false);
    };

    const handleBackFromDuplicate = () => {
        setShowDuplicateAlert(false);
        onBack();
    };

    return (
        <FormConfig>
            {/* Duplicate number modal */}
            <Modal
                open={showDuplicateAlert}
                onCancel={handleBackFromDuplicate}
                footer={null}
                centered
            >
                <div className="text-center space-y-3 py-4">
                    <p className="text-base font-medium text-gray-800">
                        This phone number already belongs to an existing customer in this business.
                    </p>
                    <p className="text-gray-600 text-sm">
                        Do you still want to continue using it for this registration?
                    </p>
                    <div className="flex justify-center gap-3 pt-3">
                        <Button
                            onClick={handleBackFromDuplicate}
                            size="large"
                            className="!bg-gray-100 hover:!bg-gray-200"
                        >
                            Go Back
                        </Button>
                        <Button
                            type="primary"
                            onClick={handleContinueWithDuplicate}
                            size="large"
                            className="!bg-amber-500 hover:!bg-amber-600"
                        >
                            Continue Anyway
                        </Button>
                    </div>
                </div>
            </Modal>

            

            <FormHeader>
                Basic Info
                {mode === "edit" ? (
                    <AiOutlineEdit className="ml-1" />
                ) : (
                    <AiOutlineUserAdd className="ml-1" />
                )}
            </FormHeader>

            <Form
                form={form}
                layout="vertical"
                className="grid md:grid-cols-2 gap-x-8"
                onFinish={handleSubmit}
                initialValues={{
                    phone_code: "233",
                    alternate_phone_code: "233",
                }}
            >
                {/* Image */}
                <Form.Item label="Customer Image">
                    <UploadImage value={customerImage} updateValue={setCustomerImage} />
                </Form.Item>

                <Form.Item
                    label="First Name"
                    name="firstname"
                    rules={[{ required: true, message: "Please enter first name" }]}
                >
                    <Input placeholder="Enter first name" size="large" />
                </Form.Item>

                <Form.Item label="Other Names" name="othernames">
                    <Input placeholder="Enter other names" size="large" />
                </Form.Item>

                <Form.Item
                    label="Date of Birth"
                    name="birthdate"
                    rules={[{ required: true, message: "Birthdate is required" }]}
                >
                    <DatePicker size="large" className="!w-full" />
                </Form.Item>

                <Form.Item label="Email" name="email">
                    <Input placeholder="Enter email" size="large" />
                </Form.Item>

                {/* Phone */}
                <Form.Item label="Phone" required className="!w-full">
                    <Space.Compact className="!w-full">
                        <Form.Item
                            name="phone_code"
                            noStyle
                            rules={[{ required: true, message: "Please select code" }]}
                        >
                            <Select
                                placeholder="Code"
                                style={{ width: "35%" }}
                                size="large"
                                options={countries.map((country) => ({
                                    value: country.callingCode,
                                    label: `${country.flag} ${country.callingCode}`,
                                    countryName: country.name.toLowerCase(),
                                    callingCode: country.callingCode.replace(/\D/g, ""),
                                }))}
                                optionFilterProp="countryName"
                                showSearch
                            />
                        </Form.Item>

                        <Form.Item
                            name="phone_number"
                            noStyle
                            rules={[{ required: true, message: "Please enter phone number" }]}
                        >
                            <Input
                                placeholder="Enter phone number"
                                style={{ width: "65%" }}
                                size="large"
                            />
                        </Form.Item>
                    </Space.Compact>
                </Form.Item>

                {/* Alternate Phone */}
                <Form.Item label="Alternate Phone">
                    <Space.Compact className="!w-full">
                        <Form.Item
                            name="alternate_phone_code"
                            noStyle
                            dependencies={["alternate_phone_number"]}
                            rules={[
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        const phoneNumber = getFieldValue("alternate_phone_number");
                                        if (phoneNumber && !value) {
                                            return Promise.reject(new Error("Please select code"));
                                        }
                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                        >
                            <Select
                                placeholder="Code"
                                style={{ width: "35%" }}
                                size="large"
                                options={countries.map((country) => ({
                                    value: country.callingCode,
                                    label: `${country.flag} ${country.callingCode}`,
                                    countryName: country.name.toLowerCase(),
                                    callingCode: country.callingCode.replace(/\D/g, ""),
                                }))}
                                optionFilterProp="countryName"
                                showSearch
                            />
                        </Form.Item>

                        <Form.Item
                            name="alternate_phone_number"
                            noStyle
                            dependencies={["alternate_phone_code"]}
                        >
                            <Input
                                placeholder="Enter alternate phone"
                                style={{ width: "70%" }}
                                size="large"
                            />
                        </Form.Item>
                    </Space.Compact>
                </Form.Item>

                <Form.Item
                    label="Gender"
                    name="gender"
                    rules={[{ required: true, message: "Please select gender" }]}
                >
                    <Select
                        placeholder="Select gender"
                        size="large"
                        options={[
                            { label: "Male", value: "male" },
                            { label: "Female", value: "female" },
                            { label: "Other", value: "other" },
                        ]}
                    />
                </Form.Item>

                <Form.Item label="Occupation" name="occupation">
                    <Input placeholder="Enter occupation" size="large" />
                </Form.Item>

                <Form.Item
                    label="Address"
                    name="address"
                    className="md:col-span-2"
                    rules={[{ required: true, message: "Please enter address" }]}
                >
                    <Input placeholder="Enter address" size="large" />
                </Form.Item>

                {/* Footer */}
                {mode === "edit" ? (
                    <FormFooter
                        label="Update Customer Info"
                        onClose={onBack}
                        loading={saving}
                    />
                ) : (
                    <div className="md:col-span-2 border-t space-x-8 pt-5 mt-4 flex items-center justify-between">
                        <Button
                            type="default"
                            htmlType="button"
                            size="large"
                            icon={<IoMdArrowBack />}
                            className="!w-2/6"
                            onClick={onBack}
                        >
                            Back
                        </Button>

                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            icon={<IoMdArrowForward />}
                            loading={saving}
                            className="!bg-primary hover:!bg-primary/80 lg:!w-4/6 shadow-md hover:shadow-lg"
                        >
                            Continue
                        </Button>
                    </div>
                )}
            </Form>
        </FormConfig>
    );
};

export default BasicInfoForm;
