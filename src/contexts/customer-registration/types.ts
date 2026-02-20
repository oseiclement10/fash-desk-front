import type { Customer } from "@/@types/customer";
import type { FemaleMeasurement, MaleMeasurement } from "@/@types/customer";

export type CustomerCreationStep =
    | "customer-info"
    | "measurements"
    | "success";

export interface NumberVerificationData {
    phone_number: string;
    phone_code: string;
    isGeneralCustomer?: boolean;
    existsWithinBusiness: boolean;
}

export type CustomerInfoData = Omit<Customer, "primary_business" | "created_at" | "updated_at" | "id"> & { id?: number };

export type MeasurementsData = MaleMeasurement | FemaleMeasurement;

export interface CustomerCreationData {
    customerInfo?: CustomerInfoData;
    measurements?: MeasurementsData;
}


export type PhoneVerificationResponse = {
    customer?: Omit<Customer, "primary_business">;
    isGeneralCustomer: boolean;
    existsWithinBusiness: boolean;
} & NumberVerificationData


