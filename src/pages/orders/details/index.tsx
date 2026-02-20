import { Tabs } from "antd";
import Info from "./Info";
import Transactions from "./Transactions";
import { FaCircleInfo } from "react-icons/fa6";
import { GiMoneyStack } from "react-icons/gi";
import { useGetDetails } from "@/hooks/use-get-details";
import { api } from "..";
import { useParams } from "react-router-dom";
import { queryKeys } from "@/constants/query-keys";
import { SpinLoad } from "@/components/crud/loading";
import { NotFoundCard } from "@/components/cards/not-found";
import { GoBackBtn } from "@/components/buttons/backbutton";

const OrderDetails = () => {

    const { id } = useParams();

    const queryKey = [queryKeys.orders, id as string];

    const { data: orderItem, isLoading } = useGetDetails({
        api,
        title: "Order Details",
        id: parseInt(id as string || ""),
        queryKey: [...queryKey],
        enabled: !!id,
    });

    console.log("Order Item: ", orderItem);


    return (
        <section className="bg-white p-3 md:p-8 border rounded-xl overflow-hidden">
            <GoBackBtn className="ml-auto" />
            {
                isLoading ?
                    <SpinLoad
                        caption="Loading Order Details"
                        message="Please wait..."
                    /> :
                    !orderItem ?
                        <NotFoundCard /> :
                        <Tabs
                            items={[
                                {
                                    key: "Order Info",
                                    label: (
                                        <span className="flex items-center">
                                            <FaCircleInfo className="mr-1" /> Order Info
                                        </span>
                                    ),
                                    children: <Info orderItem={orderItem} />,
                                },
                                {
                                    key: "Payment History",
                                    label: (
                                        <span className="flex items-center">
                                            <GiMoneyStack className="mr-1" />
                                            Transactions
                                        </span>
                                    ),
                                    children: (
                                        <Transactions orderItem={orderItem} transactions={orderItem?.transactions} />
                                    ),
                                },
                            ]}
                        />

            }

        </section>
    );
};

export default OrderDetails;
