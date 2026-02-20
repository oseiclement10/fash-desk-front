import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import type { KeyboardEvent, ChangeEvent } from 'react';

type SearchInputProps = {
    placeholder?: string;
    debounce?: number;
    onSearch: (key: string) => void;
    defaultValue?: string;
    className?: string;
};

export const SearchInput: React.FC<SearchInputProps> = ({
    placeholder = 'Search...',
    defaultValue = '',
    onSearch,
    debounce = 500,
    className
}) => {
    const [value, setValue] = useState(defaultValue ?? '');
    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (debounce > 0) {
            if (debounceTimer) clearTimeout(debounceTimer);

            const timer = setTimeout(() => onSearch(value), debounce);
            setDebounceTimer(timer);

            return () => clearTimeout(timer);

        } else {
            onSearch(value);
        }
    }, [value]);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (debounceTimer) clearTimeout(debounceTimer);
            onSearch(value);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    const handleClear = () => {
        setValue('');
        if (debounceTimer) clearTimeout(debounceTimer);
        onSearch('');
    };

    return (
        <div className={`relative w-full max-w-sm lg:max-w-sm mr-3 ${className}`}>
            <input
                type="text"
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="w-full pl-10 pr-10 py-[4px] md:py-[7px] rounded-xl border border-gray-300/70 focus:outline-none focus:ring-2 placeholder:text-gray-400 placeholder:text-sm focus:ring-muted transition-all duration-200 "
            />
            <Search className="absolute left-3  top-3 h-4 w-4 text-gray-400 pointer-events-none" />
            {value && (
                <button
                    onClick={handleClear}
                    className="absolute right-2 cursor-pointer top-2.5 text-gray-400 hover:text-red-500 transition"
                >
                    <X className="h-5 w-5" />
                </button>
            )}
        </div>
    );
};
