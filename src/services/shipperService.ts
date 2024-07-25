// services/shipperService.ts
export interface Shipper {
    _id: string;
    companyName: string;
    email: string;
}

export interface FetchShippersResponse {
    success: boolean;
    shippers: Shipper[];
    totalPages: number;
}
export interface Shipment {
    _id: string;
    shipmentID: string;
    userId: string;
    serviceType: string;
    requestingLoadingDate: string;
    arrivalDate: string;
    pickupLocationPostalCode: string;
    deliveryLocationPostalCode: string;
    shipmentContainAlcohol: boolean;
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
    contracts: [];
}
export const fetchShipperDetails = async (shipperId: string | string[]) => {
    try {
        // Ensure shipperId is a string
        const id = Array.isArray(shipperId) ? shipperId[0] : shipperId;
        const response = await fetch(`/api/get-shippers/${id}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching shipper details:', error);
        return { success: false, shipper: null, shipments: [] };
    }
};


// export const fetchShippers = async (page: number = 1, companyName?: string, email?: string, limit: number = 10): Promise<FetchShippersResponse> => {
//     const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
//     if (companyName) params.append('companyName', companyName);
//     if (email) params.append('email', email);

//     const response = await fetch(`/api/get-shippers?${params.toString()}`);
//     const data = await response.json();
//     return data;
// };

// In your fetchShippers function in shipperService.ts
export const fetchShippers = async (page: number, companyName: string, email: string) => {
    try {
        const response = await fetch(`/api/get-shippers?page=${page}&limit=10&companyName=${companyName}&email=${email}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching shippers:', error);
        return { success: false, shippers: [], totalPages: 0 };
    }
};
