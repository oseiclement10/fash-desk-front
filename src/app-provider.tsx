import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { type PropsWithChildren } from "react";
import AuthContextProvider from "./contexts/auth/auth-context";
import { ConfigProvider } from "antd";
import { antdTheme } from "./config/ant-d-theme";


const AppProvider = ({ children }: PropsWithChildren) => {

    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <ConfigProvider theme={antdTheme}>
                <AuthContextProvider>
                    {children}
                </AuthContextProvider>
            </ConfigProvider>

        </QueryClientProvider >
    )
}

export default AppProvider