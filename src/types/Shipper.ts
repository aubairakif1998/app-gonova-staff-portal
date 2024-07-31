
export interface Shipper {
    _id: string;
    companyName: string;
    locationAddress?: string;
    city?: string;
    zip?: string;
    email?: string;
    isVerified?: boolean;
    phoneNumber?: string;
    shipments?: string[];
}