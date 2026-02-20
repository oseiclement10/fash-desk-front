import type {  Customer, FemaleMeasurement, MaleMeasurement } from "@/@types/customer";
import { Modal } from "antd";
import { AiOutlineEdit } from "react-icons/ai";
import MeasurementForm from "../registration/measurement-form";
import { useModalProps } from "@/hooks/use-modal";
import { hasPermission } from "@/utils/auth";
import { permissions } from "@/config/permissions";

type CustomerDetails = {
    customer: Customer;
}

interface MeasurementProps extends CustomerDetails {
    onEditSucccess?: (val?: any) => void;
    isOrderPreview?: boolean;
}

const Measurement = ({
    customer,
    onEditSucccess,
    isOrderPreview = false,
}: MeasurementProps) => {
    const { closeModal, modalOpen, updateModal } = useModalProps<Customer>();
    const isMaleCustomer = customer?.gender === "male";

    const handleCustomerUpdate = (resp?: any) => {
        onEditSucccess?.(resp);
        closeModal();
    };

    if (!customer) return <p className="italic text-gray-600">Measurement not found!</p>

    return (
        <section
            className={`bg-white rounded-lg  border border-gray-200 overflow-hidden ${isOrderPreview ? "p-3" : "shadow-sm"
                }`}
        >
            <div
                className={`flex flex-col md:flex-row md:items-center md:justify-between px-6 border-b border-gray-200 bg-linear-to-r from-gray-50 to-gray-100 ${isOrderPreview ? "py-2" : "py-4"
                    }`}
            >
                {!isOrderPreview && (
                    <h2 className="text-xl mb-2 md:mb-0 font-bold text-gray-800">Measurement Details</h2>
                )}
                {hasPermission(permissions.updateCustomer) && (
                    <button
                        className={`flex items-center gap-2 md:ml-auto font-medium text-emerald-700 bg-white border border-emerald-300 rounded-lg hover:bg-emerald-50 hover:border-emerald-400 active:scale-95 transition-all duration-200 shadow-sm ${isOrderPreview ? "px-4 py-1 text-sm" : "px-4 py-2 text-sm"
                            }`}
                        onClick={() => updateModal(customer, "edit")}
                    >
                        <AiOutlineEdit className="w-4 h-4" />
                        {isOrderPreview ? "Update" : "Update Measurements"}
                    </button>

                )}

            </div>



            {isMaleCustomer ? (
                <MaleMeasurementDetails customer={customer} isOrderPreview={isOrderPreview} />
            ) : (
                <FemaleMeasurementDetails customer={customer} isOrderPreview={isOrderPreview} />
            )}

            <Modal open={modalOpen?.open} width={700} onCancel={closeModal} footer={null}>
                <MeasurementForm
                    gender={modalOpen!.data?.gender as Customer["gender"]}
                    onBack={closeModal}
                    onSuccess={handleCustomerUpdate}
                    customerId={modalOpen?.data?.id}
                    inEditMode
                    measurementInfo={modalOpen?.data?.measurement}
                />
            </Modal>
        </section>
    );
};

const MaleMeasurementDetails = ({
    customer,
    isOrderPreview = false,
}: CustomerDetails & { isOrderPreview?: boolean }) => {
    const measurement = customer?.measurement as MaleMeasurement;

    const measurementGroups = [
        {
            title: "Upper Body",
            measurements: [
                { label: "Neck", value: measurement?.neck },
                { label: "Chest", value: measurement?.chest },
                { label: "Across Back", value: measurement?.across_back },
                { label: "Bicep", value: measurement?.bicep },
                { label: "Wrist", value: measurement?.wrist },
            ],
        },
        {
            title: "Lower Body",
            measurements: [
                { label: "Waist", value: measurement?.waist },
                { label: "Hip", value: measurement?.hip },
                { label: "Thigh", value: measurement?.thigh },
                { label: "Knee", value: measurement?.knee },
                { label: "Ankle", value: measurement?.ankle },
            ],
        },
        {
            title: "Lengths",
            measurements: [
                { label: "Waist To Knee", value: measurement?.waist_to_knee },
                { label: "Top Length", value: measurement?.top_length },
                { label: "Trouser Length", value: measurement?.trouser_length },
                { label: "Sleeve Length", value: measurement?.sleeve_length },
                { label: "Short Sleeve", value: measurement?.short_sleeve },
            ],
        },
    ];

    return (
        <section className={isOrderPreview ? "p-3" : "p-6"}>
            {isOrderPreview ? (
                <CompactMeasurements groups={measurementGroups} />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {measurementGroups.map((group) => (
                        <MeasurementGroup key={group.title} title={group.title} measurements={group.measurements} />
                    ))}
                </div>
            )}
        </section>
    );
};

