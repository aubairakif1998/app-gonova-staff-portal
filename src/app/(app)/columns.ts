"use client"

import { ColumnDef } from "@tanstack/react-table"
export interface Quote {
    ProductId: number;
    ProductName: string;
    CarrierName: string;
    PickupLocation: string;
    DropoffLocation: string;
    Status: string;
}

export const columns: ColumnDef<Quote>[] = [
    {
        accessorKey: "ProductId",
        header: "QuoteID",
    },
    {
        accessorKey: "ProductName",
        header: "ProductName",
    },
    {
        accessorKey: "CarrierName",
        header: "CarrierName",
    },
    {
        accessorKey: "PickupLocation",
        header: "PickupLocation",
    },
    {
        accessorKey: "DropoffLocation",
        header: "DropoffLocation",
    },
    {
        accessorKey: "Status",
        header: "Status",
    },
]
