// components/ShipmentTable.tsx
"use client";

import React from 'react';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Shipment } from '@/services/shipperService';

interface ShipmentTableProps {
    shipments: Shipment[];
}

const ShipmentTable: React.FC<ShipmentTableProps> = ({ shipments }) => {
    const createLoad = (shipmentID: string) => {
        // Add your logic to create a load here
        console.log(`Creating load for shipment ID: ${shipmentID}`);
    };

    const columns: ColumnDef<Shipment>[] = [
        {
            accessorKey: 'shipmentID',
            header: 'ID',
        },
        {
            accessorKey: 'serviceType',
            header: 'Service Type',
        },
        {
            accessorKey: 'requestingLoadingDate',
            header: 'Loading Date',
            cell: info => new Date(info.getValue() as string).toLocaleDateString(),
        },
        {
            accessorKey: 'arrivalDate',
            header: 'Arrival Date',
            cell: info => new Date(info.getValue() as string).toLocaleDateString(),
        },
        {
            accessorKey: 'pickupLocation',
            header: 'Pickup Location',
        },
        {
            accessorKey: 'deliveryLocation',
            header: 'Delivery Location',
        },
        {
            accessorKey: 'shipmentContainAlcohol',
            header: 'Alcohol',
            cell: info => (info.getValue() ? "Yes" : "No"),
        },
        {
            accessorKey: 'hazardousMaterial',
            header: 'Hazardous Material',
            cell: info => (info.getValue() ? "Yes" : "No"),
        },
        {
            accessorKey: 'itemDescription',
            header: 'Item Description',
        },
        {
            accessorKey: 'packaging',
            header: 'Packaging',
        },
        {
            accessorKey: 'dimensions',
            header: 'Dimensions (L x W x H) inches',
            cell: info => {
                const { length, width, height } = info.getValue() as { length: number; width: number; height: number };
                return `${length} x ${width} x ${height}`;
            },
        },
        {
            accessorKey: 'weight',
            header: 'Weight (lbs)',
        },
        {
            accessorKey: 'quantity',
            header: 'Quantity',
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <Button size='sm' onClick={() => createLoad(row.original.shipmentID)}>
                    Create Load
                </Button>
            ),
        },
    ];

    const table = useReactTable({
        data: shipments,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
    });

    return (
        <div>
            <div className="rounded-md border bg-white shadow-lg">
                <Table className="min-w-full border border-gray-300 table-auto">

                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id} className="bg-gray-50 border-b">
                                {headerGroup.headers.map(header => (
                                    <TableHead
                                        key={header.id}
                                        className="font-semibold text-gray-700 text-center border-r last:border-r-0"
                                    >
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map(row => (
                                <TableRow key={row.id} className="hover:bg-gray-50 transition duration-200 border-b">
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell
                                            key={cell.id}
                                            className="py-4 px-6 text-center border-r last:border-r-0"
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="py-4 px-6 text-center">
                                    No shipments available.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between space-x-2 py-4">
                <div>
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </div>
                <div className="space-x-2">
                    <Button variant='outline' size='sm' onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</Button>
                    <Button variant='outline' size='sm' onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
                </div>
            </div>
        </div>
    );
};

export default ShipmentTable;
