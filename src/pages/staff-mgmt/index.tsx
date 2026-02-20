import { Tabs } from "antd";
import StaffList from "./staff";
import RolesMgmt from "./roles-and-permissions";
import { useTabParams } from "@/hooks/useTabParams";
import { permissions } from "@/config/permissions";
import { useMemo } from "react";
import { hasPermission } from "@/utils/auth";

const tabs = [
    { label: "Staff List", key: "staff-mgmt", children: <StaffList />, permission: permissions.viewUsers },
    { label: "Roles Mgmt ", key: "roles-mgmt", children: <RolesMgmt />, permission: permissions.viewRoles }
];

const StaffMgmt = () => {
    const { tab, updateTab } = useTabParams("staff-mgmt");

    const visibileTabs = useMemo(() => tabs.filter(t => hasPermission(t.permission)), []);

    return (
        <Tabs
            activeKey={tab}
            onChange={updateTab}
            items={visibileTabs}
        />
    )
}

export default StaffMgmt