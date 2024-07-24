"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
    CaretSortIcon,
    ChevronDownIcon,
    DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export type LoadTransaction = {
    id: string;
    arrivalDate: string;
    pickupdate: string;
    carrier: string;
    amount: number;
    loadStatus: "upcoming" | "pickedup" | "inprocess" | "delivered" | "paymentDone" | "completed";
    shipmentRequirement: string;
    lastKnownLocation: string;
};

const createColumns = (router: ReturnType<typeof useRouter>): ColumnDef<LoadTransaction>[] => [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value: any) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value: any) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => <div>{row.getValue("id")}</div>,
    },
    {
        accessorKey: "arrivalDate",
        header: "Arrival Date",
        cell: ({ row }) => <div>{row.getValue("arrivalDate")}</div>,
    },
    {
        accessorKey: "pickupdate",
        header: "Pickup Date",
        cell: ({ row }) => <div>{row.getValue("pickupdate")}</div>,
    },
    {
        accessorKey: "carrier",
        header: "Carrier",
        cell: ({ row }) => <div>{row.getValue("carrier")}</div>,
    },
    {
        accessorKey: "amount",
        header: () => <div className="text-right">Amount</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("amount"));
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount);
            return <div className="text-right font-medium">{formatted}</div>;
        },
    },
    {
        accessorKey: "loadStatus",
        header: "Load Status",
        cell: ({ row }) => <div>{row.getValue("loadStatus")}</div>,
    },
    {
        accessorKey: "shipmentRequirement",
        header: "Shipment Requirement",
        cell: ({ row }) => <div>{row.getValue("shipmentRequirement")}</div>,
    },
    {
        accessorKey: "lastKnownLocation",
        header: "Last Known Location",
        cell: ({ row }) => <div>{row.getValue("lastKnownLocation")}</div>,
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
                            onClick={() => navigator.clipboard.writeText(transaction.id)}
                        >
                            Copy transaction ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => router.push(`/loads/${transaction.id}`)}
                        >
                            View details
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

export default function ProductsPage({ searchParams }: { searchParams: { q: string; offset: string } }) {
    const router = useRouter();
    const columns = React.useMemo(() => createColumns(router), [router]);

    const [data, setData] = React.useState<LoadTransaction[]>([]);

    React.useEffect(() => {
        async function fetchData() {
            const fetchedData: LoadTransaction[] = [
                {
                    id: "m5gr84i9",
                    arrivalDate: "2027-04-9",
                    pickupdate: "2027-04-9",
                    carrier: "string",
                    amount: 123,
                    loadStatus: "pickedup",
                    shipmentRequirement: "non",
                    lastKnownLocation: "newyork",
                },
                {
                    id: "3u1reuv4",
                    arrivalDate: "2027-04-10",
                    pickupdate: "2027-04-10",
                    carrier: "example",
                    amount: 242,
                    loadStatus: "upcoming",
                    shipmentRequirement: "none",
                    lastKnownLocation: "losangeles",
                },
                {
                    id: "derv1ws0",
                    arrivalDate: "2027-04-11",
                    pickupdate: "2027-04-11",
                    carrier: "sample",
                    amount: 837,
                    loadStatus: "inprocess",
                    shipmentRequirement: "none",
                    lastKnownLocation: "chicago",
                },
                {
                    id: "5kma53ae",
                    arrivalDate: "2027-04-12",
                    pickupdate: "2027-04-12",
                    carrier: "test",
                    amount: 874,
                    loadStatus: "delivered",
                    shipmentRequirement: "none",
                    lastKnownLocation: "houston",
                },
                {
                    id: "bhqecj4p",
                    arrivalDate: "2027-04-13",
                    pickupdate: "2027-04-13",
                    carrier: "demo",
                    amount: 721,
                    loadStatus: "completed",
                    shipmentRequirement: "none",
                    lastKnownLocation: "miami",
                },
            ];
            setData(fetchedData);
        }
        fetchData();
    }, []);

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter by carrier..."
                    value={(table.getColumn("carrier")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("carrier")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                );
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
