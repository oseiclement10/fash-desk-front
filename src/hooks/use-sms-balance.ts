import { useQuery } from "@tanstack/react-query";
import { CrudService } from "@/services/CrudService";

const api = new CrudService<{ balance: string }>("sms-balance");

export const useSmsBalance = () => {
    return useQuery({
        queryKey: ["sms-balance"],
        queryFn: () => api.getData(),
        refetchInterval: 60000,
    });
};
