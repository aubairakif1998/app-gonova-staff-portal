export const products: Quote[] = [
    {
        ProductId: 1,
        ProductName: 'Product A',
        CarrierName: 'Carrier X',
        PickupLocation: 'Location A',
        DropoffLocation: 'Location B',
        Status: 'Pending',
    },
    {
        ProductId: 2,
        ProductName: 'Product B',
        CarrierName: 'Carrier Y',
        PickupLocation: 'Location C',
        DropoffLocation: 'Location D',
        Status: 'Delivered',
    },
    {
        ProductId: 3,
        ProductName: 'Product C',
        CarrierName: 'Carrier Z',
        PickupLocation: 'Location E',
        DropoffLocation: 'Location F',
        Status: 'Shipped',
    },
    {
        ProductId: 4,
        ProductName: 'Product D',
        CarrierName: 'Carrier X',
        PickupLocation: 'Location G',
        DropoffLocation: 'Location H',
        Status: 'Pending',
    },
    {
        ProductId: 5,
        ProductName: 'Product E',
        CarrierName: 'Carrier Z',
        PickupLocation: 'Location I',
        DropoffLocation: 'Location J',
        Status: 'Delivered',
    },
    {
        ProductId: 6,
        ProductName: 'Product F',
        CarrierName: 'Carrier Y',
        PickupLocation: 'Location K',
        DropoffLocation: 'Location L',
        Status: 'Shipped',
    },
];
export interface Quote {
    ProductId: number;
    ProductName: string;
    CarrierName: string;
    PickupLocation: string;
    DropoffLocation: string;
    Status: string;
}

