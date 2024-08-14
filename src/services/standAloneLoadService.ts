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
            throw new Error(data.message || 'Error fetching data');
        }
        return {
            success: true,
            standAloneLoad: data.standAloneLoad,
            carrier: data.carrier,
            shipper: data.shipper
        };
    } catch (error) {
        console.error('Error fetching load data:', error);
        return {
            success: false,
            standAloneLoad: null,
            carrier: null,
            shipper: null,
            message: 'Error while fetching StandAlone Load data'
        };
    }
}
export async function updateStandAloneLoad(id: string | string[], updatedFields: Partial<any>) {
    try {
        const response = await fetch(`/api/update-standalone-load/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedFields),
        });
        if (!response.ok) {
            const errorText = await response.text(); // Get the raw response text
            throw new Error(`Network error: ${errorText}`);
        }
        const contentType = response.headers.get('Content-Type');
        if (!contentType || !contentType.includes('application/json')) {
            const errorText = await response.text(); // Get the raw response text
            throw new Error(`Unexpected response format: ${errorText}`);
        }
        const data = await response.json();
        if (!data.success) {
            throw new Error(data.message || 'Failed to update StandAloneLoad');
        }
        return { success: true, standAloneLoad: data.standAloneLoad };
    } catch (error) {
        console.error('Error updating StandAloneLoad:', error);
        const message = 'An unexpected error occurred while updating StandAloneLoad.';
        return { success: false, message };
    }
}


export async function deleteStandAloneLoad(id: string | string[]) {
    try {

        if (Array.isArray(id)) {
            id = id[0];
        }
        const response = await fetch(`/api/get-standalone-load/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // if (!response.ok) {
        //     const errorText = await response.text();  
        //     throw new Error(`Network error: ${errorText}`);
        // } 
        // const contentType = response.headers.get('Content-Type');
        // if (!contentType || !contentType.includes('application/json')) {
        //     const errorText = await response.text(); // Get the raw response text
        //     throw new Error(`Unexpected response format: ${errorText}`);
        // }
        const data = await response.json();
        console.log("data", data)
        if (!data.success) {
            throw new Error(data.message || 'Failed to delete StandAloneLoad');
        }

        return { success: true, message: 'StandAlone Load deleted successfully!' };
    } catch (error) {
        console.error('Error deleting StandAloneLoad:', error);
        const message = 'An unexpected error occurred while deleting StandAloneLoad.';
        return { success: false, message };
    }
}
