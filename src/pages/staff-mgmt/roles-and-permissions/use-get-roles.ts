import type { Role } from '@/@types/central-entities';
import type { PaginatedResponse } from '@/@types/common';
import type { RequestError } from '@/@types/error';
import { queryKeys } from '@/constants/query-keys';
import useQueryFetch from '@/hooks/use-query-fetch';
import { api } from './';

type Params = {
    search?: string;
    currentPage?: string;
    perPage?: number;
}

const useGetRoles = ({ search, currentPage, perPage}: Params) => {

    const queryResults = useQueryFetch<PaginatedResponse<Role>, RequestError>({
        queryFn: () => api.getPaginatedData({
            search,
            page: currentPage,
            per_page: perPage,
        }),
        title: "Roles",
        queryKeys: [queryKeys.roles, search||"", currentPage||"", perPage?.toString()||""],
    });

    return queryResults;
}

export default useGetRoles