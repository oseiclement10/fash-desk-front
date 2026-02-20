import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import PrimaryButton from "@/components/buttons/primary";
import type { OrderItem } from "@/@types/orders";
import { Printer, User, Package, Ruler, BadgeCent } from "lucide-react";
import { formatDate } from "@/utils/date-helper";
import { formatMoney } from "@/utils/format-money";
import { appConfig } from "@/config/meta";

const Info = ({ orderItem }: { orderItem: OrderItem }) => {

    const summaryRef = useRef(null);
    const handlePrintSummary = useReactToPrint({
        contentRef: summaryRef,
    });



    return (
        <div className="mx-auto space-y-6">
            <div className="flex justify-end">
                <PrimaryButton
                    label="Print Order Summary"
                    icon={<Printer className="w-4 h-4" />}
                    onClick={() => handlePrintSummary()}
                    className="shadow-md hover:shadow-lg transition-shadow"
                />
            </div>

            <section
                ref={summaryRef}
                className="bg-white rounded-lg print:rounded-none border border-gray-200 shadow-sm overflow-hidden print:shadow-none print:border-0"
            >

                <div className="bg-gradient-to-r from-primary to-foreground/80 px-6 py-4 ">
                    <h2 className="text-xl font-bold text-white text-center">
                        {appConfig.name.toUpperCase()} - ORDER SUMMARY
                    </h2>
                </div>

                <div className="md:p-6 p-2 space-y-6 print:p-4 print:space-y-4">


                    {/* Style & Measurements - Optimized for print */}
                    <OrderItemDescription orderItem={orderItem} orderID={orderItem?.order?.id} />

                    {/* Financial Information - Hidden when printing */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:hidden">
                        <InfoCard
                            icon={<BadgeCent className="w-5 h-5" />}
                            title="Financial Details"
                            items={[
                                {
                                    label: "Cost",
                                    value: orderItem?.cost ? `${formatMoney(orderItem.cost)}` : "N/A"
                                },
                                {
                                    label: "Price",
                                    value: orderItem?.price ? `${formatMoney(orderItem.sub_total)}` : "N/A"
                                },
                                { label: "Amount Paid", value: orderItem?.amount_paid ? `${formatMoney(orderItem.amount_paid)}` : "N/A" },
                            ]}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export const OrderItemDescription = ({ orderItem, orderID }: { orderItem: OrderItem, orderID: number }) => {
    const measurement = JSON.parse(orderItem.measurement);
    const measurementEntries = Object.entries(measurement).filter(
        ([key]) => !["created_at", "updated_at"].includes(key)
    );

    return (
        <div>
            <div className="grid grid-cols-1 mb-6 md:grid-cols-2 gap-4 print:grid-cols-2 print:gap-3 print:mb-4">
                <InfoCard
                    icon={<User className="w-5 h-5" />}
                    title="Customer Information"
                    items={[
                        { label: "Name", value: orderItem?.customer?.full_name },
                        { label: "Phone", value: orderItem?.customer?.phone_full }
                    ]}
                />

                <InfoCard
                    icon={<Package className="w-5 h-5" />}
                    title="Order Information"
                    items={[
                        { label: "Order Date", value: formatDate(orderItem?.created_at) },
                        { label: "Delivery Date", value: formatDate(orderItem?.due_date) },
                        { label: "Fitting Date", value: formatDate(orderItem?.fitting_date) },
                        { label: "Order ID", value: `#${orderID}` },
                        { label: "Item ID", value: `#${orderItem?.id}` },
                        { label: "Quantity", value: orderItem?.quantity }
                    ]}
                />
            </div>

            {/* Style & Fabric Images */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4 print:mb-4">
                <div className="space-y-3 print:space-y-2">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 print:text-base">
                        <Package className="w-5 h-5 print:w-4 print:h-4" />
                        Style Reference
                    </h3>
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 print:p-3 print:border print:rounded">
                        <img
                            src={orderItem?.style_img as string}
                            alt="Order style reference"
                            className="w-full h-auto max-h-96 object-contain rounded print:max-h-64"
                        />
                    </div>

                    {/* Conditionally show fabric image if available */}
                    {orderItem?.fabric_img && (
                        <div>
                            <h4 className="text-base font-medium text-gray-800 mt-4 print:text-sm">
                                Fabric Image
                            </h4>
                            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 print:p-3 print:border print:rounded">
                                <img
                                    src={orderItem.fabric_img as string}
                                    alt="Fabric reference"
                                    className="w-full h-auto max-h-80 object-contain rounded print:max-h-56"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Measurements */}
                <div className="space-y-3 print:space-y-2">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 print:text-base">
                        <Ruler className="w-5 h-5 print:w-4 print:h-4" />
                        Measurements
                        <span className="text-sm font-normal text-gray-600">(inches)</span>
                    </h3>
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 print:p-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 print:gap-2">
                            {measurementEntries.map(([key, value]) => (
                                <div
                                    key={key}
                                    className="flex justify-between items-center py-2 px-3 bg-white rounded border border-gray-100 print:py-1 print:px-2 print:text-sm"
                                >
                                    <span className="text-sm font-medium text-gray-700 capitalize print:text-xs">
                                        {key.replace(/_/g, " ")}
                                    </span>
                                    <span className="text-sm font-semibold text-blue-600 print:text-xs">
                                        {value as string}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Description */}
            <div className="space-y-3 mt-4 md:mt-0 print:space-y-2 print:mb-4">
                <h3 className="text-lg font-semibold text-gray-800 print:text-base">
                    Order Description
                </h3>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 print:p-3">
                    <p className="text-gray-700 leading-relaxed capitalize print:text-sm">
                        {orderItem?.description || "No description provided"}
                    </p>
                </div>
            </div>
        </div>
    );
};




// export const OrderItemDescription = ({ orderItem, orderID }: { orderItem: OrderItem, orderID: number }) => {
//     const measurement = JSON.parse(orderItem.measurement);
//     const measurementEntries = Object.entries(measurement).filter(
//         ([key]) => !["created_at", "updated_at"].includes(key)
//     );
//     return (
//         <div>
//             <div className="grid grid-cols-1 mb-6 md:grid-cols-2 gap-4 print:grid-cols-2 print:gap-3 print:mb-4">
//                 <InfoCard
//                     icon={<User className="w-5 h-5" />}
//                     title="Customer Information"
//                     items={[
//                         { label: "Name", value: orderItem?.customer?.full_name },
//                         { label: "Phone", value: orderItem?.customer?.phone_full }
//                     ]}
//                 />

//                 <InfoCard
//                     icon={<Package className="w-5 h-5" />}
//                     title="Order Information"
//                     items={[
//                         { label: "Order Date", value: formatDate(orderItem?.created_at) },
//                         { label: "Delivery Date", value: formatDate(orderItem?.due_date) },
//                         { label: "Fitting Date", value: formatDate(orderItem?.fitting_date) },
//                         { label: "Order ID", value: `#${orderID}` },
//                         { label: "Item ID", value: `#${orderItem?.id}` },
//                         { label: "Quantity", value: orderItem?.quantity }
//                     ]}
//                 />
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4 print:mb-4">
//                 <div className="space-y-3 print:space-y-2">
//                     <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 print:text-base">
//                         <Package className="w-5 h-5 print:w-4 print:h-4" />
//                         Style Reference
//                     </h3>
//                     <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 print:p-3 print:border print:rounded">
//                         <img
//                             src={orderItem?.style_img as string}
//                             alt="Order style reference"
//                             className="w-full h-auto max-h-96 object-contain rounded print:max-h-64"
//                         />
//                     </div>
//                 </div>


//                 <div className="space-y-3 print:space-y-2">
//                     <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 print:text-base">
//                         <Ruler className="w-5 h-5 print:w-4 print:h-4" />
//                         Measurements
//                         <span className="text-sm font-normal text-gray-600">
//                             (inches)
//                         </span>
//                     </h3>
//                     <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 print:p-3">
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 print:gap-2">
//                             {measurementEntries.map(([key, value]) => (
//                                 <div
//                                     key={key}
//                                     className="flex justify-between items-center py-2 px-3 bg-white rounded border border-gray-100 print:py-1 print:px-2 print:text-sm"
//                                 >
//                                     <span className="text-sm font-medium text-gray-700 capitalize print:text-xs">
//                                         {key.replace(/_/g, " ")}
//                                     </span>
//                                     <span className="text-sm font-semibold text-blue-600 print:text-xs">
//                                         {value as string}
//                                     </span>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div className="space-y-3 print:space-y-2 print:mb-4">
//                 <h3 className="text-lg font-semibold text-gray-800 print:text-base">Order Description</h3>
//                 <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 print:p-3">
//                     <p className="text-gray-700 leading-relaxed capitalize print:text-sm">
//                         {orderItem?.description || "No description provided"}
//                     </p>
//                 </div>
//             </div>
//         </div>
//     )
// }


// Reusable Info Card Component
const InfoCard = ({
    icon,
    title,
    items
}: {
    icon: React.ReactNode;
    title: string;
    items: { label: string; value: string | number }[];
}) => (
    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-xs print:shadow-none print:p-3 print:border print:rounded">
        <div className="flex items-center gap-2 mb-3 print:mb-2">
            {icon}
            <h3 className="font-semibold text-gray-800 print:text-sm">{title}</h3>
        </div>
        <div className="space-y-2 print:space-y-1">
            {items.map((item, index) => (
                <div key={index} className="flex justify-between items-center print:text-sm">
                    <span className="text-sm text-gray-600 print:text-xs">{item.label}:</span>
                    <span className="text-sm font-medium text-gray-800 print:text-xs">{item.value}</span>
                </div>
            ))}
        </div>
    </div>
);

export default Info;