import type { CrudService } from "@/services/CrudService";
import type { TableProps } from "antd";
import type { HtmlHTMLAttributes, ReactNode, CSSProperties, JSX } from "react";

export type ModalMode = "add" | "edit" | "pay" | "partial-edit" | "partial-edit-other" | "delete" | "batch-delete" | "other" | "view" | "cancel" | "notes" | "complete-action" | "details" | "password-reset";

export type ModalProps<T> = {
    open: boolean;
    type: ModalMode;
    data: null | T;
};

export interface CommonModel extends Timestamps {
    id: number;
    status: boolean;
    created_at: string;
    updated_at: string;
}

export interface Timestamps {
    created_at: string;
    updated_at: string;
}

export interface DateFilters {
    start_date: string;
    end_date: string;
}

export type CommonButtonProps = {
    label: string;
    onClick?: (val: unknown) => void;
    style?: CSSProperties;
    icon?: JSX.Element;
    loading?: boolean;
    disabled?: boolean;
    className?: string;
    htmlType?: "button" | "submit" | "reset";
    customStyle?: CSSProperties;
    asLink?: string;
    labelSm?: string;
};









export type ErrorResponse = {
    response: {
        data: {
            message: string;
        };
    };
    message?: string;
};

export type CustomButtonProps = {
    asLink?: boolean;
    icon?: ReactNode;
    path?: string;
    label: string;
    className?: string;
} & HtmlHTMLAttributes<HTMLButtonElement>;

export type UpdateProps = {
    id: number | string;
    data: object;
    extraPath?: string;
};

export type OverlayProps<T = undefined> = {
    closeModal: () => void;
    mode: ModalMode;
    data?: T;
    api: CrudService<T>;
    altQueryKey?: string;
}


export interface PaginationMeta {
    current_page?: number;
    from?: number;
    last_page?: number;
    per_page?: number;
    to?: number;
    total?: number;
}

export type PaginatedResponse<T> = {
    data: T[];
    meta?: PaginationMeta;
    statistics: Record<string, string | number>;
};

export type AntColumnDef<T> = TableProps<T>["columns"];

export interface BreadcrumbItem {
    title: string;
    href: string;
}


export type RouteDef = {
    path: string;
    title: string;
    element: JSX.Element;
    permissions: string[];
}