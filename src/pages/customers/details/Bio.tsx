import React from 'react';
import {
    User,
    Mail,
    Phone,
    MapPin,

} from 'lucide-react';
import { Image } from 'antd';
import type { Customer } from '@/@types/central-entities';
import ListTile from '@/components/crud/list-tile';
import femaleFallBackImg from "@/assets/images/ui/female-user-icon.png";
import maleFallBackImg from "@/assets/images/ui/user-male-icon.png";
import { formatDate } from '@/utils/date-helper';

interface CustomerBasicInfoProps {
    customer: Customer;
    className?: string;
}

const CustomerBasicInfo: React.FC<CustomerBasicInfoProps> = ({
    customer,
    className = '',
}) => {
  


    return (
        <div
            className={`bg-white rounded-2xl  border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md ${className}`}
        >
            <div className="p-6 space-y-5">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                    <User className="w-5 h-5 text-blue-500" />
                    <span>Personal Information</span>
                </h2>

                <ListTile
                    label="Image"
                    value={
                        <Image
                            className=" rounded-md"
                            src={customer.image || undefined}
                            fallback={customer.gender == 'male' ? maleFallBackImg : femaleFallBackImg}
                            width={200}
                        />
                    }
                />



                <ListTile label='Name' value={customer?.full_name} />
                <ListTile label='Date of Birth' value={formatDate(customer?.birthdate)} />
                <ListTile label='Gender' value={customer?.gender} />
            </div>

            {/* Details */}
            <div className="p-6 space-y-8">
                {/* Contact Info */}




                <section>

                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                        <User className="w-5 h-5 text-blue-500" />
                        <span>Contact Information</span>
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-3">
                        <InfoCard icon={<Mail />} label="Email" value={customer.email as string} />
                        <InfoCard
                            icon={<Phone />}
                            label="Primary Phone"
                            value={customer.phone_full}
                        />

                        <InfoCard
                            icon={<Phone />}
                            label="Secondary Phone"
                            value={customer.alternate_phone_full as string}
                        />
                    </div>
                </section>

                {/* Additional Info */}
                <section>
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                        <MapPin className="w-5 h-5 text-green-500" />
                        <span>Additional Information</span>
                    </h2>
                    <div className="space-y-3">
                        {customer.address && (
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <p className="text-sm text-gray-500 mb-1">Address</p>
                                <p className="text-gray-900">{customer.address}</p>
                            </div>
                        )}
                        <div className="grid sm:grid-cols-2 gap-3">
                            <Field label="First Name" value={customer.firstname} />
                            {customer.othernames && (
                                <Field label="Other Names" value={customer.othernames} />
                            )}
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                            <Field label="Created" value={formatDate(customer.created_at)} />
                            <Field label="Last Updated" value={formatDate(customer.updated_at)} />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

const InfoCard = ({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value?: string;
}) => (
    <div className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg border border-gray-100">
        <div className="text-gray-500 w-5 h-5">{icon}</div>
        <div className="min-w-0 flex-1">
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-gray-900 font-medium truncate">{value || '-'}</p>
        </div>
    </div>
);

const Field = ({ label, value }: { label: string; value: string }) => (
    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-gray-900 font-medium">{value}</p>
    </div>
);

export default CustomerBasicInfo;
