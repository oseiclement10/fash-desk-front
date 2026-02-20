import type { PermissionValue } from "@/config/permissions"
import { getUserFromStorage } from "@/services/storageService"


export const hasAnyPermission = (authority: PermissionValue[]) => {
    if (authority.length == 0) return true;
    const usr = getUserFromStorage();
    return usr?.permissions?.some((p) => authority.includes(p)) || false;
}

export const hasPermission = (authority: PermissionValue) => {
    if (!authority) return true;
    const usr = getUserFromStorage();
    return usr?.permissions?.includes(authority) || false;
}



