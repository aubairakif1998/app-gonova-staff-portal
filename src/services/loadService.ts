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

// export interface FetchStandAloneLoadsResponse {
//     success: boolean;
//     loads: StandAloneLoad[];
//     totalPages: number;
// }
// export const fetchStandAloneLoads = async (
//     page: number,
//     shipperCompanyName: string,
//     assignedCarrierMC: string,
//     statuses: string[],
// ): Promise<FetchStandAloneLoadsResponse> => {
//     try {
//         const statusQuery = statuses.length ? statuses.join(',') : '';
//         const response = await fetch(`/api/get-standalone-load?page=${page}&limit=10&shipperCompanyName=${shipperCompanyName}&assignedCarrierMC=${assignedCarrierMC}&status=${statusQuery}`);

//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         const data: FetchStandAloneLoadsResponse = await response.json();
//         console.log(data);
//         return data;
//     } catch (error) {
//         console.error('Error fetching loads:', error);
//         return {
//             success: false,
//             loads: [],
//             totalPages: 0
//         };
//     }
// };


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
        return {
            success: true,
            load: data.load,
            carrier: data.carrier,
            shipment: data.shipment
        };
    } catch (error) {
        console.error('Error fetching Load data:', error);
        return {

            success: false,
            load: null,
            carrier: null,
            shipment: null,
            message: 'Error while fetching Load data'
        };
    }
}


export async function updateLoad(id: string | string[], updatedFields: Partial<any>) {
    try {
        const response = await fetch(`/api/get-loads/${id}`, {
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
            throw new Error(data.message || 'Failed to update Load');
        }
        return { success: true, load: data.load };
    } catch (error) {
        console.error('Error updating Load:', error);
        const message = 'An unexpected error occurred while updating Load.';
        return { success: false, message };
    }
}


export async function deleteAttachedDoc(loadId: string | string[], attachedDocUrl: string) {
    const response = await fetch(`/api/get-loads/${loadId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ attachedDocUrl }),
    });

    const data = await response.json();

    if (data.success) {
        return { "success": true, message: "deleted successfully" }
        // Handle success UI updates
    } else {
        return { "success": false, message: "deletion failed" }
        // Handle error UI updates
    }
}