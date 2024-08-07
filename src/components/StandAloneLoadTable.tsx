"use client"
import {
    CaretSortIcon,
    ChevronDownIcon,
    DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import React from 'react';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
    SortingState
} from "@tanstack/react-table";
import { format } from 'date-fns';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Load } from '@/Interfaces/Load';
import { StandAloneLoad } from "@/Interfaces/StandAloneLoad";

interface StandAloneLoadTableProps {
    standAloneloads: StandAloneLoad[];
    onViewstandAloneLoads: (LoadId: string) => void;
    pageCount: number;
}

const StandAloneLoadTable: React.FC<StandAloneLoadTableProps> = ({ standAloneloads, onViewstandAloneLoads, pageCount }) => {
    const handleCellClick = (value: string) => {
        navigator.clipboard.writeText(value)
            .then(() => { })
            .catch((err) => console.error('Failed to copy text: ', err));
    };

    const columns: ColumnDef<StandAloneLoad>[] = [
        {
            accessorKey: "_id",
            header: "LoadId",
            cell: ({ row }) => <div onClick={() => handleCellClick(row.getValue("_id"))}>{row.getValue("_id")}</div>,
            enableSorting: true,
        },
        {
            accessorKey: "shipperCompanyName",
            header: "Shipper Company Name",
            cell: ({ row }) => <div onClick={() => handleCellClick(row.getValue("shipperCompanyName"))}>{row.getValue("shipperCompanyName")}</div>,
            enableSorting: true,
        },
        {
            accessorKey: "assignedCarrierMC",
            header: "Carrier MC",
            cell: ({ row }) => <div onClick={() => handleCellClick(row.getValue("assignedCarrierMC"))}>{row.getValue("assignedCarrierMC")}</div>,
            enableSorting: true,
        },
        {
            accessorKey: "pickupDate",
            header: "Pickup Date",
            cell: ({ row }) => <div className="underline " onClick={() => handleCellClick(format(new Date(row.getValue("pickupDate")), 'MM/dd/yyyy'))}>{format(new Date(row.getValue("pickupDate")), 'MM/dd/yyyy')}</div>,
            enableSorting: true,
        },
        {
            accessorKey: "dropOffDate",
            header: "Drop Off Date",
            cell: ({ row }) => <div className="underline " onClick={() => handleCellClick(format(new Date(row.getValue("dropOffDate")), 'MM/dd/yyyy'))}>{format(new Date(row.getValue("dropOffDate")), 'MM/dd/yyyy')}</div>,
            enableSorting: true,
        },
        {
            accessorKey: "pickupLocation",
            header: "Pickup Location",
            cell: ({ row }) => <div onClick={() => handleCellClick(row.getValue("pickupLocation"))}>{row.getValue("pickupLocation")}</div>,
            enableSorting: true,
        },
        {
            accessorKey: "deliveryLocation",
            header: "Delivery Location",
            cell: ({ row }) => <div onClick={() => handleCellClick(row.getValue("deliveryLocation"))}>{row.getValue("deliveryLocation")}</div>,
            enableSorting: true,
        },
        {
            accessorKey: "createdAt",
            header: "Created At",
            cell: ({ row }) => <div onClick={() => handleCellClick(format(new Date(row.getValue("createdAt")), 'MM/dd/yyyy'))}>{format(new Date(row.getValue("createdAt")), 'MM/dd/yyyy')}</div>,
            enableSorting: true,
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status");
                let statusClass = "";

                switch (status) {
                    case "Upcoming":
                        statusClass = "bg-gray-200 text-gray-700";
                        break;

                    case "Carrier not assigned":
                        statusClass = "bg-gray-300 text-gray-700";
                        break;

                    case "InTransit":
                        statusClass = "bg-blue-200 text-blue-700";
                        break;
                    case "Completed":
                        statusClass = "bg-green-200 text-green-700";
                        break;
                    case "Cancelled":
                        statusClass = "bg-red-200 text-red-700";
                        break;
                    default:
                        statusClass = "bg-gray-200 text-gray-700";
                        break;
                }

                return <div className={`px-2 py-1 rounded ${statusClass}`} onClick={() => handleCellClick(row.getValue("status"))}>{row.getValue("status")}</div>;
            },
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const transaction = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <DotsHorizontalIcon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(transaction._id)}
                            >
                                Copy transaction ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => onViewstandAloneLoads(transaction._id)}
                            >
                                View details
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const initialSorting: SortingState = [
        {
            id: "createdAt",
            desc: false,
        },
    ];

    const table = useReactTable({
        data: standAloneloads,
        columns,
        pageCount,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
        state: {
            sorting: initialSorting,
        },
        onSortingChange: (sorting) => {
            // Handle sorting change if needed
        },
    });

    return (
        <div className="grid grid-cols-1 text-sm">
            <div className="overflow-hidden">
                <div className="rounded-md border bg-white shadow-lg">
                    <div className="max-h-[calc(10*3.5rem)] overflow-y-auto">
                        <Table className="border-collapse min-w-full">
                            <TableHeader className="border-b-2">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead
                                                key={header.id}
                                                className="py-1 px-2 font-semibold text-red-700  text-xsm  text-center border-r-2 last:border-r-0"
                                            >
                                                {header.isPlaceholder ? null : (
                                                    <>
                                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                                    </>
                                                )}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id} className="hover:bg-gray-50 border-b-2">
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id} className="px-1 text-center border-r-2 last:border-r-0">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="text-center border-r-2 last:border-r-0">
                                            No results.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StandAloneLoadTable;
