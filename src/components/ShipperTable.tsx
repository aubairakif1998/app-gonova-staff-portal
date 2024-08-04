"use client"

import React from 'react';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Shipper } from '@/Interfaces/Shipper';

interface ShipperTableProps {
    shippers: Shipper[];
    onViewShipper: (shipperId: string) => void;
    // onEditShipper: (shipperId: string) => void;
    pageCount: number;
}

const ShipperTable: React.FC<ShipperTableProps> = ({ shippers, onViewShipper, pageCount }) => {
    const columns: ColumnDef<Shipper>[] = [
        {
            accessorKey: 'companyName',
            header: 'Company Name',
            cell: info => info.getValue(),
        },
        {
            accessorKey: 'email',
            header: 'Email',
            cell: info => info.getValue(),
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <>
                    <Button className="bg-black text-white hover:bg-gray-600" onClick={() => onViewShipper(row.original._id)}>View</Button>

                    {/* <Button className="bg-black text-white hover:bg-gray-600" onClick={() => onEditShipper(row.original._id)}>Edit</Button> */}

                </>),
        },
    ];

    const table = useReactTable({
        data: shippers,
        columns,
        pageCount,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
    });

    return (
        <div>
            <div className="rounded-md border bg-white shadow-lg">
                <Table>

                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="bg-gray-50 border-b">
                                {headerGroup.headers.map((header) => (
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
                            table.getRowModel().rows.map((row) => (
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
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* <div className="flex items-center justify-between space-x-2 py-4">
                <div>
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </div>
                <div className="space-x-2">
                    <Button variant='outline' size='sm' onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</Button>
                    <Button variant='outline' size='sm' onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
                </div>
            </div> */}
        </div>
    );
};

export default ShipperTable;
