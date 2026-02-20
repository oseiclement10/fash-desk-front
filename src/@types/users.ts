import type { PermissionValue } from "@/config/permissions";
import type { CommonModel } from "./common";

export type User = {
    id: number;
    name: string;
    email: string;
    phone_number: string;
    phone_code: string;
    image: string;
    is_active: boolean;
    roles?: Role[];
    address?: string;
};

export interface Role {
    id: number;
    name: string;
    description: string;
    permissions?: Permission[];
    created_at: string;
    updated_at: string;
}

export interface Permission extends CommonModel {
    name: string;
}


export interface Manager extends User { }

export interface AuthUser {
    user: User;
    token: string;
    permissions: PermissionValue[];

}