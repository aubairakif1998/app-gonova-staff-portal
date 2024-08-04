import { Load } from "@/Interfaces/Load";

export interface FetchLoadsResponse {
    success: boolean;
    loads: Load[];
    totalPages: number;
}

export const fetchLoads = async (
    page: number,
    shipmentRefId: string,
    assignedCarrierMC: string,
    statuses: string[],
): Promise<FetchLoadsResponse> => {
    try {
        const statusQuery = statuses.length ? statuses.join(',') : '';
        const response = await fetch(`/api/get-loads?page=${page}&limit=10&shipmentRefId=${shipmentRefId}&assignedCarrierMC=${assignedCarrierMC}&status=${statusQuery}`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: FetchLoadsResponse = await response.json();
        console.log(data);

        return data;
    } catch (error) {
        console.error('Error fetching loads:', error);
        return {
            success: false,
            loads: [],
            totalPages: 0
        };
    }
};
