import type { Customer } from "@/@types/central-entities";
import { GoBackBtn } from "@/components/buttons/backbutton";
import { permissions } from "@/config/permissions";
import { hasPermission } from "@/utils/auth";
import { formatDate } from "@/utils/date-helper";
import {
    Briefcase,
    Calendar,
    Edit,
} from 'lucide-react';


const Header = ({ customer, onEdit, allowEdit }: { customer: Customer, onEdit: (val?: any) => void, allowEdit?: boolean }) => {

    const calculateAge = (birthdate: string) => {

        if (!birthdate) {
            return "-"
        }
        const today = new Date();
        const birthDate = new Date(birthdate);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const getGenderColor = (gender: string) => {
        switch (gender) {
            case 'male':
                return 'bg-blue-100 text-blue-800';
            case 'female':
                return 'bg-pink-100 text-pink-800';
            default:
                return 'bg-purple-100 text-purple-800';
        }
    };

    const getInitials = (fullName: string) =>
        fullName
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);


    return (
        <div className="bg-blue-100 p-6 border-b border-gray-200" >
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        {customer.image ? (
                            <img
                                src={customer.image}
                                alt={customer.full_name}
                                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-500 flex items-center justify-center text-white font-semibold text-xl shadow">
                                {getInitials(customer.full_name)}
                            </div>
                        )}
                        <div className="absolute -bottom-1 -right-1">
                            <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getGenderColor(
                                    customer.gender,
                                )}`}
                            >
                                {customer.gender}
                            </span>
                        </div>
                    </div>

                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 leading-tight">
                            {customer.full_name}
                        </h1>
                        <div className="flex items-center flex-wrap gap-2 md:gap-4 mt-1 text-sm text-gray-600">
                            {customer.occupation && (
                                <div className="flex items-center gap-1">
                                    <Briefcase className="w-4 h-4" />
                                    <span>{customer.occupation}</span>
                                </div>
                            )}
                            <div className="flex  md:items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>
                                    {customer.birthdate ? `
                                    ${formatDate(customer.birthdate)} (${calculateAge(customer.birthdate)}y)
                                    ` : "-"}

                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    {hasPermission(permissions.updateCustomer) && onEdit && allowEdit && (
                        <button
                            onClick={() => onEdit(customer)}
                            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
                        >
                            <Edit className="w-4 h-4" />
                            <span>Edit</span>
                        </button>
                    )}
                    <GoBackBtn className="!py-2 text-blue-600 border-blue-600" />
                </div>

            </div>
        </div >
    )
}

export default Header