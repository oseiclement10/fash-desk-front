import React from "react";
import { Card, Descriptions, Tag, Space, Divider, Button } from "antd";
import {
    HiArrowTrendingUp,
    HiArrowTrendingDown,
    HiPrinter,
    HiUser,
    HiShoppingBag,
    HiReceiptRefund
} from "react-icons/hi2";
import { MdAccountBalanceWallet, MdReceipt } from "react-icons/md";
import { Link } from "react-router-dom";

import type { Transaction, Inflow, Outflow } from "@/@types/transactions";
import { formatMoney } from "@/utils/format-money";
import { appRoutes } from "@/routes";
import { formatDate } from "@/utils/date-helper";
import { printTransactionDetails } from "./print";
import { useMediaQuery } from "react-responsive";
import { appConfig } from "@/config/meta";

export interface TransactionViewModalProps {
    transaction: Transaction;
    onClose?: () => void;
}

const TransactionViewModal: React.FC<TransactionViewModalProps> = ({
    transaction,
    onClose
}) => {
    const isInflow = transaction.type === "inflow";
    const transactionData = transaction.transaction as Inflow | Outflow;

    console.log("transactionData", transactionData);

    const isLargeScreen = useMediaQuery({ query: "(min-width: 1023px)" });

    const layout = isLargeScreen ? "horizontal" : "vertical";

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header Actions */}
            <div className="flex items-center justify-between mb-6 print:hidden">
                <div className="flex items-center gap-3">
                    <MdReceipt className="text-2xl text-blue-600" />
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Transaction Details</h1>
                        <p className="text-gray-500 text-sm">
                            #{transaction.id} • {formatDate(transaction.created_at)}
                        </p>
                    </div>
                </div>

                <Space>
                    <Button
                        type="primary"
                        icon={<HiPrinter className="text-lg" />}
                        onClick={() => printTransactionDetails(transaction)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                    >
                        Print
                    </Button>
                    {onClose && (
                        <Button onClick={onClose}>
                            Close
                        </Button>
                    )}
                </Space>
            </div>

            {/* Transaction Receipt */}
            <div className="bg-white border rounded-xl shadow-sm print:shadow-none print:border-0">
                {/* Receipt Header */}
                <div className="bg-linear-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl print:bg-black print:text-black">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">Transaction Receipt</h1>
                            <p className="text-blue-100 print:text-gray-300">
                                {appConfig.name} Transaction
                            </p>
                        </div>
                        <Tag
                            color={isInflow ? "green" : "red"}
                            className="border-0 text-base px-4 py-1 font-semibold"
                        >
                            {isInflow ? (
                                <span className="flex items-center gap-2">
                                    <HiArrowTrendingUp /> INFLOW
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <HiArrowTrendingDown /> OUTFLOW
                                </span>
                            )}
                        </Tag>
                    </div>
                </div>

                <div className="md:p-6 p-3">
                    <h2 className="font-medium mb-2 py-1">Transaction Details</h2>
                    {/* Basic Transaction Info */}
                    <Descriptions
                        title=""
                        bordered
                        column={1}
                        className="mb-6"
                        labelStyle={{
                            fontWeight: 600,
                            backgroundColor: '#f8f9fa',
                            width: '200px'
                        }}
                        layout={layout}
                        size="middle"
                    >
                        <Descriptions.Item label="Transaction ID">
                            #{transaction.id}
                        </Descriptions.Item>
                        <Descriptions.Item label="Description">
                            {transaction.description}
                        </Descriptions.Item>
                        <Descriptions.Item label="Amount">
                            <span className={`text-lg font-bold ${isInflow ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {formatMoney(transaction.amount)}
                            </span>
                        </Descriptions.Item>
                        <Descriptions.Item label="Transaction Date">
                            {formatDate(transaction.created_at, true)}
                        </Descriptions.Item>
                        <Descriptions.Item label="Last Updated">
                            {formatDate(transaction.updated_at, true)}
                        </Descriptions.Item>
                    </Descriptions>

                    <Divider />

                    {/* Transaction Specific Details */}
                    {isInflow ? (
                        <InflowDetails layout={layout} data={transactionData as Inflow} />
                    ) : (
                        <OutflowDetails layout={layout} data={transactionData as Outflow} />
                    )}

                    <Divider />

                    {/* Staff Information */}
                    <Descriptions
                        title="Staff Information"
                        bordered
                        column={1}
                        className="mb-6"
                        labelStyle={{
                            fontWeight: 600,
                            backgroundColor: '#f8f9fa'
                        }}
                        size="middle"
                        layout={layout}

                    >
                        <Descriptions.Item label="Recorded By">
                            <div className="flex flex-col md:flex-row md:items-center gap-2">
                                <HiUser className="text-gray-500" />
                                <span>{transaction.creator?.name || "—"}</span>
                                <Tag color="blue" className="text-xs">
                                    {transaction.creator?.email}
                                </Tag>
                            </div>
                        </Descriptions.Item>
                        <Descriptions.Item label="Last Updated By">
                            <div className="flex items-center gap-2">
                                <HiUser className="text-gray-500" />
                                <span>{transaction.updater?.name || "—"}</span>
                            </div>
                        </Descriptions.Item>
                    </Descriptions>

                    {/* Summary Card */}
                    <Card
                        className={`border-l-4 ${isInflow
                            ? 'border-l-green-500 bg-green-50'
                            : 'border-l-red-500 bg-red-50'
                            }`}
                        size="small"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <MdAccountBalanceWallet className={`text-xl ${isInflow ? 'text-green-600' : 'text-red-600'
                                    }`} />
                                <div>
                                    <h3 className="font-semibold text-gray-700">Net Amount</h3>
                                    <p className="text-sm text-gray-600">
                                        {isInflow ? 'Money Received' : 'Expense Incurred'}
                                    </p>
                                </div>
                            </div>
                            <span className={`text-xl font-bold ${isInflow ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {isInflow ? '+' : '-'}{formatMoney(transaction.amount)}
                            </span>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Print Footer */}
            <div className="hidden print:block mt-8 text-center text-gray-500 text-sm">
                <p>This is an automated receipt generated on {formatDate(new Date().toISOString(), true)}</p>
                <p>{appConfig.name} • {appConfig.website}</p>
            </div>
        </div>
    );
};


