import { forwardRef, useMemo } from "react";
import type { Order } from "@/@types/orders";
import { formatDate } from "@/utils/date-helper";
import { formatMoney } from "@/utils/format-money";
import { User, Package, BadgeCent, CalendarDays } from "lucide-react";
import { appConfig } from "@/config/meta";

const OrderOverview = forwardRef<HTMLDivElement, { order: Order }>(({ order }, ref) => {
    const orderItems = order?.order_items ?? [];
    const firstItem = orderItems[0];

    const {
        totalAmount,
        totalPaid,
        balance,
        dueDates,
    } = useMemo(() => {
        const totalAmount = orderItems.reduce(
            (sum, item) => sum + Number(item.sub_total || 0),
            0
        );

        const totalPaid = orderItems.reduce(
            (sum, item) => sum + Number(item.amount_paid || 0),
            0
        );

        const dueDates = [
            ...new Set(
                orderItems
                    .map((item) => item.due_date)
                    .filter(Boolean)
                    .map((date) => formatDate(date))
            ),
        ].join(", ");

        return {
            totalAmount,
            totalPaid,
            balance: totalAmount - totalPaid,
            dueDates,
        };
    }, [orderItems]);

    return (
        <div ref={ref} className="p-6 bg-white order-overview-print">
            {/* Print Header */}
            <div className="hidden print:block border-b-2 border-primary pb-4 mb-6">
                <h1 className="text-2xl font-bold text-center text-primary uppercase tracking-wider">
                    {appConfig.name} - Order Overview
                </h1>
            </div>

            {/* Header Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 print:grid-cols-2 print:gap-4 print:mb-6">
                {/* Customer */}
                <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600 print:bg-transparent print:p-0">
                        <User className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-tighter">Customer</p>
                        <p className="font-semibold text-gray-800">
                            {firstItem?.customer?.full_name ?? "—"}
                        </p>
                        <p className="text-sm text-gray-600">
                            {firstItem?.customer?.phone_full ?? ""}
                        </p>
                    </div>
                </div>

                {/* Dates */}
                <div className="flex items-start space-x-3">
                    <div className="p-2 bg-purple-50 rounded-lg text-purple-600 print:bg-transparent print:p-0">
                        <CalendarDays className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-tighter">Dates</p>
                        <div className="space-y-0.5">
                            <p className="text-sm">
                                <span className="font-medium">Order:</span>{" "}
                                {firstItem?.created_at ? formatDate(firstItem.created_at) : "—"}
                            </p>
                            <p className="text-sm">
                                <span className="font-medium">Due:</span>{" "}
                                {dueDates || "—"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Order Ref */}
                <div className="flex items-start space-x-3">
                    <div className="p-2 bg-amber-50 rounded-lg text-amber-600 print:bg-transparent print:p-0">
                        <Package className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-tighter">Order Ref</p>
                        <p className="font-bold text-lg text-gray-900 leading-tight">
                            #{order?.id}
                        </p>
                        <p className="text-xs text-gray-500 font-medium">
                            {orderItems.length} Items
                        </p>
                    </div>
                </div>
            </div>

            {/* Items Table */}
            <div className="mb-8 print:mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 print:text-base print:mb-2">
                    <Package className="w-5 h-5" /> Order Items
                </h3>

                <div className="border rounded-xl overflow-hidden print:border-gray-300 print:rounded-none">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 print:bg-transparent border-b">
                            <tr>
                                <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase">Style/Fabric</th>
                                <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase">Description</th>
                                <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase text-center">Qty</th>
                                <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase text-right">Price</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 print:divide-gray-300">
                            {orderItems.map((item) => (
                                <tr key={item.id} className="align-top">
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            {item.style_img && (
                                                <img
                                                    src={item.style_img}
                                                    alt="Style"
                                                    className="w-16 h-16 object-cover rounded border"
                                                />
                                            )}
                                            {item.fabric_img && (
                                                <img
                                                    src={item.fabric_img}
                                                    alt="Fabric"
                                                    className="w-16 h-16 object-cover rounded border"
                                                />
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-4 py-3">
                                        <p className="text-sm font-medium text-gray-800 capitalize">
                                            {item.description || "No description"}
                                        </p>
                                        <p className="text-[10px] text-gray-400 uppercase mt-1">
                                            Item #{item.id}
                                        </p>
                                    </td>

                                    <td className="px-4 py-3 text-center font-semibold">
                                        {item.quantity}
                                    </td>

                                    <td className="px-4 py-3 text-right font-bold">
                                        {formatMoney(item.sub_total || "0")}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Financial Summary */}
            <div className="flex justify-end pt-4 border-t-2 border-dashed border-gray-100 print:border-gray-300">
                <div className="w-full max-w-xs space-y-3">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <BadgeCent className="w-5 h-5" /> Financial Summary
                    </h3>

                    <div className="bg-gray-50 rounded-xl p-4 space-y-2 print:bg-transparent print:p-0">
                        <div className="flex justify-between text-sm font-medium">
                            <span>Total Amount:</span>
                            <span>{formatMoney(totalAmount)}</span>
                        </div>

                        <div className="flex justify-between text-sm font-medium text-emerald-600">
                            <span>Amount Paid:</span>
                            <span>{formatMoney(totalPaid)}</span>
                        </div>

                        <div className="pt-2 mt-2 border-t flex justify-between items-center">
                            <span className="font-bold">Balance Owed:</span>
                            <span
                                className={`text-lg font-black ${balance > 0 ? "text-red-600" : "text-emerald-600"
                                    }`}
                            >
                                {formatMoney(balance)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Print Footer */}
            <div className="hidden print:block mt-12 pt-8 border-t border-gray-200">
                <div className="flex justify-between text-xs text-gray-400">
                    <p>Printed on: {new Date().toLocaleString()}</p>
                    <div className="text-right">
                        <p className="font-bold text-gray-600">
                            {appConfig.name} Management System
                        </p>
                        <p>Thank you for your patronage</p>
                    </div>
                </div>
            </div>
        </div>
    );
});

OrderOverview.displayName = "OrderOverview";
export default OrderOverview;
