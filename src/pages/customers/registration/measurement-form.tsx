import { FormConfig, FormHeader } from "@/components/crud/form-config"
import { Ruler } from "lucide-react"
import MaleForm from "./male-form"
import FemaleForm from "./female-form"
import type { Customer, FemaleMeasurement, MaleMeasurement } from "@/@types/customer"

export type MeasurementFormProps = {
    onSuccess: (resp: Customer) => void;
    onBack: () => void;
    gender: "male" | "female";
    measurementInfo?: MaleMeasurement | FemaleMeasurement;
    inEditMode?: boolean;
    customerId?: number;
}

const MeasurementForm = ({ gender, measurementInfo, inEditMode = false, customerId, onSuccess, onBack, }: MeasurementFormProps) => {
    return (
        <div>
            <FormHeader>
                {inEditMode ? "Update" : "Enter"}  Measurements <Ruler className="ml-2" />
            </FormHeader>
            <FormConfig className="px-0! md:px-2!" >
                {gender == "male" ? <MaleForm customerId={customerId} gender={gender} inEditMode={inEditMode} onSuccess={onSuccess} measurementInfo={measurementInfo} onBack={onBack} /> :
                    <FemaleForm gender={gender} customerId={customerId} inEditMode={inEditMode} onSuccess={onSuccess} measurementInfo={measurementInfo} onBack={onBack} />
                }
            </FormConfig>

        </div>
    )
}

export default MeasurementForm