const FemaleMeasurementDetails = ({
    customer,
    isOrderPreview = false,
}: CustomerDetails & { isOrderPreview?: boolean }) => {
    const measurement = customer?.measurement as FemaleMeasurement;

    const measurementGroups = [
        {
            title: "Body Measurements",
            measurements: [
                { label: "Bust", value: measurement?.bust },
                { label: "Waist", value: measurement?.waist },
                { label: "Hip", value: measurement?.hip },
                { label: "Thighs", value: measurement?.thighs },
                { label: "Knee", value: measurement?.knee },
                { label: "Bass", value: measurement?.bass },
                { label: "Across Back", value: measurement?.accross_back },
            ],
        },
        {
            title: "Arm & Sleeve",
            measurements: [
                { label: "Bicep Up", value: measurement?.bicep_up },
                { label: "Bicep Down", value: measurement?.bicep_down },
                { label: "ArmSyce", value: measurement?.armsyce },
                { label: "Cuff", value: measurement?.cuff },
                { label: "Short Sleeve", value: measurement?.short_sleeve },
                { label: "3/4 Sleeve", value: measurement?.three_quaters },
                { label: "Long Sleeve", value: measurement?.long_sleeve },
            ],
        },
        {
            title: "Lengths & Dresses",
            measurements: [
                { label: "Shoulder to Bust", value: measurement?.shoulder_to_bust },
                { label: "Shoulder to Under Bust", value: measurement?.shoulder_to_under_bust },
                { label: "Shoulder to High Waist", value: measurement?.shoulder_to_high_waist },
                { label: "Shoulder to Low Waist", value: measurement?.shoulder_to_low_waist },
                { label: "Top Length", value: measurement?.top_length },
                { label: "Shoulder to Hip", value: measurement?.shoulder_to_hip },
                { label: "Shoulder to Knee", value: measurement?.shoulder_to_knee },
                { label: "Short Dress", value: measurement?.short_dress },
                { label: "Mid Dress", value: measurement?.mid_dress },
                { label: "Long Dress", value: measurement?.long_dress },
                { label: "Gown Length", value: measurement?.gown_length },
                { label: "Slit Length", value: measurement?.slit_length },
                { label: "Waist to Hip", value: measurement?.waist_to_hip },
                { label: "Waist to Knee", value: measurement?.waist_to_knee },
                { label: "Trouser Length", value: measurement?.trouser_length },
            ],
        },
    ];

    return (
        <section className={isOrderPreview ? "p-3" : "p-6"}>
            {isOrderPreview ? (
                <CompactMeasurements groups={measurementGroups} />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {measurementGroups.map((group) => (
                        <MeasurementGroup key={group.title} title={group.title} measurements={group.measurements} />
                    ))}
                </div>
            )}
        </section>
    );
};

type MeasurementGroupProps = {
    title: string;
    measurements: Array<{ label: string; value: React.ReactNode }>;
};

const MeasurementGroup = ({ title, measurements }: MeasurementGroupProps) => (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-300">{title}</h3>
        <div className="space-y-3">
            {measurements.map((item) => (
                <MeasurementTile key={item.label} label={item.label} value={item.value} unit="inches" />
            ))}
        </div>
    </div>
);

type MeasurementTileProps = {
    label: string;
    value: React.ReactNode;
    unit?: string;
};

const MeasurementTile = ({ label, value, unit }: MeasurementTileProps) => {
    const hasValue = value !== undefined && value !== null && value !== "";

    return (
        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-emerald-300 transition-colors duration-200">
            <span className="text-sm font-medium text-gray-700 flex-1">{label}</span>
            <div className="flex items-center gap-2">
                <span className={`text-lg font-semibold ${hasValue ? "text-gray-900" : "text-gray-400"}`}>
                    {hasValue ? value : "n/a"}
                </span>
                {hasValue && unit && <span className="text-xs text-gray-500 font-normal">{unit}</span>}
            </div>
        </div>
    );
};


const CompactMeasurements = ({
    groups,
}: {
    groups: Array<{ title: string; measurements: Array<{ label: string; value: React.ReactNode }> }>;
}) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2 text-sm">
        {groups.flatMap((group) =>
            group.measurements.map((m) => (
                <div key={m.label} className="flex justify-between border-b border-gray-100 pb-1">
                    <span className="text-gray-600">{m.label}</span>
                    <span className="font-semibold text-gray-800">{m.value || "—"}</span>
                </div>
            ))
        )}
    </div>
);

export default Measurement;
