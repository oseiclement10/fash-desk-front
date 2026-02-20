import { forwardRef } from "react"
import { OrderItemDescription } from "../../details/Info";
import type { Order } from "@/@types/orders";
import { appConfig } from "@/config/meta";

const OrderSummaryContent = forwardRef<HTMLDivElement, { order: Order }>((props, ref) => {

    const { order } = props;

    const isSingleOrder = order?.order_items?.length == 1;
    const orderItems = order?.order_items;



    return (
        <section ref={ref} className="p-4">
            <div className="bg-gradient-to-r from-primary to-foreground/80 px-6 py-4 ">
                <h2 className="text-xl font-bold text-white text-center">
                    {appConfig.name.toUpperCase()} - ORDER SUMMARY
                </h2>
            </div>

            <section className="space-y-12 mt-6">
                {orderItems?.map((elem, index) => (
                    <div key={elem.id} className="">
                        {!isSingleOrder && (
                            <h4 className="flex items-center justify-center w-10 h-10 mb-2 ml-auto rounded-full bg-slate-200">
                                {index + 1}
                            </h4>
                        )}
                        <OrderItemDescription
                            orderItem={elem}
                            orderID={order?.id}
                        />
                        {!isSingleOrder && <div className="break-before-page" />}
                    </div>

                ))}
            </section>

        </section>
    )
});

export default OrderSummaryContent