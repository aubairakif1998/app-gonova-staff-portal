import { Load } from "@/Interfaces/Load";
import { StandAloneLoad } from "@/Interfaces/StandAloneLoad";

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


export interface FetchStandAloneLoadsResponse {
    success: boolean;
    loads: StandAloneLoad[];
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
            loads: [],
            totalPages: 0
        };
    }
};

export async function fetchLoadById(lid: string | string[]) {
    try {
        const id = Array.isArray(lid) ? lid[0] : lid;
        const response = await fetch(`/api/get-loads/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch load data');
        }
        const data = await response.json();
        if (!data.success) {
            throw new Error(data.message || 'a Error fetching data');
        }
        return { success: true, data: data.load };
    } catch (error) {
        console.error('Error fetching load data:', error);
        return { success: false, data: null, message: `404 Load not found` };
    }
}


