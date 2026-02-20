import type { DashboardResponse } from "@/@types/entities";
import SkeletonLoad from "@/components/crud/skeleton-load";
import { queryKeys } from "@/constants/query-keys";
import useQueryFetch from "@/hooks/use-query-fetch"
import { CrudService } from "@/services/CrudService";
import Statistics from "./stats";
import { NotFoundCard } from "@/components/cards/not-found";
import BarChart from "./bar-chart";
import OrdersDue from "./due-orders";
import { hasPermission } from "@/utils/auth";
import { permissions } from "@/config/permissions";
import WelcomeBanner from "./welcome-banner";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

import QuickLinks from "./quick-links";


const api = new CrudService("dashboard");

const Dashboard = () => {

    const { data, isLoading } = useQueryFetch({
        title: "Dashboard",
        queryFn: () => api.getRaw<DashboardResponse>({}),
        queryKeys: [queryKeys.dashboard],
    });


    return (
        <section>
            <WelcomeBanner />
            {isLoading
                ? <SkeletonLoad />
                :
                !data ?
                    <NotFoundCard title="Something Went Wrong" message="could not load dashboard statistics" />
                    :
                    <section className=" !space-y-6 md:!space-y-9">
                        <Statistics stats={data} isLoading={isLoading} />
                        <QuickLinks />
                        {hasPermission(permissions.viewDashboardRevenueGraph) ? (
                            <BarChart performance={data?.finance?.performance as DashboardResponse["finance"]["performance"]} />
                        ) : null}
                        {hasPermission(permissions.viewDashboardOrdersStatistics) ? (
                            <OrdersDue orders={data?.orders?.orders_due || []} />
                        ) : null}
                    </section>
            }
        </section>
    )
}

export default Dashboard