import type { RequestError } from "@/@types/error";
import type { CrudService } from "@/services/CrudService"
import useQueryFetch from "./use-query-fetch";

export type GetActiveProps<T> = {
    api: CrudService<T>,
    queryKey: string [],
    title: string,
    enabled?: boolean;
    params?: object;
    dependencies?: string[];
    id: number | string;
    extraPath?: string;
}

export const useGetDetails = <T>({ api, queryKey, title, enabled = true, id, dependencies = [], params = {}, extraPath }: GetActiveProps<T>) => {
    return useQueryFetch<T, RequestError>({
        queryFn: () => api.getDetails(id as number, params, extraPath),
        title: title,
        enabled: enabled,
        queryKeys: [...queryKey, ...dependencies],
    });

}