import { useModalProps } from "@/hooks/use-modal";
import { useApiQueryFilter } from "@/hooks/use-api-query-filter";
import useQueryFetch from "@/hooks/use-query-fetch";
import type { Role, Permission } from "@/@types/users";
import type { ModalMode, AntColumnDef, PaginatedResponse } from "@/@types/common";
import type { RequestError } from "@/@types/error";
import { queryKeys } from "@/constants/query-keys";
import TableHeader from "@/components/crud/table-header";
import PrimaryButton from "@/components/buttons/primary";
import { LiaPlusCircleSolid } from "react-icons/lia";
import { Table, Modal, Tag } from "antd";
import { ManualPagination } from "@/components/crud/pagination";
import TableActions from "@/components/crud/table-actions";
import DeleteCrud from "@/components/crud/delete-item";
import RoleForm from "./role-form";
import { MdOutlineSecurity } from "react-icons/md";
import { FiKey } from "react-icons/fi";
import { hasPermission } from "@/utils/auth";
import { permissions } from "@/config/permissions";
import Details from "./details";
import { CrudService } from "@/services/CrudService";

export const api = new CrudService<Role>("roles");

const RolesMgmt = () => {
    const {
        search,
        currentPage,
        perPage,
        updateSearchParams,
    } = useApiQueryFilter("roles");

    const {
        data: roles,
        isLoading,
    } = useQueryFetch<PaginatedResponse<Role>, RequestError>({
        queryFn: () => api.getPaginatedData({
            search,
            page: currentPage,
            per_page: perPage,
        }),
        title: "Roles",
        queryKeys: [queryKeys.roles, search, currentPage, perPage?.toString()],
    });

    const { updateModal, modalOpen, closeModal } = useModalProps<Role>();
    const columns = getRoleColumns(updateModal);

    return (
        <section>
            <div className="bg-white pb-8 border rounded-xl overflow-hidden">
                <TableHeader
                    onSearch={updateSearchParams}
                    searchDefaultValue={search}
                    searchPlaceholder="Search roles..."
                    childrenStyle="w-30 md:w-auto"
                >
                    {hasPermission(permissions.createRole) && (
                        <PrimaryButton
                            label="Add Role"
                            labelSm="Add"
                            onClick={() => updateModal(null, "add")}
                            className="!py-1.5"
                            icon={<LiaPlusCircleSolid className="ml-1" />}
                        />
                    )}


                </TableHeader>

                <Table
                    columns={columns}
                    pagination={false}
                    dataSource={roles?.data}
                    loading={isLoading}
                    rowKey={"id"}
                    bordered={false}
                    className="border-t border-gray-200/70 px-3 pt-3"
                    scroll={{ x: "max-content" }}
                    onRow={(record) => {
                        return {
                            onClick: () => updateModal(record, "view")
                        }
                    }}
                    rowClassName="text-slate-800 cursor-pointer"
                />

                <ManualPagination total={roles?.meta?.total || 0} tabId="roles" />
            </div>

            <Modal footer={null} open={modalOpen.open} width={modalOpen.type === "delete" ? 450 : 700} onCancel={closeModal}>
                {(modalOpen.type === "add" || modalOpen.type === "edit") && (
                    <RoleForm
                        api={api}
                        closeModal={closeModal}
                        data={modalOpen.data as Role}
                        mode={modalOpen.type}
                    />
                )}

                {modalOpen.type === "view" && (
                    <Details closeModal={closeModal} data={modalOpen.data as Role} />
                )}

                {modalOpen.type === "delete" && (
                    <DeleteCrud
                        key={modalOpen.data?.id}
                        queryKey={queryKeys.roles}
                        closeModal={closeModal}
                        itemName={modalOpen.data?.name}
                        item={modalOpen.data}
                        title="Role"
                        mutateFn={(id: number) => api.deleteItem(id)}
                    />
                )}


            </Modal>
        </section>
    );
};

export const getRoleColumns = (
    updateModal: (data: Role | null, type: ModalMode) => void
): AntColumnDef<Role> => [
        {
            title: '#',
            dataIndex: 'id',
            key: 'id',
            render(_, _2, index) {
                return <span>{index + 1}</span>;
            },
        },
        {
            title: <span className="flex items-center"><MdOutlineSecurity className="mr-1" /> Role Name</span>,
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: "Description",
            dataIndex: "description",
            key: 'description',
            className: "text-gray-500",
            width: "20%",
        },
        {
            title: <span className="flex items-center"><FiKey className="mr-1" /> Permissions</span>,
            dataIndex: 'permissions',
            key: 'permissions',
            render: (permissions: Permission[]) => (
                <div className="flex flex-wrap gap-2">
                    {permissions?.slice(0, 5)?.map(perm => (
                        <Tag key={perm.id} color="blue">{perm.name}</Tag>
                    ))}
                    {(!permissions || permissions.length === 0) && (
                        <span className="text-gray-400">No permissions</span>
                    )}
                    {permissions?.length > 5 && <span className="text-xs italic text-gray-600"> +{permissions.length - 5} more </span>}
                </div>
            ),
        },
        {
            title: 'Actions',
            dataIndex: "actions",
            render(_, record) {
                return (
                    <TableActions
                        onEdit={() => updateModal(record, "edit")}
                        onDelete={() => updateModal(record, "delete")}
                        allowEdit={hasPermission(permissions.updateRole)}
                        allowDelete={hasPermission(permissions.deleteRole)}
                    />
                );
            },
        }
    ];

export default RolesMgmt;
