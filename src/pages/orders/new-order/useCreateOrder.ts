import { useDataMutationHook } from "@/hooks/use-form-submission"
import { api } from "..";
import type { Order } from "@/@types/orders";
import { useQueryClient } from "@tanstack/react-query";
import { useOrderCreation } from "@/contexts/order-creation/order-creation";
import { queryKeys } from "@/constants/query-keys";
import { useNavigate } from "react-router-dom";
import { appRoutes } from "@/routes";


const useCreateOrder = () => {

    const queryClient = useQueryClient();
    const { dispatch } = useOrderCreation();
    const navigate = useNavigate();

    const onSucess = (resp: Order) => {
        queryClient.invalidateQueries({ queryKey: [queryKeys.orders] });
        dispatch({ type: "RESET" });
        navigate(appRoutes.orderSummary.path?.replace(":id", resp.id?.toString()));
    }

    const { saveNew, saving, error } = useDataMutationHook({
        title: "Order",
        api: api,
        onSuccessFn: onSucess,
        hasFile: true,
    });

    return {
        createOrder: saveNew,
        saving,
        error
    }

}

export default useCreateOrder