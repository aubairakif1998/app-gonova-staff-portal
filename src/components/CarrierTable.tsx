"use client"

import React from 'react';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Carrier } from '@/services/carrierService';

interface CarrierTableProps {
    carriers: Carrier[];
    onViewCarriers: (carrierId: string) => void;
    pageCount: number;
}

const CarrierTable: React.FC<CarrierTableProps> = ({ carriers, onViewCarriers, pageCount }) => {
    const columns: ColumnDef<Carrier>[] = [

        {
            accessorKey: 'companyName',
            header: 'Company Name',
            cell: info => info.getValue(),
        },
        {
            accessorKey: 'contacts.primary.email',
            header: 'Primary Email',
            cell: info => info.getValue(),
        },
        {
            accessorKey: 'contacts.primary.phone',
            header: 'Primary Phone',
            cell: info => info.getValue(),
        },
        {
            accessorKey: 'dot',
            header: 'DOT',
            cell: info => info.getValue(),
        },
        {
            accessorKey: 'transportMCNumber',
            header: 'MC Number',
            cell: info => info.getValue(),
        },
        {
            accessorKey: 'contacts.primary.workingHours',
            header: 'Working Hours',
            cell: info => info.getValue(),
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <Button className="bg-black text-white hover:bg-gray-600" onClick={() => onViewCarriers(row.original._id)}>View Carrier</Button>
            ),
        },
    ];

    const table = useReactTable({
        data: carriers,
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
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="font-semibold text-gray-700 text-center">
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} className="hover:bg-gray-50">
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="py-4 px-6 text-center">
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
        </div>
    );
};

export default CarrierTable;
