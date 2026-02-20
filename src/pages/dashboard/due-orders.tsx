import type { OrderItem } from '@/@types/orders';
import { getDueOrderColumns } from '../orders/due';
import { Table } from 'antd';
import { FaExclamationTriangle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { appRoutes } from '@/routes';

const OrdersDue = ({ orders }: { orders: OrderItem[] }) => {

    const columns = getDueOrderColumns({ useActions: false, actions: [] });

    return (
        <div className='bg-white rounded-2xl p-5 shadow-md'>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <FaExclamationTriangle className="text-red-500" />
                    <span className="font-semibold text-red-700">Due & Overdue Orders</span>
                </div>

                <Link to={appRoutes.ordersDue?.path} className="text-sm text-blue-500 underline">View All</Link>
            </div>

            <Table
                columns={columns}
                pagination={false}
                dataSource={orders}
                loading={false}
                rowKey={"id"}
                bordered={false}
                className="border-t border-gray-200/70 px-3 pt-3"
                scroll={{ x: "max-content" }}

            />
        </div>
    )
}

export default OrdersDue

