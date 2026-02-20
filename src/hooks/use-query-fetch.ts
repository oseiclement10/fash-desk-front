import type { RequestError } from "@/@types/error";
import { parseApiError } from "@/utils/parse-api-errors";
import { useQuery } from "@tanstack/react-query";
import { notification } from "antd";
import { useEffect } from "react";
import type { UseQueryResult } from "@tanstack/react-query";


type QueryFetchProps<TData, TError extends RequestError> = {
  queryFn: () => Promise<TData>;
  title: string;
  queryKeys: string[];
  enabled?: boolean;
  error?: TError;
};

const useQueryFetch = <TData, TError extends RequestError>({
  queryFn,
  title,
  queryKeys,
  enabled = true,
}: QueryFetchProps<TData, TError>): UseQueryResult<TData, TError> => {

  const queryResult = useQuery<TData, TError>({
    queryFn: queryFn,
    queryKey: queryKeys,
    enabled: enabled,
  });

  const { isPending, error, isError } = queryResult;

  useEffect(() => {
    if (!isPending && isError) {
      console.log("error :", error);
      notification["error"]({
        duration: 8,
        message: parseApiError(error as RequestError),
      });
    }
  }, [isError, isPending, title]);

  return queryResult;
};

export default useQueryFetch;
