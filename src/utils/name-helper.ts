
import type { User } from "@/@types/users";

export const getUserInitials = (user: User) => {
    return user?.name?.split(" ").length > 1 ? `${user?.name?.split(" ")[0][0]} ${user?.name?.split(" ")[1][0]}` : `${user?.name?.charAt(0)} ${user?.name?.charAt(1)}`;
}


export const getUserName = (user: User) => {
    return `${user?.name ?? ""} `;
}

