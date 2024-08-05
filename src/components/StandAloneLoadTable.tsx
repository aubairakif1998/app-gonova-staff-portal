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
    DropdownMenuCheckboxItem,
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

interface StandAloneLoadTableProps {
    loads: Load[];
    onViewLoads: (LoadId: string) => void;
    pageCount: number;
}

const StandAloneLoadTable: React.FC<StandAloneLoadTableProps> = ({ loads, onViewLoads, pageCount }) => {
    const columns: ColumnDef<Load>[] = [
        {
            accessorKey: "_id",
            header: "LoadId",
            cell: ({ row }) => <div>{row.getValue("_id")}</div>,
            enableSorting: true,
        },
        {
            accessorKey: "shipmentRefId",
            header: "ShipmentId",
            cell: ({ row }) => <div>{row.getValue("shipmentRefId")}</div>,
            enableSorting: true,
        },
        {
            accessorKey: "assignedCarrierMC",
            header: "Carrier MC",
            cell: ({ row }) => <div>{row.getValue("assignedCarrierMC")}</div>,
            enableSorting: true,
        },
        {
            accessorKey: "pickupDate",
            header: "Pickup Date",
            cell: ({ row }) => <div>{format(new Date(row.getValue("pickupDate")), 'MM/dd/yyyy')}</div>,
            enableSorting: true,
        },
        {
            accessorKey: "dropOffDate",
            header: "Drop Off Date",
            cell: ({ row }) => <div>{format(new Date(row.getValue("dropOffDate")), 'MM/dd/yyyy')}</div>,
            enableSorting: true,
        },
        {
            accessorKey: "pickupLocation",
            header: "Pickup Location",
            cell: ({ row }) => <div>{row.getValue("pickupLocation")}</div>,
            enableSorting: true,
        },
        {
            accessorKey: "deliveryLocation",
            header: "Delivery Location",
            cell: ({ row }) => <div>{row.getValue("deliveryLocation")}</div>,
            enableSorting: true,
        },
        {
            accessorKey: "createdAt",
            header: "Created At",
            cell: ({ row }) => <div>{format(new Date(row.getValue("createdAt")), 'MM/dd/yyyy')}</div>,
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

                return <div className={`px-2 py-1 rounded ${statusClass}`}><div>{row.getValue("status")}</div></div>;
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
                                onClick={() => onViewLoads(transaction._id)}
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
        data: loads,
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
        <div className="overflow-hidden">
            <>hell world</>
        </div>
    );
};

export default StandAloneLoadTable;
