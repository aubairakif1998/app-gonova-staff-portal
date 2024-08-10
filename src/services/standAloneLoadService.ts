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





export async function fetchStandAloneLoadById(Stlid: string | string[]) {
    try {
        const id = Array.isArray(Stlid) ? Stlid[0] : Stlid;
        const response = await fetch(`/api/get-standalone-load/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch load data');
        }
        const data = await response.json();
        if (!data.success) {
            throw new Error(data.message || 'a Error fetching data');
        }
        return { success: true, data: data.standAloneLoad };
    } catch (error) {
        console.error('Error fetching load data:', error);
        return { success: false, data: null, message: `404 Standalone Load not found` };
    }


}
