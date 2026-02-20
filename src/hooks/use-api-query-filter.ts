import { useLocation, useNavigate } from "react-router-dom";
import {  useMemo } from "react";
import type { DateFilters } from "@/@types/common";

const defaults = {
  page: "1",
  perPage: "25"
}

export const useApiQueryFilter = (tabID?: string) => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  // Extract common parameters
  const startDate = queryParams.get(tabID ? `${tabID}_startDate` : "startDate") || "";
  const endDate = queryParams.get(tabID ? `${tabID}_endDate` : "endDate") || "";
  const perPage = queryParams.get(tabID ? `${tabID}_perPage` : "perPage") || defaults.perPage;
  const currentPage = queryParams.get(tabID ? `${tabID}_pageNumber` : "pageNumber") || defaults.page;
  const search = queryParams.get(tabID ? `${tabID}_search` : "search") || "";
  const status = queryParams.get("status") || "";


  // Helper function to update query parameters
  const updateQueryParams = (params: Record<string, string>) => {
    const pathname = location.pathname;
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        queryParams.set((tabID ? `${tabID}_${key}` : key), value);
      } else {
        queryParams.delete((tabID ? `${tabID}_${key}` : key));
      }
    });

    navigate(
      {
        pathname,
        search: queryParams.toString(),
      },
      { replace: true }
    );
  };

  // Update date parameters
  const updateDateParams = ({ start_date, end_date }: DateFilters) => {
    updateQueryParams({
      startDate: start_date,
      endDate: end_date,
    });
  };

  // Reset parameters to default values
  const resetParams = () => {
    updateQueryParams({
      search: "",
      perPage: "10",
      pageNumber: "1",
      startDate: "",
      endDate: "",
    });
  };

  // Update a specific parameter
  const updateParam = (urlLabel: string, value: string) => {
    updateQueryParams({ [urlLabel]: value });
  };

  // Update page size
  const updatePageSize = (per_page: string) => {
    updateQueryParams({ perPage: per_page });
  };

  // Update status
  const updateStatus = (status: string) => {
    updateQueryParams({ status });
  };

  // Update current page
  const updateCurrentPage = (pageNumber: string | number) => {
    updateQueryParams({ pageNumber: pageNumber.toString() });
  };

  // Update search parameters
  const updateSearchParams = (search: string) => {
    updateQueryParams({
      search,
      pageNumber: "1",
    });
  };

  // Switch tabs
  const switchTab = (newTab: string) => {
    updateQueryParams({ tab: newTab, pageNumber: "1" });
  };

  


  return {
    startDate,
    endDate,
    perPage: perPage,
    queryParams,
    currentPage,
    search,
    status,
    updateStatus,
    updateParam,
    updateDateParams,
    updatePageSize,
    updateCurrentPage,
    updateSearchParams,
    resetParams,
    switchTab,

  };
};