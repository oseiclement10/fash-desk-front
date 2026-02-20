import React from 'react'
import { useLocation } from 'react-router-dom'

const useQueryParams = () => {
    const { search } = useLocation();
    return React.useMemo(() => {
        const params = new URLSearchParams(search);
        const obj: Record<string, string> = {};
        for (const [key, value] of params.entries()) {
            obj[key] = value;
        }
        return obj;
    }, [search]);
}

export default useQueryParams