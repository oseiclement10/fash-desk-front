import type { OverlayProps } from "@/@types/common";
import { FormHeader, FormFooter, FormConfig } from "@/components/crud/form-config";
import { Form, Input } from "antd";
import { useDataMutationHook } from "@/hooks/use-form-submission";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import type { User } from "@/@types/users";
import { RiLockPasswordLine } from "react-icons/ri";

const ResetPasswordForm = ({ closeModal, api, data }: OverlayProps<User>) => {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    const onSuccess = () => {
        queryClient.refetchQueries({ queryKey: [queryKeys.staff] });
        closeModal();
        form.resetFields();
    };

    const { saving, update: resetPassword } = useDataMutationHook({
        title: "Password",
        onSuccessFn: onSuccess,
        api,
    });

    const onFinish = (values: any) => {
        resetPassword({
            id: data?.id as number,
            data: values,
            extraPath: `${data?.id}/password-reset`
        });
    };

    return (
        <FormConfig>
            <FormHeader>
                Reset Password for {data?.name}
                <RiLockPasswordLine className="ml-1" />
            </FormHeader>

            <Form
                form={form}
                disabled={saving}
                onFinish={onFinish}
                layout="vertical"
                className="pt-4"
            >
                <Form.Item
                    label="New Password"
                    name="password"
                    rules={[
                        { required: true, message: 'Please enter new password' },
                        { min: 6, message: 'Password must be at least 6 characters' }
                    ]}
                >
                    <Input.Password placeholder="Enter new password" size="large" />
                </Form.Item>

                <Form.Item
                    label="Confirm New Password"
                    name="password_confirmation"
                    dependencies={['password']}
                    rules={[
                        { required: true, message: 'Please confirm your password' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The two passwords do not match!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password placeholder="Confirm new password" size="large" />
                </Form.Item>

                <div className="mt-6">
                    <FormFooter
                        label="Reset Password"
                        onClose={closeModal}
                        loading={saving}
                    />
                </div>
            </Form>
        </FormConfig>
    );
};

export default ResetPasswordForm;
