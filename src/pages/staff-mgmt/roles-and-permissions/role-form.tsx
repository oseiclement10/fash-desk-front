import type { OverlayProps } from "@/@types/common";
import type { Permission, Role } from "@/@types/users";
import { FormHeader, FormFooter, FormConfig } from "@/components/crud/form-config";
import { Checkbox, Form, Input } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useDataMutationHook } from "@/hooks/use-form-submission";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { AiOutlineEdit } from "react-icons/ai";
import FormErrorAlert from "@/components/crud/form-error-alert";
import { parseApiError } from "@/utils/parse-api-errors";
import type { RequestError } from "@/@types/error";
import useQueryFetch from "@/hooks/use-query-fetch";
import { SpinLoad } from "@/components/crud/loading";
import CustomCheckbox from "@/components/crud/custom-checkbox";
import { CrudService } from "@/services/CrudService";


const permissionsApi = new CrudService<Permission>("permissions");


const RoleForm = ({
    closeModal,
    mode,
    data: role,
    api,
}: OverlayProps<Role>) => {
    const [form] = Form.useForm();
    const [showError, setShowError] = useState(false);
    const queryClient = useQueryClient();


    const { data: allPermissions, isLoading: permissionsLoad } = useQueryFetch({
        title: "Role Permissions",
        queryKeys: [queryKeys.permissions],
        queryFn: () => permissionsApi.getPaginatedData()
    });

    const initialPermissions = useMemo(
        () => role?.permissions?.map((p) => p.id) || [],
        [role?.permissions]
    );

    const [selectedPermissions, setSelectedPermissions] = useState<number[]>(
        initialPermissions
    );


    const onSuccess = () => {
        queryClient.refetchQueries({ queryKey: [queryKeys.roles] });
        closeModal();
        form.resetFields();
    };

    const { saving, saveNew: saveRole, update: updateRole, error } = useDataMutationHook({
        title: "Role",
        onSuccessFn: onSuccess,
        onError: () => setShowError(true),
        api,
    });

    const onFinish = (values: any) => {
        values.permissions = selectedPermissions;
        if (mode === "add") {
            saveRole(values);
        } else {
            updateRole({ id: role?.id as number, data: values });
        }
    };

    useEffect(() => {
        if (mode === "edit" && role) {
            form.setFieldsValue({
                name: role?.name,
                description: role?.description,
            });
        } else {
            form.resetFields();
        }
    }, [mode, role]);

    return (
        <FormConfig>



            <FormHeader>
                {mode === "edit" ? "Edit Role" : "Add New Role"}
                {mode === "edit" ? <AiOutlineEdit className="ml-1" /> : null}
            </FormHeader>

            {permissionsLoad ?
                <SpinLoad message="loading permissions" /> :
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    onValuesChange={() => setShowError(false)}
                    className=""
                >
                    <Form.Item
                        name="name"
                        label="Role Name"
                        rules={[{ required: true, message: "Please enter role name" }]}

                    >
                        <Input size="large" placeholder="Enter role name" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Role Description"
                        rules={[{ required: true, message: "Please enter role description" }]}

                    >
                        <Input.TextArea size="large" placeholder=" role description here " />
                    </Form.Item>


                    <h2 className="text-base mb-3 text-slate-800 "> <span className="mr-0.5 text-xs text-red-600">*</span> Permissions </h2>

                    <div className="max-h-96 overflow-y-auto mb-6">
                        <Checkbox.Group
                            value={selectedPermissions}
                            onChange={(values: number[]) => {
                                setSelectedPermissions(values);
                                setShowError(false);
                            }}
                        >
                            {!allPermissions?.data?.length && <p>No permissions available now</p>}
                            <div className="flex items-center flex-wrap gap-4">
                                {allPermissions?.data?.map((permission) => (
                                    <CustomCheckbox key={permission.id} item={permission} />
                                ))}
                            </div>

                        </Checkbox.Group>
                    </div>



                    {(showError && error) && (
                        <FormErrorAlert
                            className="md:col-span-2"
                            message={parseApiError(error as RequestError)}
                        />
                    )}

                    <div className="md:col-span-2">
                        <FormFooter
                            label={mode === "edit" ? "Update Role" : "Add Role"}
                            onClose={closeModal}
                            loading={saving}
                        />
                    </div>
                </Form>
            }


        </FormConfig >
    );
};

export default RoleForm;
