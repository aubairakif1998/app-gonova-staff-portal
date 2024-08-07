import { StandAloneLoad } from "@/Interfaces/StandAloneLoad";
export interface FetchStandAloneLoadsResponse {
    success: boolean;
    standAloneloads: StandAloneLoad[];
    totalPages: number;
}
export const fetchStandAloneLoads = async (
    page: number,
    shipperCompanyName: string,
    assignedCarrierMC: string,
    statuses: string[],
): Promise<FetchStandAloneLoadsResponse> => {
    try {
        const statusQuery = statuses.length ? statuses.join(',') : '';
        const response = await fetch(`/api/get-standalone-load?page=${page}&limit=10&shipperCompanyName=${shipperCompanyName}&assignedCarrierMC=${assignedCarrierMC}&status=${statusQuery}`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: FetchStandAloneLoadsResponse = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching loads:', error);
        return {
            success: false,
            standAloneloads: [],
            totalPages: 0
        };
    }
};
