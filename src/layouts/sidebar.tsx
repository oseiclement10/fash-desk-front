import {
    User,
    Users,
    LayoutDashboard,
    ClipboardList,
    ArrowLeftRight,
    FileCog,
    UserPlus,
    ClipboardPlus,
    ChartPie,
    CalendarClock,
    MessageSquareQuote,
} from 'lucide-react';
import MenuGroup, { MenuItemAlt } from './menu';
import { appRoutes } from '@/routes';
import { useAuthUser } from '@/contexts/auth/auth-context';
import { hasAnyPermission } from '@/utils/auth';
import { permissions } from '@/config/permissions';
import { LogoImg } from '@/components/appLogo';
import { appConfig } from '@/config/meta';

interface SidebarProps {
    onItemClick?: () => void;
}

const Sidebar = ({ onItemClick }: SidebarProps) => {
    const user = useAuthUser();


    const MenuItemWithClick = ({ label, path, Icon, isVisible }: { label: string; path: string; Icon: any, isVisible?: boolean }) => (
        <MenuItemAlt
            label={label}
            path={path}
            isVisible={isVisible}
            Icon={Icon}
            onClick={onItemClick}
        />
    );

    return (
        <div className={`w-56 h-full transition-all duration-300 ease-in-out bg-white/80 backdrop-blur-xl ${onItemClick ? 'border-r-0' : 'border-r border-gray-200'}`}>
            {!onItemClick && (
                <div className="h-18 flex items-center px-5 ">
                    <div className="flex items-center gap-3">
                        <div className="w-12  h-12   rounded-xl flex items-center justify-center shadow-lg">
                            <LogoImg className='w-32' />
                        </div>
                        <div>
                            <h1 className=" font-bold bg-linear-to-r from-black to-foreground bg-clip-text text-transparent">
                                {appConfig.name}
                            </h1>
                            <p className="text-xs -mt-0.5 text-gray-700">{appConfig.tagline}</p>
                        </div>
                    </div>
                </div>
            )}





            <nav className="space-y-4 pb-6 pt-4 scrollbar-hide overflow-y-auto w-5/6 mx-auto h-[calc(100vh-150px)]">
                {/* MAIN */}
                <MenuGroup caption="MAIN">
                    <MenuItemWithClick
                        label="Dashboard"
                        path={appRoutes.dashboard.path}
                        Icon={LayoutDashboard}
                        isVisible={hasAnyPermission([
                            permissions.viewDashboardRevenueStatistics,
                            permissions.viewDashboardRevenueGraph,
                            permissions.viewDashboardOrdersStatistics,
                            permissions.viewDashboardCustomerStatistics,
                        ])}
                    />

                    <MenuItemWithClick
                        label={appRoutes.orders.title}
                        path={appRoutes.orders.path}
                        Icon={ClipboardList}
                        isVisible={hasAnyPermission([
                            permissions.viewOrders,
                            permissions.updateOrder,
                            permissions.viewOrderDetails,
                            permissions.payForOrder,
                        ])}
                    />

                    <MenuItemWithClick
                        label="New Order"
                        path={appRoutes.newOrder.path}
                        Icon={ClipboardPlus}
                        isVisible={hasAnyPermission([
                            permissions.createOrder,
                        ])}
                    />

                    <MenuItemWithClick
                        label="Orders Due"
                        path={appRoutes.ordersDue.path}
                        Icon={CalendarClock}
                        isVisible={hasAnyPermission([
                            permissions.viewOrdersDue,
                        ])}
                    />
                </MenuGroup>

                {/* CUSTOMERS */}
                <MenuGroup caption="Customers">
                    <MenuItemWithClick
                        label={appRoutes.customers.title}
                        path={appRoutes.customers.path}
                        Icon={Users}
                        isVisible={hasAnyPermission([
                            permissions.viewCustomers,
                            permissions.viewCustomerDetails,
                        ])}
                    />

                    <MenuItemWithClick
                        label="Register"
                        path={appRoutes.customerForm.path}
                        Icon={UserPlus}
                        isVisible={hasAnyPermission([
                            permissions.createCustomer,
                        ])}
                    />

                    <MenuItemWithClick
                        label="Report"
                        path={appRoutes.customerOverview.path}
                        Icon={ChartPie}
                        isVisible={hasAnyPermission([
                            permissions.viewCustomerReports,
                        ])}
                    />
                </MenuGroup>

                {/* FINANCE */}
                <MenuGroup caption="Finance">
                    <MenuItemWithClick
                        label={appRoutes.transactions.title}
                        path={appRoutes.transactions.path}
                        Icon={FileCog}
                        isVisible={hasAnyPermission([
                            permissions.viewTransactionOverview,
                        ])}
                    />

                    <MenuItemWithClick
                        label={appRoutes.inflows.title}
                        path={appRoutes.inflows.path}
                        Icon={ArrowLeftRight}
                        isVisible={hasAnyPermission([
                            permissions.viewInflows,
                        ])}
                    />

                    <MenuItemWithClick
                        label={appRoutes.outflows.title}
                        path={appRoutes.outflows.path}
                        Icon={ArrowLeftRight}
                        isVisible={hasAnyPermission([
                            permissions.viewOutflows,
                        ])}
                    />
                </MenuGroup>

                {/* STAFF MANAGEMENT */}


                <MenuGroup caption="SITE MGMT">
                    <MenuItemWithClick
                        label="Reviews"
                        path={appRoutes.reviews.path}
                        Icon={MessageSquareQuote}
                        isVisible={hasAnyPermission(appRoutes.reviews.permissions)}
                    />

                </MenuGroup>

                <MenuGroup caption="STAFF MGMT">
                    <MenuItemWithClick
                        label={appRoutes.staffMgmt.title}
                        path={appRoutes.staffMgmt.path}
                        Icon={Users}
                        isVisible={hasAnyPermission([
                            permissions.viewUsers,
                            permissions.viewUserDetails,
                            permissions.assignRole,
                            permissions.viewRoles,
                        ])}
                    />
                </MenuGroup>

                {/* OTHERS */}
                <MenuGroup caption="OTHERS">
                    <MenuItemWithClick
                        label={appRoutes.profile.title}
                        path={appRoutes.profile.path}
                        Icon={User}
                        isVisible={true} // everyone can view profile
                    />
                </MenuGroup>
            </nav>


            {/* Profile Section - Only show in desktop sidebar */}
            {!onItemClick && (
                <div className="px-3 pb-6">
                    <div className="bg-gradient-to-r from-blue-50 to-pink-50 rounded-xl p-2 border border-blue-100">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-secondary to-foreground rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Sidebar