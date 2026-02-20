import { useContext, useState } from "react";
import type { ComponentType, PropsWithChildren, ReactNode } from "react";
import { NavLink, useLocation, useMatch } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import clsx from "clsx";
import { LayoutDrawerContext } from "@/contexts/layout";
import React from "react";
import { ChevronRight } from "lucide-react";

type MenuItemProps = {
    label: string;
    icon: ReactNode;
    path: string;
    isVisible?: boolean;
    onClick?(): void;
}

type MenuGroupProps = PropsWithChildren & {
    caption: string;
}

type CollapsibleMenuProps = {
    icon: ReactNode;
    title: string;
    items: MenuItemProps[];
}

export const MenuGroup = ({ caption, children }: MenuGroupProps) => {

    const hasVisibleChildren = React.Children.toArray(children).some((child: ReactNode) => {
        if (React.isValidElement<MenuItemProps>(child)) {
            return child.props.isVisible !== false;
        }
        return false;
    });

    if (!hasVisibleChildren) return null;

    return (
        <div>
            <div className="flex items-center mb-2 font-poppins">
                <h3 className="mr-3 text-[10px] uppercase font-semibold text-slate-700">{caption}</h3>
            </div>

            <div className=" space-y-1 ">
                {children}
            </div>
        </div>
    )
}


export const MenuItem = ({ label, icon, path, isVisible = true }: MenuItemProps) => {

    const {
        setIsDrawerOpen,
        isDrawerOpen,
    } = useContext(LayoutDrawerContext);

    const { pathname } = useLocation();

    const isActive = useMatch(path) || pathname.startsWith(path);

    const containerStyling = clsx('flex items-center py-2 px-[6px] font-poppins  smooth-transition ', {
        'bg-muted text-primary rounded-sm': isActive,
        'text-slate-800 hover:text-secondary': !isActive
    })

    const handleClick = () => {
        if (isDrawerOpen) {
            setIsDrawerOpen(false);
        }
    }

    return isVisible ? (
        <NavLink to={path} className={containerStyling} onClick={() => handleClick()}>
            <span className={`w-[25px] h-[25px] rounded-md flex items-center justify-center   `}>{icon}</span>
            <span className="flex-1 text-sm">{label}</span>
        </NavLink>
    ) : null
}


export const MenuItemAlt = ({ label, Icon, path, isVisible = true, onClick }: Omit<MenuItemProps, "icon"> & { Icon: ComponentType<any> }) => {

    


    const isActive = useMatch(path);



    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    }

    return isVisible ? (
        <>
            <NavLink to={path} onClick={() => handleClick()}
                className={`w-full flex items-center gap-4 px-4 py-[7px] text-sm rounded-lg transition-all duration-200 group ${isActive
                    ? 'bg-gradient-to-r from-primary-foreground to-primary-foreground !text-white '
                    : '!text-gray-700  hover:!text-primary'
                    }`}
            >
                <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-gray-600 group-hover:text-primary'}`} />
                <span className="-ml-[10px]">{label}</span>
                {isActive && <ChevronRight className="w-2.5  ml-auto" />}
            </NavLink>
        </>

    ) : null
}


export const CollapsibleMenu = ({ icon, items, title }: CollapsibleMenuProps) => {
    const location = useLocation();

    const hasActiveChild = items.some(({ path }) => location.pathname.includes(path));

    const [isOpen, setIsOpen] = useState(hasActiveChild);


    const labelStyling = clsx('flex items-center w-full text-slate-800 hover:text-orange-600', {
        'text-orange-600': hasActiveChild,
        'text-slate-800': !hasActiveChild
    })

    return (
        <div className="group">
            <button className={labelStyling} onClick={() => setIsOpen(old => !old)}>
                <span className="w-[25px] h-[25px] rounded-md flex items-center justify-center bg-orange-200/60 mr-3 group-hover:text-orange-600">{icon}</span>
                <span className="flex-1 text-left">{title}</span>
                <span className="w-[25px] ml-auto h-[25px] rounded-md flex items-center justify-center">
                    <IoIosArrowForward className={`transition-transform duration-150 ${isOpen ? "rotate-90" : ""}`} />
                </span>
            </button>
            <div
                className={`transition-[max-height] duration-300 ease-in-out ml-3 mt-2  overflow-hidden`}
                style={{
                    maxHeight: isOpen ? `${items.length * 48}px` : "0",
                }}
            >
                <div className="mt-[10px] mb-3 space-y-2">
                    {items.map((elem) => (
                        <MenuItem isVisible={elem.isVisible} icon={elem.icon} label={elem.label} path={elem.path} key={elem.path} />
                    ))}
                </div>

            </div>
        </div>
    );
};





export default MenuGroup;