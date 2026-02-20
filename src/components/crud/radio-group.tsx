import React from 'react';
import { Check } from 'lucide-react';

export interface RadioOption {
    value: string;
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    disabled?: boolean;
}

interface RadioGroupProps {
    options: RadioOption[];
    value?: string;
    onChange?: (value: string) => void;
    name: string;
    className?: string;
    orientation?: 'horizontal' | 'vertical';
    variant?: 'default' | 'cards';
}

const RadioGroup: React.FC<RadioGroupProps> = ({
    options,
    value,
    onChange,
    name,
    className = '',
    orientation = 'horizontal',
    variant = 'default',
}) => {
    if (variant === 'cards') {
        return (
            <div className={`grid grid-cols-2  gap-3 ${className}`}>
                {options.map((option) => (
                    <label
                        key={option.value}
                        className={`
              relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
              ${value === option.value
                                ? 'border-blue-500 bg-blue-50 ring-2 ring-primary-foreground/80'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }
              ${option.disabled
                                ? 'opacity-50 cursor-not-allowed hover:border-gray-200'
                                : ''
                            }
            `}
                    >
                        <input
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={value === option.value}
                            onChange={() => !option.disabled && onChange && onChange(option.value)}
                            disabled={option.disabled}
                            className="sr-only"
                        />
                        <div className="flex items-center gap-3">
                            {option.icon && (
                                <option.icon
                                    className={`w-5 h-5 ${value === option.value ? 'text-primary-foreground' : 'text-gray-400'
                                        }`}
                                />
                            )}
                            <span className="font-medium text-gray-900">{option.label}</span>
                            {value === option.value && (
                                <Check className="w-5 h-5 text-primary-foreground ml-auto" />
                            )}
                        </div>
                    </label>
                ))}
            </div>
        );
    }

    return (
        <div
            className={`
        flex gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200
        ${orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'}
        ${className}
      `}
        >
            {options.map((option) => (
                <label
                    key={option.value}
                    className={`
            flex items-center bg-white justify-center px-4 py-2 rounded-md border cursor-pointer transition-all duration-200
            ${value === option.value
                            ? '  !bg-primary-foreground text-white shadow-sm  border-primary-foreground/50'
                            : 'text-gray-600  hover:text-gray-800 hover:bg-gray-50'
                        }
            ${option.disabled
                            ? 'opacity-50 cursor-not-allowed hover:bg-transparent hover:text-gray-600'
                            : ''
                        }
          `}
                >
                    <input
                        type="radio"
                        name={name}
                        value={option.value}
                        checked={value === option.value}
                        onChange={() => !option.disabled && onChange && onChange(option.value)}
                        disabled={option.disabled}
                        className="sr-only"
                    />
                    <div className="flex items-center gap-2">
                        {option.icon && (
                            <option.icon
                                className={`w-4 h-4 ${value === option.value ? 'text-primary-foreground' : 'text-gray-400'
                                    }`}
                            />
                        )}
                        <span className="text-sm font-medium">{option.label}</span>
                    </div>
                </label>
            ))}
        </div>
    );
};

export default RadioGroup;