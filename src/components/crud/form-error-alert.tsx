import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

interface FormErrorAlertProps {
    message: string;
    className?: string;
}

const FormErrorAlert: React.FC<FormErrorAlertProps> = ({ message, className }) => {
    const [visible, setVisible] = useState(true);

    if (!visible) return null;

    return (
        <div className={`bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2 rounded-md text-sm flex items-start justify-between gap-4 mb-3 ${className} `}>
            <span>{message}</span>
            <button
                className="text-rose-400 cursor-pointer hover:text-rose-600 transition"
                onClick={() => setVisible(false)}
            >
                <AiOutlineClose size={16} />
            </button>
        </div>
    );
};

export default FormErrorAlert;
