import type { AntColumnDef, ModalMode, PaginatedResponse } from "@/@types/common"
import type { User } from "@/@types/users"
import type { RequestError } from "@/@types/error"
import PrimaryButton from "@/components/buttons/primary"
import { ManualPagination } from "@/components/crud/pagination"
import { queryKeys } from "@/constants/query-keys"
import { useApiQueryFilter } from "@/hooks/use-api-query-filter"
import useQueryFetch from "@/hooks/use-query-fetch"
import { CrudService } from "@/services/CrudService"
import { Modal, Table, Avatar } from "antd"
import { FiEdit } from "react-icons/fi"
import { MdOutlineAutoDelete } from "react-icons/md"
import { LiaPlusCircleSolid } from "react-icons/lia"
import { Status } from "@/components/crud/entity-status"
import { useModalProps } from "@/hooks/use-modal"
import TableHeader from "@/components/crud/table-header"
import StatusFilter from "@/components/crud/status-filter"
import UserForm from "./staff-form"
import ResetPasswordForm from "./password-reset-form"
import DeleteCrud from "@/components/crud/delete-item"
import { FaUsers } from "react-icons/fa"
import { StatCardSmall } from "@/components/cards/stat-card"
import type { Role } from "@/@types/users"
import { hasPermission } from "@/utils/auth"
import { permissions } from "@/config/permissions"
import { RiLockPasswordLine } from "react-icons/ri"

export const api = new CrudService<User>("users");

type UsersPageResponse = {
  statistics: {
    total_users: number,
    active_users: number,
    inactive_users: number,
    new_registrations: number
  },
  users: PaginatedResponse<User>
}

const Users = () => {
  const {
    search,
    currentPage,
    perPage,
    status,
    updateSearchParams,
    updateStatus
  } = useApiQueryFilter();

  const {
    data: usersResponse,
    isLoading
  } = useQueryFetch<UsersPageResponse, RequestError>({
    queryFn: () => api.getRaw({ status, search, page: currentPage, per_page: perPage }),
    title: "Staff",
    queryKeys: [queryKeys.staff, search, currentPage, perPage?.toString(), status],
  });


  const { updateModal, modalOpen, closeModal } = useModalProps<User>();

  const columns = getUserColumns(updateModal);


  return (
    <section>
      <div className="flex items-center mb-6 justify-end mt-4">

        {hasPermission(permissions.createUser) && (
          <PrimaryButton
            label="Add New Staff"
            onClick={() => updateModal(null, "add")}
            icon={<LiaPlusCircleSolid className="ml-1" />}
          />
        )}
      </div>

      <div className="grid mb-8 gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <StatCardSmall
          label="Active Staff"
          value={usersResponse?.statistics?.active_users || 0}
          bgColor="bg-primary"
          textColor="text-white"
          extra={<FaUsers size={18} className="text-primary" />}
          loading={isLoading}
        />

        <StatCardSmall
          label="Inactive Staff"
          value={usersResponse?.statistics?.inactive_users || 0}
          bgColor="bg-white"
          textColor="text-primary"
          extra={<FaUsers size={18} />}
          loading={isLoading}
        />

        <StatCardSmall
          label="Total Staff"
          value={usersResponse?.statistics?.total_users || 0}
          bgColor="bg-white"
          textColor="text-primary"
          extra={<FaUsers size={18} />}
          loading={isLoading}
        />

        <StatCardSmall
          label="New Joiners"
          value={usersResponse?.statistics?.new_registrations || 0}
          bgColor="bg-white"
          textColor="text-primary"
          extra={<FaUsers size={18} />}
          loading={isLoading}
        />
      </div>

      <div className="bg-white pb-8 border rounded-xl overflow-hidden">
        <TableHeader
          onSearch={updateSearchParams}
          searchDefaultValue={search}
          searchPlaceholder="search user here"
          className="md:flex-row flex-col space-y-4 md:space-y-0"
          childrenStyle="w-full md:w-auto"
        >
          <StatusFilter
            onFilter={(val) => updateStatus(val)}
            val={status}
            placeholder="filter by status"
          />
        </TableHeader>
        <Table
          columns={columns}
          pagination={false}
          dataSource={usersResponse?.users?.data}
          rowKey={(record) => record.id}
          loading={isLoading}
          bordered={false}
          className="border-t border-gray-200/70"
          scroll={{ x: "max-content" }}
          rowClassName="text-slate-800"
        />

        <ManualPagination total={usersResponse?.users?.meta?.total || 0} />
      </div>

      <Modal
        footer={null}
        open={modalOpen.open}
        width={(modalOpen.type == "delete" || modalOpen.type == "other") ? 500 : 550}
        onCancel={closeModal}
      >
        {(modalOpen.type == "add" || modalOpen.type == "edit") && (
          <UserForm
            api={api}
            closeModal={closeModal}
            data={modalOpen.data as User}
            mode={modalOpen.type}
          />
        )}

        {modalOpen.type == "password-reset" && (
          <ResetPasswordForm
            api={api}
            closeModal={closeModal}
            data={modalOpen.data as User}
            mode={modalOpen.type}
          />
        )}


        {modalOpen.type == "delete" && (
          <DeleteCrud
            key={modalOpen.data?.id}
            queryKey={queryKeys.staff}
            closeModal={closeModal}
            itemName={modalOpen?.data?.name}
            item={modalOpen.data}
            title="User"
            mutateFn={(id: number) => api.deleteItem(id)}
          />
        )}
      </Modal>
    </section>
  )
}

