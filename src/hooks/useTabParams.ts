import { useLocation, useNavigate } from "react-router-dom";

export const useTabParams = (defaultVal: string = "") => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get("tab") || defaultVal;

    const updateTab = (tab: string) => {
        searchParams.set("tab", tab);
        navigate({
            pathname: location.pathname,
            search: searchParams.toString(),
        }, { replace: true });
    }

    return {
        tab,
        updateTab
    };
}