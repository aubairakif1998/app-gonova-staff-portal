export interface Shipment {
    _id: string;
    shipmentID: string;
    userId: string;
    serviceType: string;
    requestingLoadingDate: string;
    arrivalDate: string;
    pickupLocation: string;
    deliveryLocation: string;
    shipmentContainAlcohol: boolean;
    hazardousMaterial: boolean;
    itemDescription: string;
    packaging: "Pallet" | "Box" | "Crate" | "Bundle" | "Drum" | "Roll" | "Bale";
    dimensions: {
        length: number;
        width: number;
        height: number;
    };
    status: string;
    weight: number;
    loads: []
    quantity: number;
    contracts: [];
}