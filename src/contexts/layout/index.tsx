import { createContext, useState } from "react";
import type { PropsWithChildren } from "react";

type DrawerOpenProps = {
    isDrawerOpen: boolean;
    setIsDrawerOpen: (val: boolean) => void;
};

export const LayoutDrawerContext = createContext<DrawerOpenProps>({
    isDrawerOpen: false,
    setIsDrawerOpen: () => { }
});


export const LayoutDrawerContextProvider = ({ children }: PropsWithChildren) => {

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <LayoutDrawerContext.Provider value={{ isDrawerOpen, setIsDrawerOpen }}>
            {children}
        </LayoutDrawerContext.Provider>
    )
}