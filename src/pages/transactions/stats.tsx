import React from "react";
import { HiArrowTrendingUp, HiArrowTrendingDown } from "react-icons/hi2";
import { MdAccountBalanceWallet } from "react-icons/md";
import { formatMoney } from "@/utils/format-money";
import type { OverviewResponse } from ".";

export type TransactionStatsProps = Pick<OverviewResponse, "statistics"> & {
    isLoading?: boolean;
}

const TransactionStats: React.FC<TransactionStatsProps> = ({ statistics, isLoading }) => {
    const statCards = [
        {
            title: "Total Inflows",
            icon: <HiArrowTrendingUp className="text-emerald-500 text-2xl" />,
            value: formatMoney(statistics?.total_inflows),
            bg: "bg-gradient-to-br from-emerald-50 to-green-50",
            border: "border-emerald-100",
            textColor: "text-emerald-700",
            trend: "positive",
            description: "Money coming in"
        },
        {
            title: "Total Outflows",
            icon: <HiArrowTrendingDown className="text-rose-500 text-2xl" />,
            value: formatMoney(statistics?.total_outflows),
            bg: "bg-gradient-to-br from-rose-50 to-red-50",
            border: "border-rose-100",
            textColor: "text-rose-700",
            trend: "negative",
            description: "Money going out"
        },
        {
            title: "Net Balance",
            icon: <MdAccountBalanceWallet className="text-blue-500 text-2xl" />,
            value: formatMoney(statistics?.net_balance),
            bg: "bg-gradient-to-br from-blue-50 to-indigo-50",
            border: "border-gray-200",
            textColor:
                Number(statistics?.net_balance) > 0
                    ? "text-emerald-700"
                    : Number(statistics?.net_balance) < 0
                        ? "text-rose-700"
                        : "text-slate-700",
            trend: Number(statistics?.net_balance) > 0 ? "positive" :
                Number(statistics?.net_balance) < 0 ? "negative" : "neutral",
            description: Number(statistics?.net_balance) > 0 ? "Profit" :
                Number(statistics?.net_balance) < 0 ? "Loss" : "Break even"
        },
    ];

    // Skeleton loader component
    const SkeletonLoader = () => (
        <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-6 bg-gray-300 rounded w-3/4"></div>
        </div>
    );

    return (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 mb-8">
            {statCards.map((card, index) => (
                <div
                    key={card.title}
                    className={`
                        bg-white ${card.border}
                        border-2 rounded-2xl p-4 
                        flex flex-col justify-between

                        transition-all duration-300 
                        transform hover:-translate-y-1
                        backdrop-blur-sm
                        relative overflow-hidden
                        group
                    `}
                    style={{
                        animationDelay: `${index * 100}ms`
                    }}
                >
                    {/* Animated background element */}
                    <div className="absolute top-0 right-0 w-20 h-20 -mr-6 -mt-6 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                        {card.trend === "positive" && (
                            <HiArrowTrendingUp className="w-full h-full text-emerald-500" />
                        )}
                        {card.trend === "negative" && (
                            <HiArrowTrendingDown className="w-full h-full text-rose-500" />
                        )}
                        {card.trend === "neutral" && (
                            <MdAccountBalanceWallet className="w-full h-full text-blue-500" />
                        )}
                    </div>

                    <div className="flex items-start justify-between mb-4 relative z-10">
                        <div className="flex flex-col space-y-2">
                            <span className="text-sm font-medium text-slate-600 tracking-wide">
                                {card.title}
                            </span>
                            <span className={`text-2xl font-bold ${card.textColor} tracking-tight`}>
                                {isLoading ? <SkeletonLoader /> : card.value}
                            </span>
                            <span className="text-xs text-slate-500 font-normal">
                                {card.description}
                            </span>
                        </div>

                        {/* Icon with enhanced styling */}
                        <div className={`
                            p-3 rounded-xl 
                            ${card.trend === "positive" ? "bg-emerald-100" :
                                card.trend === "negative" ? "bg-rose-100" : "bg-blue-100"}
                            shadow-sm group-hover:scale-110 transition-transform duration-300
                        `}>
                            {card.icon}
                        </div>
                    </div>



                </div>
            ))}
        </div>
    );
};

export default TransactionStats;