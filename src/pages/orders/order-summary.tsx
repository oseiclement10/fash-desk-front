import PrimaryButton from "@/components/buttons/primary";
import { appRoutes } from "@/routes";
import { Button, Tabs } from "antd"
import { useRef } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { BsCash } from "react-icons/bs";
import { FaCheckCircle } from "react-icons/fa"
import { useNavigate, useParams } from "react-router-dom"
import { useReactToPrint } from "react-to-print";
import OrderSummaryContent from "./new-order/components/summary-content";
import PrintOrderButton from "./utils";

import { CrudService } from "@/services/CrudService";
import type { Order } from "@/@types/orders";
import { useGetDetails } from "@/hooks/use-get-details";
import { queryKeys } from "@/constants/query-keys";
import { SpinLoad } from "@/components/crud/loading";
import { NotFoundCard } from "@/components/cards/not-found";
import Transactions from "./details/Transactions";
import OrderOverview from "./details/OrderOverview";
import { MdOutlineSummarize } from "react-icons/md";
import { appConfig } from "@/config/meta";

const api = new CrudService<Order>("orders");

const OrderSummary = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const { isLoading, data } = useGetDetails({
        api,
        id: Number(id),
        title: "Order",
        queryKey: [queryKeys.order, id ?? ""],
        enabled: !!id,
        extraPath: "summary"
    });

    console.log("order", data);


    const summaryRef = useRef(null);
    const overviewRef = useRef(null);

    const handlePrintOrder = useReactToPrint({
        contentRef: summaryRef,
        documentTitle: `${appConfig.name} Order Summary`,
    });

    const handlePrintOverview = useReactToPrint({
        contentRef: overviewRef,
        documentTitle: `${appConfig.name} Order Overview - #${data?.id}`,
    });




    return (
        <section className="bg-white p-4 md:p-8 border rounded-xl overflow-hidden">
            {isLoading ?
                <SpinLoad message="loading order summary" />
                : !data ?
                    <NotFoundCard title="Order Not Found" message="The order you are looking for was not found" onAction={() => navigate(appRoutes.orders.path)} /> :
                    <section>

                        <div className="flex flex-col items-center justify-center mb-6 text-center">
                            <h4 className="mb-1 text-3xl font-semibold">Order Placed </h4>
                            <FaCheckCircle className="mb-2 text-3xl text-emerald-600" />

                            <h3 className="text-sm text-gray-600">
                                Order has been placed successfully
                            </h3>
                        </div>

                        <div className="flex items-center justify-center mb-6 space-x-3">
                            <Button type="primary" size="large" onClick={() => navigate(appRoutes.orders.path)} >
                                <span className="py-1">View Orders</span>
                            </Button>
                            <PrimaryButton label="Place New Order" labelSm="New Order" onClick={() => navigate(appRoutes.newOrder.path)} />
                        </div>

                        <Tabs
                            centered
                            items={[
                                {
                                    key: "overview",
                                    label: (
                                        <span className="flex items-center text-blue-600 font-bold">
                                            <MdOutlineSummarize className="mr-1" />
                                            Overview
                                        </span>
                                    ),
                                    children: (
                                        <div className="space-y-4">
                                            <div className="flex items-end justify-end">
                                                <PrintOrderButton onClick={() => handlePrintOverview()} />
                                            </div>
                                            <OrderOverview ref={overviewRef} order={data} />
                                        </div>
                                    ),
                                },
                                {
                                    key: "description",
                                    label: (
                                        <span className="flex items-center">
                                            <AiOutlineInfoCircle className="mr-1" /> Order Item
                                            Details
                                        </span>
                                    ),
                                    children: (
                                        <div className="">
                                            <div className="flex items-end justify-end mb-4">
                                                <PrintOrderButton onClick={() => handlePrintOrder()} />
                                            </div>
                                            <OrderSummaryContent ref={summaryRef} order={data} />
                                        </div>
                                    ),
                                },
                                {
                                    key: "invoice",
                                    label: (
                                        <span className="flex items-center">
                                            <BsCash className="mr-1" />
                                            Transactions
                                        </span>
                                    ),
                                    children: (
                                        <div className="">
                                            <Transactions transactions={data.transactions || []} />
                                        </div>
                                    ),
                                },
                            ]}
                        />

                    </section>
            }


        </section >
    )
}

export default OrderSummary