import { BASE_URL } from "@/config/base-url";
import axios from "axios";
import { getToken } from "./storageService";


const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json"
}



const api = axios.create({
    baseURL: BASE_URL,
    headers: headers,
});

api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status == "401" && error.response?.data?.message == "Unauthenticated.") {
            logoutCleanup();
        }

        return Promise.reject(error);
    }
);



const logoutCleanup = () => {
    localStorage.removeItem("usr");
    window.location.href = "/login";
}

export async function getHelper<T>(path: string, params?: object): Promise<T> {
    const { data } = await api.get(path, {
        params: params,
    });

    return data || data.data;
}

export async function postHelper(path: string, data: unknown) {
    const response = await api.post(path, data);

    return response.data?.data || response?.data;
}

export async function postWithFile(path: string, data: object) {
    const response = await api.post(path, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response?.data?.data || response?.data;
}

export async function updateHelper(path: string, id: string, data: unknown, usePathOnly: boolean = false) {
    const response = await api.put(usePathOnly ? path : `${path}/${id}`, data);
    return response.data?.data || response.data;
}

export async function deleteHelper(path: string, id: string) {
    await api.delete(`${path}/${id}`);
    return id;
}

export async function apiHelper<T>(path: string, params?: object): Promise<T> {
    const response = await api.get(path, { params });
    return response.data;
}

export async function fileResponsePost(path: string, data: unknown) {
    const response = await api.post(path, data, {
        responseType: "blob",
    });
    return response.data;
}

export async function fileResponseGet(path: string, params?: object) {
    const response = await api.get(path, {
        params,
        responseType: "blob",
    });
    return response.data;
}

