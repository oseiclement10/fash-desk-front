import type { OverlayProps } from "@/@types/common";
import type { Staff } from "@/@types/central-entities"
import { FormFooter, FormHeader } from "@/components/crud/form-config"
import { queryKeys } from "@/constants/query-keys";
import { useGetDetails } from "@/hooks/use-get-details";
import { Divider, Tag } from "antd"
import { SpinLoad } from "@/components/crud/loading";

const Details = ({ closeModal, data, api, }: Omit<OverlayProps<Staff>, "mode">) => {

    const queryKey = [queryKeys.staff, `${data?.id || ''}`];

    const { data: staff, isLoading } = useGetDetails({
        api,
        id: data?.id as number,
        title: "Staff Details",
        queryKey: [...queryKey],
    });

    const user = staff?.central_user


    return (
        <div className="space-y-6 p-4 font-poppins">
            <FormHeader>
                <h2>Role Details </h2>
            </FormHeader>
            {isLoading ? <SpinLoad /> : <>
                <div className="space-y-2">
                    <p>
                        <span className="font-medium">Name:</span> {user?.name}
                    </p>
                    <p>
                        <span className="font-medium">Email:</span> {user?.email}
                    </p>
                    <p>
                        <span className="font-medium">Phone:</span> (+{user?.phone_code}) {user?.phone_number}
                    </p>
                    <p>
                        <span className="font-medium">Address:</span> {user?.address || "-"}
                    </p>
                    <p>
                        <span className="font-medium">Status:</span>{" "}
                        {user?.status ? (
                            <Tag color="green">Active</Tag>
                        ) : (
                            <Tag color="red">Inactive</Tag>
                        )}
                    </p>
                </div>
                <Divider />

                {staff?.roles?.length ? (
                    <div className="space-y-4">
                        {staff.roles.map((role) => (
                            <div key={role.id} className="border rounded-md p-3">
                                <h3 className="font-semibold capitalize">{role.name}</h3>
                                <p className="text-sm text-gray-600">{role.description}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No roles assigned.</p>
                )}


            </>}



            <FormFooter onClose={closeModal} hideSubmit label="" cancelLabel="Close" />
        </div>
    )
}



export default Details