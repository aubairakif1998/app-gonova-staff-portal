import { Carrier } from "@/Interfaces/carrier";



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

export const fetchCarriers_POST = async () => {
    try {
        const response = await fetch(`/api/get-carriers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const data = await response.json();
        console.log(data);
        return {
            success: data.success,
            carriers: data.carriers
        };
    } catch (error) {
        console.error('Error fetching carriers:', error);
        return {
            success: false,
            carriers: [],
        };
    }
};


