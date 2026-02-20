export const removeEmptyValues = (obj?: object) => {
    if (!obj) return {}
    const result = Object.fromEntries(Object.entries(obj).filter(([_, val]) => val !== undefined && val !== null));
    return result;
}

export function filterTruthyValues<T extends Record<string, any>>(obj: T): Record<string, T> {
    const parsed = Object.fromEntries(
        Object.entries(obj).filter(([_, value]) => Boolean(value))
    );
    return parsed;
}