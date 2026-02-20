import type { DashboardResponse } from "@/@types/entities";
import { Bar } from "react-chartjs-2";

export type StatisticsProps = {
    months: string[];
    inflows: number[];
    outflows: number[];
};

const BarChart = ({ performance }: Pick<DashboardResponse["finance"], "performance">) => {

    if (!performance) return null

    const { months, inflows, outflows } = performance;

    const labels = months;
    const data = {
        labels: labels,
        datasets: [
            {
                label: "Inflows",
                data: inflows,
                borderColor: "#f3f4f2",
                backgroundColor: "#C79E41",
            },
            {
                label: "Outflows ",
                data: outflows,
                borderColor: "#000",
                backgroundColor: "#000",
            },
        ],
    };

    const config = {
        type: "bar",
        data: data,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: "Revenue and Expenses",
                },
            },
        },
    };

    return (
        <div className="bg-white rounded-2xl p-3 md:p-5 shadow-sm md:shadow-md">
            <Bar data={data} options={config.options} />
        </div>
    );
};

export default BarChart;
