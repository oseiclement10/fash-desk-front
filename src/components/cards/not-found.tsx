import { Search, FileX, AlertCircle } from "lucide-react";

type NotFoundCardProps = {
    icon?: "search" | "file" | "alert";
    title?: string;
    message?: string;
    actionText?: string;
    onAction?: () => void;
    className?: string;
    variant?: "default" | "subtle" | "dark";
}

export const NotFoundCard = ({
    icon = "search",
    title = "Nothing Found",
    message = "We couldn't find what you're looking for. Try adjusting your search or filters.",
    actionText = "Go Back",
    onAction = () => window.history.back(),
    className = "",
    variant = "default"
}: NotFoundCardProps) => {

    const icons = {
        search: Search,
        file: FileX,
        alert: AlertCircle
    };

    const IconComponent = icons[icon] || Search;

    const variants = {
        default: "bg-white border-gray-200",
        subtle: "bg-gray-50 border-gray-100",
        dark: "bg-gray-800 border-gray-700 text-white"
    };

    return (
        <div className={`max-w-md mx-auto p-8 rounded-xl border-2 border-dashed text-center ${variants[variant]} ${className}`}>
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${variant === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                <IconComponent className={`w-8 h-8 ${variant === 'dark' ? 'text-gray-300' : 'text-gray-400'
                    }`} />
            </div>

            <h3 className={`text-xl font-semibold mb-2 ${variant === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                {title}
            </h3>

            <p className={`mb-6 leading-relaxed ${variant === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                {message}
            </p>

            {actionText && onAction && (
                <button
                    onClick={onAction}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${variant === 'dark'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                >
                    {actionText}
                </button>
            )}
        </div>
    );
};

