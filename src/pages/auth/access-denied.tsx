import React from 'react';
import { Shield, ArrowLeft, Home } from 'lucide-react';

const AccessDeniedPage: React.FC = () => {
    const handleGoBack = () => {
        window.history.back();
    };

    const handleGoHome = () => {
        window.location.href = '/welcome';
    };

    return (
        <div className="min-h-[90dvh] bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                {/* Icon */}
                <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
                        <Shield className="w-10 h-10 text-red-600" />
                    </div>
                    <div className="text-6xl font-bold text-red-600 mb-2">403</div>
                </div>

                {/* Content */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Access Denied
                    </h1>
                    <p className="text-gray-600 leading-relaxed">
                        You do not have permission to access this resource. Please contact your administrator if you believe this is an error.
                    </p>
                </div>


                <div className="space-y-3">
                    <button
                        onClick={handleGoBack}
                        className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </button>

                    <button
                        onClick={handleGoHome}
                        className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                        <Home className="w-4 h-4" />
                        Go to Home
                    </button>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                        Need help? Contact{' '}
                        <a
                            href="mailto:support@company.com"
                            className="text-red-600 hover:text-red-700 underline"
                        >
                            support@company.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AccessDeniedPage;