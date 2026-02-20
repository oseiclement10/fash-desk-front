import Dashboard from "@/pages/dashboard";
import Orders from "@/pages/orders";
import OrdersDue from "@/pages/orders/due";
import OrderDetails from "@/pages/orders/details";
import OrderSummary from "@/pages/orders/order-summary";
import NewOrder from "@/pages/orders/new-order";
import Inflows from "@/pages/inflows";
import Outflows from "@/pages/outflows";
import Customers from "@/pages/customers";
import CustomerOverview from "@/pages/customers/overview";
import CustomerDetails from "@/pages/customers/details";
import CustomerForm from "@/pages/customers/registration";
import StaffMgmt from "@/pages/staff-mgmt";
import ProfileMgmt from "@/pages/profile";
import Transactions from "@/pages/transactions";
import Reviews from "@/pages/reviews";
import { permissions } from "@/config/permissions";

export const appRoutes = {
    dashboard: {
        path: `/dashboard`,
        element: <Dashboard />,
    title: "Dashboard",
        permissions: [],
    },

    orders: {
        path: `/orders`,
        element: <Orders />,
    title: "Orders",
        permissions: [permissions.viewOrders],
    },

    ordersDue: {
        path: `/orders/due`,
        element: <OrdersDue />,
    title: "Due Orders",
        permissions: [permissions.viewOrdersDue],
    },
    newOrder: {
        path: `/orders/new`,
        element: <NewOrder />,
    title: "Create Order",
        permissions: [permissions.createOrder],
    },

    orderDetails: {
        path: `/orders/:id`,
        element: <OrderDetails />,
    title: "Order Details",
        permissions: [permissions.viewOrderDetails],
    },

    orderSummary: {
        path: `/orders/:id/summary`,
        element: <OrderSummary />,
    title: "Order Summary",
        permissions: [permissions.viewOrderDetails],
    },

    inflows: {
        path: `/inflows`,
        element: <Inflows />,
    title: "Inflows",
        permissions: [permissions.viewInflows],
    },

    outflows: {
        path: `/outflows`,
        element: <Outflows />,
    title: "Outflows",
        permissions: [permissions.viewOutflows],
    },

    customers: {
        path: `/customers`,
        element: <Customers />,
    title: "Customers",
        permissions: [permissions.viewCustomers],
    },

    customerOverview: {
        path: `/customers/overview`,
        element: <CustomerOverview />,
    title: "Customer Report",
        permissions: [permissions.viewCustomerReports],
    },

    customerForm: {
        path: `/customers/new`,
        element: <CustomerForm />,
    title: "Register Customer",
        permissions: [permissions.createCustomer],
    },

    customerDetails: {
        path: `/customers/:id`,
        element: <CustomerDetails />,
    title: "Customer Details",
        permissions: [permissions.viewCustomerDetails],
    },

    staffMgmt: {
        path: `/staff-mgmt`,
        element: <StaffMgmt />,
    title: "Staff",
        permissions: [
            permissions.viewRoles,
            permissions.viewUsers,
        ],
    },

    transactions: {
        path: `/transactions`,
        element: <Transactions />,
    title: "Transactions",
        permissions: [
            permissions.viewTransactionOverview,
        ],
    },

    profile: {
        path: `/profile`,
        element: <ProfileMgmt />,
    title: "Profile",
        permissions: [],
    },
    reviews: {
        path: `/reviews`,
        element: <Reviews />,
    title: "Reviews",
        permissions: [permissions.viewReviews],
    }
};

export const appRoutesCollection = Object.values(appRoutes);