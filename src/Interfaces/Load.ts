export interface Load {
    loadId: string;
    pickupDate: string;
    dropOffDate: string;
    pickupLocation: string;
    deliveryLocation: string;
    shipmentRequirement: string;
    supportedDocuments: string[];
    latestLocationOfLoad?: {
        type: 'Point';
        coordinates: [number, number];
    } | null;
    status: string;
    shipmentRefId: string;
    assignedCarrierMC: string;
    agentStaffMemberId: string;
    createdBy: string;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}
