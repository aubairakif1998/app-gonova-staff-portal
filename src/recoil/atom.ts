import { atom, selector } from 'recoil';
import { Shipper } from '@/types/Shipper';

export const selectedShipperState = atom<Shipper | null>({
    key: 'selectedShipperState',
    default: null,
});

// Define other atoms similarly


// // Define other atoms similarly

// export const selectedShipperState = atom<string>({
//     key: 'selectedShipperState',
//     default: '',
// });

export const selectedShipmentState = atom<string>({
    key: 'selectedShipmentState',
    default: '',
});

export const selectedCarrierState = atom<string>({
    key: 'selectedCarrierState',
    default: '',
});

export const shippersState = selector({
    key: 'shippersState',
    get: async () => {
        const response = await fetch('/api/get-shippers');
        const data = await response.json();
        return data;
    },
});

export const shipmentsState = selector({
    key: 'shipmentsState',
    get: async ({ get }) => {
        const selectedShipper = get(selectedShipperState);
        if (!selectedShipper) return [];
        const response = await fetch(`/api/shipments?shipperId=${selectedShipper}`);
        const data = await response.json();
        return data;
    },
});

export const carrierCompaniesState = selector({
    key: 'carrierCompaniesState',
    get: async ({ get }) => {
        const selectedShipment = get(selectedShipmentState);
        if (!selectedShipment) return [];
        const response = await fetch(`/api/carrierCompanies?shipmentId=${selectedShipment}`);
        const data = await response.json();
        return data;
    },
});
