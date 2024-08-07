export interface StandAloneLoad {
    _id: string;
    pickupDate: string;
    dropOffDate: string;
    pickupLocation: string;
    deliveryLocation: string;
    serviceType: string;
    loadContainAlcohol: boolean;
    hazardousMaterial: boolean;
    itemDescription: string;
    packaging: "Pallet" | "Box" | "Crate" | "Bundle" | "Drum" | "Roll" | "Bale";
    dimensions: {
        length: number;
        width: number;
        height: number;
    };
    weight: number;
    quantity: number;
    shipmentRequirement: string;
    supportedDocuments: string[];
    latestLocationOfLoad?: {
        type: 'Point';
        coordinates: [number, number];
    } | null;
    status: "Carrier not assigned" | "Upcoming" | "InTransit" | "Completed" | "Cancelled";
    shipperCompanyName: string;
    assignedCarrierMC?: string;
    agentStaffMemberId: string;
    createdBy: string;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}
