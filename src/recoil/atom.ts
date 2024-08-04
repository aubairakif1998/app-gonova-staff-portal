import { atom, selector } from 'recoil';
import { Shipper } from '@/Interfaces/Shipper';
import { fetchAllShippers, Shipment, fetchShipmentsByShipperId } from '@/services/shipperService';
import { fetchCarriers_POST, } from '@/services/carrierService';
import { Carrier } from "@/Interfaces/carrier"


export const selectedShipperState = atom<Shipper | null>({
    key: 'selectedShipperState',
    default: null,
});

export const shipperListState = selector({
    key: 'shipperListState',
    get: async () => {
        const response = await fetchAllShippers();
        if (response.success) {
            return response.shippers;
        }
        return [];
    },

});

export const selectedShipmentState = atom<Shipment | null>({
    key: 'selectedShipmentState',
    default: null,
});

export const shipmentListState = selector({
    key: 'shipmentListState',
    get: async ({ get }) => {
        const shipper = get(selectedShipperState);
        if (!shipper) return [];
        const response = await fetchShipmentsByShipperId(shipper._id);
        if (response.success) {
            return response.shipments;
        }
        return [];
    },
});


export const selectedCarrierState = atom<Carrier | null>({
    key: 'selectedCarrierState',
    default: null,
});

export const carrierListState = selector({
    key: 'carrierListState',
    get: async () => {
        const response = await fetchCarriers_POST();
        if (response.success) {
            return response.carriers;
        }
        return [];
    },
});