const InflowDetails: React.FC<{ data: Inflow, layout: "vertical" | "horizontal" }> = ({ data, layout }) => (
    <Descriptions
        title={
            <span className="flex items-center gap-2 text-green-600">
                <HiArrowTrendingUp /> Inflow Details
            </span>
        }
        bordered
        column={1}
        className="mb-6"
        labelStyle={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}
        size="middle"
        layout={layout}
    >
        <Descriptions.Item label="Customer">
            <div className="space-y-2">
                <div className="font-semibold">
                    {data.customer?.full_name || "—"}
                </div>
                {data.customer?.email && (
                    <div className="text-sm text-gray-600">
                        Email: {data.customer.email}
                    </div>
                )}
                {data.customer?.phone_full && (
                    <div className="text-sm text-gray-600">
                        Phone: {data.customer.phone_full}
                    </div>
                )}
                {data.customer?.address && (
                    <div className="text-sm text-gray-600">
                        Address: {data.customer.address}
                    </div>
                )}
            </div>
        </Descriptions.Item>

        <Descriptions.Item label="Order Item">
            {data.order_item ? (
                <div className="space-y-2">
                    <Link
                        to={appRoutes.orderDetails.path.replace(":id", `${data.order_item.id}`)}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <HiShoppingBag /> Order Item #{data.order_item.id}
                    </Link>
                    <div className="text-sm space-y-1 bg-gray-50 p-3 rounded">
                        <div><strong>Description:</strong> {data.order_item.description}</div>
                        <div><strong>Quantity:</strong> {data.order_item.quantity}</div>
                        <div><strong>Unit Price:</strong> {formatMoney(data.order_item.price)}</div>
                        <div><strong>Subtotal:</strong> {formatMoney(data.order_item.sub_total)}</div>
                        <div>
                            <strong>Status:</strong>
                            <Tag
                                color={
                                    data.order_item.status === 'complete' ? 'green' :
                                        data.order_item.status === 'pending' ? 'orange' : 'blue'
                                }
                                className="ml-2 capitalize"
                            >
                                {data.order_item.status}
                            </Tag>
                        </div>
                    </div>
                </div>
            ) : (
                <span>—</span>
            )}
        </Descriptions.Item>
    </Descriptions>
);


const OutflowDetails: React.FC<{ data: Outflow, layout: "vertical" | "horizontal" }> = ({ data, layout }) => (
    <Descriptions
        title={
            <span className="flex items-center gap-2 text-red-600">
                <HiArrowTrendingDown /> Outflow Details
            </span>
        }
        bordered
        column={1}
        className="mb-6"
        labelStyle={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}
        size="middle"
        layout={layout}
    >
        <Descriptions.Item label="Expense Type">
            <Tag color="orange" className="capitalize text-sm">
                {data.expense_type?.replace(/_/g, ' ') || "—"}
            </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Related Order Item">
            {data.order_item ? (
                <div className="space-y-2">
                    <Link
                        to={appRoutes.orderDetails.path.replace(":id", `${data.order_item.id}`)}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <HiReceiptRefund /> Order Item #{data.order_item.id}
                    </Link>
                    <div className="text-sm space-y-1 bg-gray-50 p-3 rounded">
                        <div><strong>Description:</strong> {data.order_item.description}</div>
                        <div><strong>Quantity:</strong> {data.order_item.quantity}</div>
                        <div><strong>Cost:</strong> {formatMoney(data.order_item.cost)}</div>
                        <div><strong>Price:</strong> {formatMoney(data.order_item.price)}</div>
                        <div><strong>Subtotal:</strong> {formatMoney(data.order_item.sub_total)}</div>
                        <div>
                            <strong>Status:</strong>
                            <Tag
                                color={
                                    data.order_item.status === 'complete' ? 'green' :
                                        data.order_item.status === 'pending' ? 'orange' : 'blue'
                                }
                                className="ml-2 capitalize"
                            >
                                {data.order_item.status}
                            </Tag>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-gray-500 italic">
                    No linked order item
                </div>
            )}
        </Descriptions.Item>
    </Descriptions>
);

export default TransactionViewModal;