export const getUserColumns = (
  updateModal: (data: User | null, type: ModalMode) => void
): AntColumnDef<User> => [
    {
      title: "#",
      dataIndex: "#",
      render(_, _2, index) {
        return <span className="text-blue-600">{index + 1}</span>;
      },
    },
    {
      title: "User",
      dataIndex: "name",
      render(_, record) {
        return (
          <div className="flex items-center space-x-3!">
            {record.image ?
              <Avatar src={record.image} alt={record.name} /> :
              <span className="h-7 w-7 text-center items-center justify-center text-blue-100 rounded-full flex bg-blue-500">
                {record?.name?.charAt(0)}
              </span>
            }
            <div>
              <p className="font-medium">{record.name}</p>
              <p className="text-xs text-gray-500">{record.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      title: "Phone",
      dataIndex: "phone_number",
      render(value: string, record) {
        return value
          ? `+${record.phone_code} ${value}`
          : <span className="text-gray-400 italic">No phone</span>;
      },
    },
    {
      title: "Role(s)",
      dataIndex: "roles",
      render(value: Role[]) {
        const isEmpty = !value || value.length == 0;
        const isMoreThan3 = value.length > 3;
        return (
          <div className="flex items-center space-x-2">
            {isEmpty && <span className="text-gray-400 italic">No roles</span>}
            {value?.slice(0, 3)?.map((role) => (
              <span key={role.id} className="px-2 text-xs bg-amber-50 border border-amber-300 rounded-sm py-0.5">
                {role.name}
              </span>
            ))}
            {isMoreThan3 && <span className="text-gray-400 italic">+{value.length - 3}</span>}
          </div>
        )
      },
    },

    {
      title: "Status",
      dataIndex: "is_active",
      render(value: boolean) {
        return <Status value={value} />;
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render(_, record) {
        return (
          <div className="flex space-x-2">





            {hasPermission(permissions.updateUser) && (
              <button
                onClick={() => updateModal(record, "edit")}
                title="Edit user"
                className="border cursor-pointer rounded-md px-2 py-0.5 flex items-center text-xs hover:text-blue-600 active:opacity-10"
              >
                <FiEdit className="mr-1" /> Edit Info
              </button>
            )}

            {hasPermission(permissions.updateUser) && (
              <button
                onClick={() => updateModal(record, "password-reset")}
                title="Reset password"
                className="border cursor-pointer rounded-md px-2 py-0.5 flex items-center text-xs hover:text-amber-600 active:opacity-10"
              >
                <RiLockPasswordLine className="mr-1" /> Reset Pass
              </button>
            )}


            {hasPermission(permissions.deleteUser) && (
              <button
                onClick={() => updateModal(record, "delete")}
                title="Delete user"
                className="border cursor-pointer rounded-md px-2 py-0.5 flex items-center text-xs hover:text-rose-600 active:opacity-10"
              >
                <MdOutlineAutoDelete className="mr-1 text-rose-600" /> Delete
              </button>
            )}
          </div>
        )
      },
    },
  ];

export { Users as default }
