interface Contact {
    email: string;
    phone: string;
    workingHours: string;
}
interface VehicleInformation {
    truckNumber: string;
    driverName: string;
    driverContactNo: string;
}
export interface Carrier {
    _id: string;
    companyName: string;
    transportMCNumber: string;
    dot: string;
    contacts: {
        primary: Contact;
        secondary: Contact;
    };
    address: string;
    vehicleInformation: VehicleInformation;
    assignedLoads: string[];
}

export interface FetchCarriersResponse {
    success: boolean;
    carriers: Carrier[];
    totalPages: number;
}

export const fetchCarriers = async (
    page: number,
    companyName: string,
    email: string,
    dot: string,
    transportMCNumber: string
): Promise<FetchCarriersResponse> => {
    try {
        const response = await fetch(`/api/get-carriers?page=${page}&limit=10&companyName=${companyName}&email=${email}&dot=${dot}&transportMCNumber=${transportMCNumber}`);
        const data = await response.json();
        console.log(data)
        return {
            success: data.success,
            carriers: data.carriers,
            totalPages: data.totalPages
        };
    } catch (error) {
        console.error('Error fetching carriers:', error);
        return {
            success: false,
            carriers: [],
            totalPages: 0
        };
    }
};