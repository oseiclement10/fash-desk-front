import { useModalProps } from "@/hooks/use-modal";
import { useApiQueryFilter } from "@/hooks/use-api-query-filter";
import useQueryFetch from "@/hooks/use-query-fetch";
import type { ModalMode, AntColumnDef, PaginatedResponse } from "@/@types/common";
import type { RequestError } from "@/@types/error";
import { queryKeys } from "@/constants/query-keys";

import TableHeader from "@/components/crud/table-header";
import PrimaryButton from "@/components/buttons/primary";
import { LiaPlusCircleSolid } from "react-icons/lia";
import { Table, Modal, Tag, Image } from "antd";
import { ManualPagination } from "@/components/crud/pagination";
import TableActions from "@/components/crud/table-actions";
import DeleteCrud from "@/components/crud/delete-item";
import { FaUserTie } from "react-icons/fa6";

import { CrudService } from "@/services/CrudService";
import type { Customer } from "@/@types/customer";
import { appRoutes } from "@/routes";
import { useNavigate } from "react-router-dom";
import { formatDate } from "@/utils/date-helper";
import { hasPermission } from "@/utils/auth";
import { permissions } from "@/config/permissions";



export const api = new CrudService<Customer>("customers");

const CustomerMgmt = () => {
    const {
        search,
        currentPage,
        perPage,
        updateSearchParams,
    } = useApiQueryFilter();

    const {
        data: customers,
        isLoading,
    } = useQueryFetch<PaginatedResponse<Customer>, RequestError>({
        queryFn: () =>
            api.getPaginatedData({
                search,
                page: currentPage,
                per_page: perPage,
            }),
        title: "Customers",
        queryKeys: [queryKeys.customers, search, currentPage, perPage?.toString()],
    });

   
    const navigate = useNavigate();


    const { updateModal, modalOpen, closeModal } = useModalProps<Customer>();
    const columns = getCustomerColumns(updateModal, (id) => navigate(appRoutes.customerDetails.path.replace(":id", `${id}`)));


   
    return (
        <section>
            <div className="bg-white pb-8 border rounded-xl overflow-hidden">
                <TableHeader
                    onSearch={updateSearchParams}
                    searchDefaultValue={search}
                    searchPlaceholder="Search customers by name or phone..."
                    childrenStyle="w-26 md:w-auto"
                >
                    {hasPermission(permissions.createCustomer) ? (
                        <PrimaryButton
                            label="Add Customer"
                            labelSm="New"
                            onClick={() => null}
                            className="py-1.5!"
                            icon={<LiaPlusCircleSolid className="ml-1" />}
                            asLink={appRoutes.customerForm.path}
                        />

                    ) : null}


                </TableHeader>

                <Table
                    columns={columns}
                    pagination={false}
                    dataSource={customers?.data}
                    loading={isLoading}
                    rowKey={"id"}
                    bordered={false}
                    className="border-t border-gray-200/70 px-3 pt-3"
                    scroll={{ x: "max-content" }}

                    rowClassName="text-slate-800 cursor-pointer"
                />

                <ManualPagination total={customers?.meta?.total || 0} />
            </div>

            <Modal
                footer={null}
                open={modalOpen.open}
                width={modalOpen.type == "add" ? 850 : 500}
                onCancel={closeModal}
            >



                {modalOpen.type === "delete" && (
                    <DeleteCrud
                        key={modalOpen.data?.id}
                        queryKey={queryKeys.customers}
                        closeModal={closeModal}
                        itemName={modalOpen.data?.firstname}
                        item={modalOpen.data}
                        title="Customer"
                        mutateFn={(id: number) => api.deleteItem(id)}
                    />
                )}
            </Modal>
        </section>
    );
};

export const getCustomerColumns = (
    updateModal: (data: Customer | null, type: ModalMode) => void,
    onView: (id: number) => void
): AntColumnDef<Customer> => [
        {
            title: "#",
            dataIndex: "id",
            key: "id",
            render(_, _2, index) {
                return <span>{index + 1}</span>;
            },
        },
        {
            title: (
                <span className="flex items-center">
                    <FaUserTie className="mr-1" /> Name
                </span>
            ),
            key: "customer",
            render: (_, record) => {
                const c = record;
                return (
                    <p className="">{c.full_name}</p>
                );
            },
        },
        {
            title: "Birthdate",
            key: "birthdate",
            dataIndex: "birthdate",
            render: (_, record) => formatDate(record?.birthdate, false),
        },
        {
            title: "Picture",
            dataIndex: "img",
            key: "img",
            render: (_, record) => (
                <Image
                    src={record?.image as string}
                    alt={record?.firstname}
                    width={50}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded-md"
                />
            ),
        },
        {
            title: "Phone Number",
            dataIndex: "phone",
            key: "phone",
            render: (_, record) => record?.phone_full,
        },
        {
            title: "Gender",
            dataIndex: "gender",
            key: "gender",
            render: (_, record) => {
                const g = record.gender;
                const color =
                    g === "male" ? "blue" : g === "female" ? "pink" : "gray";
                return <Tag color={color}>{g.toUpperCase()}</Tag>;
            },
        },

        {
            title: "Address",
            dataIndex: "address",
            key: "address",
            render: (_, record) => record?.address,
        },

        {
            title: "Actions",
            dataIndex: "actions",
            render(_, record) {
                return (
                    <TableActions
                        onEdit={() => updateModal(record, "edit")}
                        onDelete={() => updateModal(record, "delete")}
                        allowView={hasPermission(permissions.viewCustomerDetails)}
                        onView={() => onView(record.id)}
                        allowEdit={false}
                        allowDelete={hasPermission(permissions.deleteCustomer)}
                    />
                );
            },
        },
    ];

export default CustomerMgmt;
