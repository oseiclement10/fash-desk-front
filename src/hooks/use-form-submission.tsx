import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import type { MutationFunction } from "@tanstack/react-query";
import { notification } from "antd";
import type { RequestError } from "@/@types/error";
import { parseApiError } from "@/utils/parse-api-errors";
import type { UpdateProps } from "@/@types/common";
import { CrudService } from "@/services/CrudService";



type AddFormSubmissionHookProps = {
    addFn: MutationFunction<unknown, object>;
    onSuccessFn: () => void;
    title: string;
    successMsg?: string;
};
type EditFormSubmissionHookProps = {
    editFn: MutationFunction<unknown, UpdateProps>;
    onSuccessFn: () => void;
    title: string;
    successMsg?: string;
};



export const useCreateDataHook = ({
    addFn,
    title,
    onSuccessFn,
    successMsg,
}: AddFormSubmissionHookProps) => {

    const { isPending, mutate, isError, error, isSuccess } = useMutation({
        mutationFn: addFn,
        onSuccess: () => {
            onSuccessFn();
        },

    });


    useEffect(() => {
        if (isError) {
            notification["error"]({
                message: parseApiError(error as RequestError),
                duration: 8,
            });
        }

        if (isSuccess) {
            notification["success"]({
                message: successMsg || `Added ${title} Successfully`,
            });
        }
    }, [isError, isSuccess, title, error]);

    return { isPending, isSuccess, mutate, error };
};

export const useEditDataHook = ({
    editFn,
    title,
    onSuccessFn,
    successMsg
}: EditFormSubmissionHookProps) => {
    const { isPending, mutate, isError, error, isSuccess } = useMutation({
        mutationFn: editFn,
        onSuccess: () => {
            onSuccessFn();
        },
    });

    useEffect(() => {
        if (isError) {
            notification["error"]({
                message: parseApiError(error as RequestError),
                duration: 8,
            });
        }
        if (isSuccess) {
            notification["success"]({
                message: successMsg || `Edited ${title} Successfully`,
            });
        }
    }, [isError, title, error, isSuccess]);


    return { isPending, mutate, isSuccess };
};






type DataMutationHookProps<T> = {
    title: string;
    onSuccessFn: (resp?: any) => void;
    onError?: () => void;
    successMsg?: string;
    api: CrudService<T>;
    useAlerts?: boolean;
    hasFile?: boolean;
    extraPath?: string;
}

export function useDataMutationHook<T>({ onSuccessFn, successMsg, title, api, extraPath, onError, useAlerts = true, hasFile = false }: DataMutationHookProps<T>) {

    const { isPending: creating, mutate: saveNew, isError: errorCreating, error: createError, isSuccess: createSuccess } = useMutation({
        mutationFn: (data: object) => hasFile ? api.addNewItemWithFile(data, extraPath) : api.addNewItem(data, extraPath),
        onSuccess: (data: any) => {
            onSuccessFn(data);
        },
        onError: () => onError && onError(),
    });

    const { isPending: updating, mutate: update, isError: errorUpdating, error: updateError, isSuccess: updateSuccess } = useMutation({
        mutationFn: (data: UpdateProps) => hasFile ? api.updateItemWithFile(data) : api.updateItem(data),
        onSuccess: (data?: any) => {
            onSuccessFn(data);
        },
        onError: () => onError && onError(),
    });

    useEffect(() => {
        if (useAlerts && (errorCreating || errorUpdating)) {
            console.log(updateError || createError);
            notification["error"]({
                message: parseApiError(createError as RequestError || updateError as RequestError),
                duration: 8,
            })
        }
    }, [errorCreating, errorUpdating, createError, updateError]);



    useEffect(() => {
        if (useAlerts && createSuccess) {
            notification["success"]({
                message: successMsg || `Added ${title} Successfully`,
            });
        }
    }, [createSuccess, title, successMsg]);

    useEffect(() => {

        if (useAlerts && updateSuccess) {
            notification["success"]({
                message: `Updated ${title} Successfully`,
            });
        }
    }, [updateSuccess, title]);

    return {
        saving: creating || updating,
        error: createError || updateError,
        saveNew,
        update,
    }
}
