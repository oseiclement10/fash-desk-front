import type { PaginatedResponse } from "@/@types/common";
import type { RequestError } from "@/@types/error";
import type { CrudService } from "@/services/CrudService"
import useQueryFetch from "./use-query-fetch";
import { removeEmptyValues } from "@/utils/remove-emtpy-values";

export type GetActiveProps<T> = {
    api: CrudService<T>,
    queryKey: string[],
    title: string,
    customPath?: string;
    enabled?: boolean;
    params?: object;
     dependencies?: string[];
}

export const useGetActive = <T>({ api, queryKey, title, enabled = true, customPath, dependencies = [], params = {} }: GetActiveProps<T>) => {
    const cleanedParams = removeEmptyValues(params);
    
    return useQueryFetch<PaginatedResponse<T>, RequestError>({
        queryFn: () => api.getPaginatedData({ per_page: "100", ...cleanedParams }, customPath ?? "active", !!customPath),
        title: title,
        enabled: enabled,
        queryKeys: [...queryKey, ...dependencies],
    });

}





