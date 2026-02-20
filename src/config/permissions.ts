

export const permissions = {
    // Dashboard
    viewDashboardRevenueStatistics: "view dashboard revenue statistics",
    viewDashboardRevenueGraph: "view dashboard revenue graph",
    viewDashboardOrdersStatistics: "view dashboard orders statistics",
    viewDashboardCustomerStatistics: "view dashboard customer statistics",

    // Orders
    viewOrdersDue: "view orders due",
    viewOrders: "view orders",
    createOrder: "create order",
    updateOrder: "update order",
    deleteOrder: "delete order",
    payForOrder: "pay for order",
    viewOrderDetails: "view order details",

    // Customers
    viewCustomers: "view customers",
    createCustomer: "create customer",
    updateCustomer: "update customer",
    deleteCustomer: "delete customer",
    viewCustomerDetails: "view customer details",
    viewCustomerReports: "view customer reports",

    // Transactions
    viewTransactionOverview: "view transaction overview",
    viewTransactionDetails: "view transaction details",
    viewInflows: "view inflows",
    viewOutflows: "view outflows",
    createTransaction: "create transaction",
    updateTransaction: "update transaction",
    deleteTransaction: "delete transaction",

    // Role & Permission Management
    viewRoles: "view roles",
    createRole: "create role",
    viewRoleDetails: "view role details",
    updateRole: "update role",
    deleteRole: "delete role",

    // Users
    viewUsers: "view users",
    viewUserDetails: "view user details",
    assignRole: "assign role",
    createUser: "create user",
    updateUser: "update user",
    deleteUser : "delete user",

    // Reviews
    viewReviews: "view reviews",
    viewReviewDetails: "view review details",
    updateReview: "update review",
    deleteReview: "delete review",

    // Appointments
    viewAppointments: "view appointments",
    viewAppointmentDetails: "view appointment details",
    updateAppointment: "update appointment",
    deleteAppointment: "delete appointment",

} as const;


export type PermissionKey = keyof typeof permissions;
export type PermissionValue = (typeof permissions)[PermissionKey];
