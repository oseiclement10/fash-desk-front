
import { Navigate } from "react-router-dom";
import { useIsAuthenticated } from "@/contexts/auth/auth-context";
import { hasAnyPermission } from "@/utils/auth";
import type { PropsWithChildren } from "react";
import AccessDeniedPage from "@/pages/auth/access-denied";
import Layout from "@/layouts";
import type { PermissionValue } from "@/config/permissions";

export const AuthGuard = () => {
    const isAuthenticated = useIsAuthenticated();

    if (!isAuthenticated) {
        return <Navigate to="/login" />
    }

    return (
        <Layout />
    );
};


export const PageGuard = ({ authority, children }: PropsWithChildren & { authority: PermissionValue[] }) => {

    if (hasAnyPermission(authority)) {
        return (<>{children}</>);
    }

    return <AccessDeniedPage />

}

