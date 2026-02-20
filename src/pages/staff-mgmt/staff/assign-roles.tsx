import { useEffect, useMemo, useState } from "react";
import { Checkbox, Space, notification, Spin, Typography } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { parseApiError } from "@/utils/parse-api-errors";
import { FormConfig, FormFooter } from "@/components/crud/form-config";
import useGetRoles from "../roles-and-permissions/use-get-roles";
import type { Staff } from "@/@types/central-entities";
import type { CrudService } from "@/services/CrudService";


const { Text } = Typography;

interface Props {
    staff: Staff;
    closeModal: () => void;
    api: CrudService<Staff>
}

const UserRoleAssignment = ({ staff, closeModal, api }: Props) => {

    const {
        data: roles,
        isLoading
    } = useGetRoles({});

    const queryClient = useQueryClient();

    const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

    useEffect(() => {
        if (!roles) return;

        const staffRoleIds = staff?.roles?.map((r) => r.id) ?? [];
        setSelectedRoles(staffRoleIds);
    }, [roles, staff?.roles]);

    const selectedCount = useMemo(() => selectedRoles.length, [selectedRoles]);

    const { mutate, isPending: saving } = useMutation({
        mutationFn: (payload: object) => api.addNewItem(payload, `${staff?.id}/roles`),
        onSuccess: () => {
            queryClient.refetchQueries({ queryKey: [queryKeys.staff] });
            notification.success({ message: "Updated roles successfully" });
            closeModal();
        },
        onError: (err) => {
            notification.error({ message: parseApiError(err as any), duration: 8 });
        },
    });

    const toggleRole = (roleId: number, checked: boolean) => {
        setSelectedRoles((prev) =>
            checked ? [...prev, roleId] : prev.filter((r) => r != roleId)
        );
    };

    const onSave = () => {
        if (selectedCount === 0) {
            notification.error({ message: "Please select at least one role." });
            return;
        }

        const payload = {
            roles: selectedRoles,
        };


        mutate(payload);
    };

    return (
        <FormConfig>
            <div className="font-poppins mb-4">
                <h2 className="text-xl font-medium text-primary">Role Assignment</h2>
                <p className="text-gray-600 mb-4 border-b pb-3">
                    Select the roles you want to assign to this staff
                </p>
                <h2>
                    Staff : <span className="font-medium">{staff?.central_user?.name}</span>
                </h2>
            </div>
            <div className="space-y-4">
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Spin />
                    </div>
                ) : roles?.data?.length === 0 ? (
                    <div className="text-center py-4">No roles available.</div>
                ) : (
                    <Space direction="vertical" style={{ width: "100%" }}>
                        {roles?.data?.map((role) => {
                            const isChecked = selectedRoles.includes(role.id);
                            return (
                                <button
                                    key={role.id}
                                    className="flex flex-col md:flex-row  md:items-center hover:bg-blue-50 transition-colors ease-in-out duration-200 w-full justify-between border rounded-md px-4 py-3"
                                    onClick={() => toggleRole(role.id, !isChecked)}
                                >
                                    <div className="flex-1 flex flex-col items-start capitalize ">
                                        <h2 className="font-semibold">{role.name}</h2>
                                        {role.description && (
                                            <div className="text-gray-500 text-left text-xs">
                                                {role.description}
                                            </div>
                                        )}
                                    </div>

                                    <Checkbox
                                        checked={isChecked}
                                    />
                                </button>
                            );
                        })}
                    </Space>
                )}

                <div className="flex border-t pt-6 mt-4 items-center justify-between">
                    <div>
                        <Text>
                            Selected: <Text strong>{selectedCount}</Text>
                        </Text>
                    </div>

                    <FormFooter
                        label="Save Roles"
                        onClose={closeModal}
                        disabled={saving || isLoading}
                        onSubmit={onSave}
                    />

                </div>
            </div>
        </FormConfig>
    );
};

export default UserRoleAssignment;
