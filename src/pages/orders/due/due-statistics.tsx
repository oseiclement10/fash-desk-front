import useQueryFetch from "@/hooks/use-query-fetch";
import { queryKeys } from "@/constants/query-keys";
import { Alert, Spin } from "antd";
import { FaUserTie, FaExclamationTriangle, FaClock, FaCalendarTimes } from "react-icons/fa";
import { api } from "..";
import type { RequestError } from "@/@types/error";

type DueStatisticsResponse = {
    overdue_count: number;
    due_soon_count: number;
    total_due: number;
}

const DueStatistics = () => {
    const {
        data: stats,
        isLoading,
    } = useQueryFetch<DueStatisticsResponse, RequestError>({
        queryFn: () => api.getRaw<DueStatisticsResponse>({}, "due-statistics"),
        title: "Due Statistics",
        queryKeys: [queryKeys.ordersDue, "statistics"],
    });

    if (isLoading) return <div className="flex justify-center p-8"><Spin tip="Loading statistics..." /></div>;

    const hasUrgency = (stats?.due_soon_count || 0) > 0 || (stats?.overdue_count || 0) > 0;

    return (
        <div className="!space-y-6">
            {hasUrgency && (
                <Alert
                    message="Urgent Attention Required"
                    description={`You have ${stats?.overdue_count} overdue orders and ${stats?.due_soon_count} orders due within 10 days. Please prioritize these orders.`}
                    type="warning"
                    showIcon
                    icon={<FaExclamationTriangle />}
                    className="border-2 border-amber-200 bg-amber-50"
                />
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-red-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Overdue Orders</p>
                            <p className="text-2xl font-bold text-red-600">{stats?.overdue_count ?? 0}</p>
                        </div>
                        <FaCalendarTimes className="text-red-500 text-xl" />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-amber-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Due Soon</p>
                            <p className="text-2xl font-bold text-amber-600">{stats?.due_soon_count ?? 0}</p>
                        </div>
                        <FaClock className="text-amber-500 text-xl" />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Due </p>
                            <p className="text-2xl font-bold text-blue-600">{stats?.total_due ?? 0}</p>
                        </div>
                        <FaUserTie className="text-blue-500 text-xl" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DueStatistics;
