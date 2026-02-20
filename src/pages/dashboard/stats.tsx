import type { DashboardResponse } from "@/@types/entities"
import { permissions } from "@/config/permissions";
import { StatCard } from "@/components/cards/stat-card"
import { hasPermission } from "@/utils/auth";
import { formatMoney } from "@/utils/format-money";
import {
    TrendingUp,
    TrendingDown,
    CalendarClock,
    CalendarRange,
    ShoppingBag,
    Users,
    BadgeCent,
} from "lucide-react"

const Statistics = ({ stats, isLoading }: { stats: DashboardResponse, isLoading: boolean }) => {

    const { finance, orders, customers } = stats;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">

            {hasPermission(permissions.viewDashboardRevenueStatistics) ? (
                <>
                    <StatCard
                        title="Total Revenue"
                        value={formatMoney(finance?.revenue)}
                        isLoading={isLoading}
                        isAlt
                        icon={<BadgeCent className="w-6 h-6 text-white" />}
                    />

                    {/* Total Inflows */}
                    <StatCard
                        title="Total Inflows"
                        value={formatMoney(finance?.total_inflow)}
                        isLoading={isLoading}
                        icon={<TrendingUp className="w-6 h-6 text-emerald-600" />}
                    />

                    {/* Total Outflows */}
                    <StatCard
                        title="Total Outflows"
                        value={formatMoney(finance?.total_outflow)}
                        isLoading={isLoading}
                        icon={<TrendingDown className="w-6 h-6 text-red-600" />}
                    />
                </>
            ) : null}

            {hasPermission(permissions.viewDashboardOrdersStatistics) ? (
                <>
                    <StatCard
                        title="Orders Due This Week"
                        value={orders?.due_this_week}
                        isLoading={isLoading}
                        icon={<CalendarClock className="w-6 h-6 text-white" />}
                        trend="+2.5% from last month"
                        isAlt
                    />

                    {/* Orders Due Next Week */}
                    <StatCard
                        title="Orders Due Next Week"
                        value={orders?.due_next_week}
                        isLoading={isLoading}
                        icon={<CalendarRange className="w-6 h-6 text-blue-600" />}
                    />

                    {/* Orders Placed This Month */}
                    <StatCard
                        title="Orders Placed This Month"
                        value={orders?.placed_this_month}
                        isLoading={isLoading}
                        icon={<ShoppingBag className="w-6 h-6 text-orange-600" />}
                    />
                </>
            ) : null}


            {hasPermission(permissions.viewDashboardCustomerStatistics) ? (
                <StatCard
                    title="Total Customers"
                    value={customers?.total}
                    isLoading={isLoading}
                    icon={<Users className="w-6 h-6 text-white" />}
                    isAlt
                />
            ) : null}



        </div>
    )
}

export default Statistics
