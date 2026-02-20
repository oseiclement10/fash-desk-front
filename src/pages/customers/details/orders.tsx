import type { OrderItem } from "@/@types/orders"
import { Table } from "antd";
import { getOrderColumns } from "../../orders";
import TableHeader from "@/components/crud/table-header";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { appRoutes } from "@/routes";
import { orderOptions } from "../../orders/utils";
import { hasPermission } from "@/utils/auth";

type OrderProps = {
    orders: OrderItem[];
}

const Orders = ({ orders }: OrderProps) => {

    const [searchVal, setSearchVal] = useState("");

    const navigate = useNavigate();

    const columns = getOrderColumns({
        viewOnly: true,
        onClick(_1, _2) {
            navigate(appRoutes.orderDetails.path?.replace(":id", _2.id?.toString()));
        },
        actions: orderOptions?.filter(elem => hasPermission(elem.permission))
    });

    console.log("orders", orders);

    const filteredOrders = useMemo(() => {
        return orders.filter((order) =>
            order.id.toString().toLowerCase().includes(searchVal.toLowerCase()) ||
            order.description.toLowerCase().includes(searchVal.toLowerCase()) ||
            order.order.id.toString().toLowerCase().includes(searchVal.toLowerCase())
        );
    }, [searchVal]);

    return (
        <div className="bg-white pb-8 border rounded-xl overflow-hidden" >
            <TableHeader
                onSearch={setSearchVal}
                searchDefaultValue={searchVal}
                searchPlaceholder="Search orders by description or id name, description..."
            >

            </TableHeader>

            <Table
                columns={columns}
                pagination={false}
                dataSource={filteredOrders}
                loading={false}
                rowKey={"id"}
                bordered={false}
                className="border-t border-gray-200/70 px-3 pt-3"
                scroll={{ x: "max-content" }}
                rowClassName="text-slate-800 cursor-pointer"
            />
        </div>
    )
}

export default Orders