import type { OverlayProps } from "@/@types/common";
import { FormHeader, FormFooter, FormConfig } from "@/components/crud/form-config";
import { queryKeys } from "@/constants/query-keys";
import { Form, Input, Select, Space, Switch, type UploadFile } from "antd";
import { useEffect, useState } from "react";
import { useDataMutationHook } from "@/hooks/use-form-submission";
import { useQueryClient } from "@tanstack/react-query";
import { AiOutlineEdit, AiOutlineUserAdd } from "react-icons/ai";
import { api as rolesApi } from '../roles-and-permissions';
import type { User } from "@/@types/users";
import { SpinLoad } from "@/components/crud/loading";
import useQueryFetch from "@/hooks/use-query-fetch";
import UploadImage, { setupImageForDisplay } from "@/components/crud/image-upload";
import { countries } from "@/utils/countries";

const UserForm = ({ closeModal, mode, data, api }: OverlayProps<User>) => {
    const [form] = Form.useForm();
    const [staffImage, setStaffImage] = useState<UploadFile[]>([]);
    const queryClient = useQueryClient();
   

    const { data: roles, isLoading: rolesLoading } = useQueryFetch({
        title: "Roles",
        queryFn: () => rolesApi.getPaginatedData({ per_page: "100", page: 1 }),
        queryKeys: [queryKeys.roles],
    });

    const onSuccess = () => {
        queryClient.refetchQueries({ queryKey: [queryKeys.staff] });
        closeModal();
        form.resetFields();
    };

    const { saving, saveNew: saveUser, update: updateUser } = useDataMutationHook({
        title: "User",
        onSuccessFn: onSuccess,
        api,
        hasFile: true,
    });

    const onFinish = (values: Omit<User, "image"> & { image: UploadFile | undefined }) => {
        values.image = staffImage[0]?.originFileObj;
        if (mode === "add") {
            saveUser(values);
        } else {
            updateUser({ id: data?.id as number, data: values });
        }
    };

    useEffect(() => {
        if (mode === "edit" && data) {
            form.setFieldsValue({
                name: data.name,
                email: data.email,
                address: data.address,
                phone_number: data.phone_number,
                phone_code: data.phone_code,
                roles: data.roles?.map(r => r.id),
            });
            if (data.image) {
                setStaffImage(setupImageForDisplay(data.image, data.name + "bethel_staff"));
            }
        } else {
            setStaffImage([]);
            form.resetFields();
        }
    }, [mode, data]);

    return (
        <FormConfig>
            <FormHeader>
                {mode === "edit" ? "Edit Staff" : "Add New Staff"}
                {mode === "edit" ? <AiOutlineEdit className="ml-1" /> : <AiOutlineUserAdd className="ml-1" />}
            </FormHeader>

            <Form
                form={form}
                disabled={saving}
                onFinish={onFinish}
                className="grid md:grid-cols-2 gap-x-8"
                layout="vertical"
                initialValues={{
                    phone_code: "233"
                }}
            >
                {rolesLoading ? (
                    <SpinLoad message="loading data ... " className="md:col-span-2" />
                ) : (
                    <>
                        <Form.Item label="Staff Passport" >
                            <UploadImage value={staffImage} updateValue={(val) => setStaffImage(val)} />
                        </Form.Item>

                        <Form.Item label="Full Name" name="name" rules={[{ required: true }]}>
                            <Input placeholder="Enter name" size="large" />
                        </Form.Item>

                        <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
                            <Input placeholder="Enter email" size="large" />
                        </Form.Item>

                        {/* Phone */}
                        <Form.Item label="Phone" required className="w-full!">
                            <Space.Compact className="w-full!">
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
                                    <Input placeholder="Enter phone number" style={{ width: "65%" }} size="large" />
                                </Form.Item>
                            </Space.Compact>
                        </Form.Item>

                        <Form.Item label="Address" name="address" className="md:col-span-2" rules={[{ required: true }]}>
                            <Input placeholder="Enter address" size="large" />
                        </Form.Item>

                        <Form.Item label="Roles" name="roles" rules={[{ required: true }]} className="md:col-span-2">
                            <Select
                                placeholder="Select role(s)"
                                size="large"
                                options={roles?.data?.map(role => ({ label: role.name, value: role.id }))}
                                mode="multiple"
                                showSearch
                                optionFilterProp="label"
                            />
                        </Form.Item>

                        <Form.Item label="Status (active/inactive)" className="md:col-span-2" valuePropName="checked">
                            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                            <span className="px-2 text-green-500">
                                {status ? "Active" : <span className="text-red-800">Inactive</span>}
                            </span>
                        </Form.Item>

                        {mode == "add" && (
                            <>
                                <Form.Item label="Account Password" name="password" rules={[{ required: true, min: 6 }]}>
                                    <Input.Password placeholder="create password for account" size="large" />
                                </Form.Item>
                                <Form.Item
                                    label="Confirm Password"
                                    name="password_confirmation"
                                    rules={[{ required: true, min: 6 }]}
                                >
                                    <Input.Password placeholder="create password for account" size="large" />
                                </Form.Item>
                            </>
                        )}

                        <div className="md:col-span-2">
                            <FormFooter
                                label={mode === "add" ? "Add New Staff" : "Update Staff Info"}
                                onClose={closeModal}
                                loading={saving}
                            />
                        </div>
                    </>
                )}
            </Form>
        </FormConfig>
    );
};

export default UserForm;
