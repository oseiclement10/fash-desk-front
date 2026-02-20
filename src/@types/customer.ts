import type { CommonModel } from "./common";
import type { OrderItem } from "./orders";


export interface MaleMeasurement {
    neck: number;
    chest: number;
    waist: number;
    hip: number;
    thigh: number;
    knee: number;
    ankle: number;
    waist_to_knee: number;
    short_sleeve: number;
    short: number;
    bicep: number;
    wrist: number;
    across_back: number;
    top_length: number;
    trouser_length: number;
    sleeve_length: number;
}


export interface FemaleMeasurement {
    bust: number;
    waist: number;
    thighs?: number;
    knee?: number;
    bass?: number;
    hip?: number;
    accross_back: number;
    bicep_up: number;
    bicep_down: number;
    armsyce: number;
    cuff: number;
    short_sleeve: number;
    three_quaters: number;
    long_sleeve: number;
    shoulder_to_bust: number;
    shoulder_to_under_bust: number;
    shoulder_to_high_waist: number;
    shoulder_to_low_waist: number;
    top_length: number;
    shoulder_to_hip: number;
    shoulder_to_knee: number;
    short_dress: number;
    mid_dress: number;
    long_dress: number;
    gown_length: number;
    slit_length: number;
    waist_to_hip: number;
    waist_to_knee: number;
    trouser_length: number;
}

export type CustomerDetails = Customer;


export interface Customer extends CommonModel {
    full_name: string;
    firstname: string;
    othernames: string | null;
    email: string | null;
    gender: "male" | "female";
    birthdate: string;
    phone_code: string;
    phone_number: string;
    phone_full: string;
    secondary_phone_code?: string | null;
    secondary_phone_number?: string | null;
    secondary_phone_full?: string | null;
    alternate_phone_code?: string | null;
    alternate_phone_number?: string | null;
    alternate_phone_full?: string | null;
    address?: string | null;
    occupation?: string | null;
    image?: string | null;
    created_at: string;
    updated_at: string;
    measurement: MaleMeasurement | FemaleMeasurement,
    orders?: OrderItem[],
};


