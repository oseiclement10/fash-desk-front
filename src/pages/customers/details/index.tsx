import { Modal, Tabs } from "antd"
import { AiOutlineUser } from "react-icons/ai";
import { LiaRulerVerticalSolid } from "react-icons/lia";
import Measurement from "./Measurement";
import { useNavigate, useParams } from "react-router-dom";
import { useGetDetails } from "@/hooks/use-get-details";
import { api } from "..";
import { queryKeys } from "@/constants/query-keys";
import { SpinLoad } from "@/components/crud/loading";
import { NotFoundCard } from "@/components/cards/not-found";
import { appRoutes } from "@/routes";
import CustomerBasicInfo from "./Bio";
import { useState } from "react";
import Header from "./header";
import { useModalProps } from "@/hooks/use-modal";
import BasicInfoForm from "../registration/basic-info";
import type { Customer } from "@/@types/customer";
import { useQueryClient } from "@tanstack/react-query";

import { CustomerCreationProvider } from "@/contexts/customer-registration/customer-registration";
import Orders from "./orders";
import { ShoppingCart } from "lucide-react";

const CustomerDetails = () => {

    const { id } = useParams();
    const queryClient = useQueryClient();

    const [activeTab, setActiveTab] = useState("bio");

    const queryKey = [queryKeys.customers, id as string];

    const { isLoading, data: customer } = useGetDetails({
        api,
        id: id as string,
        queryKey: [...queryKey],
        title: "Customer Details",
        enabled: !!id,
    });

   


    const navigate = useNavigate();
    const {
        closeModal,
        modalOpen,
        updateModal
    } = useModalProps<Customer>();

    const handleCustomerUpdate = () => {
        queryClient.invalidateQueries({ queryKey: [...queryKey] });
        closeModal();

    }

    return (
        <section>
            <CustomerCreationProvider>

                {
                    isLoading ? <SpinLoad message="loading customer details ..." />
                        : !customer ?
                            <NotFoundCard
                                title="Customer Not Found"
                                actionText="view customers"
                                onAction={() => navigate(appRoutes.customers.path)}
                            /> :
                            <section className="bg-white shadow-md  rounded-3xl overflow-hidden">
                                <Header customer={customer} allowEdit={activeTab === "bio"} onEdit={(_) => updateModal(customer, "edit")} />

                                <Tabs
                                    className="!p-4"
                                    activeKey={activeTab}
                                    onChange={(tab) => setActiveTab(tab)}
                                    items={[
                                        {
                                            key: "bio",
                                            label: (
                                                <span className="flex items-center">
                                                    <AiOutlineUser className="mr-1" /> Personal Info
                                                </span>
                                            ),
                                            children: <CustomerBasicInfo customer={customer} />,
                                        },
                                        {
                                            key: "measurement",
                                            label: (
                                                <span className="flex items-center">
                                                    <LiaRulerVerticalSolid className="mr-1" />
                                                    Measurement
                                                </span>
                                            ),
                                            children: <Measurement onEditSucccess={() => queryClient.invalidateQueries({ queryKey: [...queryKey] })} customer={customer} />,
                                        },

                                        {
                                            key: "orders",
                                            label: (
                                                <span className="flex items-center">
                                                    <ShoppingCart className="mr-1" />
                                                    Orders
                                                </span>
                                            ),
                                            children: <Orders orders={customer?.orders || []} />,
                                        }
                                    ]}
                                />




                                <Modal open={modalOpen?.open && modalOpen?.type == "edit"} width={700} onCancel={closeModal} footer={null}>
                                    <BasicInfoForm
                                        mode="edit"
                                        onBack={closeModal}
                                        customerInfo={modalOpen?.data}
                                        onSuccess={handleCustomerUpdate}
                                        customerId={modalOpen?.data?.id}
                                    />
                                </Modal>
                            </section>

                }
            </CustomerCreationProvider>

        </section>
    )
}

export default CustomerDetails