"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { ClipLoader } from "react-spinners";
import { Progress } from "@radix-ui/react-progress";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface Shipment {
    _id: string;
    shipmentID: string;
    userId: string;
    serviceType: string;
    requestingLoadingDate: string;
    arrivalDate: string;
    pickupLocationPostalCode: string;
    deliveryLocationPostalCode: string;
    shipmentContainAlcohol: boolean;
    hazardousMaterial: boolean;
    itemDescription: string;
    packaging: "Pallet" | "Box" | "Crate" | "Bundle" | "Drum" | "Roll" | "Bale";
    dimensions: {
        length: number;
        width: number;
        height: number;
    };
    weight: number;
    quantity: number;
    contracts: [];
}

const ShipmentsPage: React.FC = () => {
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [filteredShipments, setFilteredShipments] = useState<Shipment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterId, setFilterId] = useState<string>("");
    const [filterServiceType, setFilterServiceType] = useState<string>("");
    const [sortByArrivalDate, setSortByArrivalDate] = useState<"asc" | "desc" | null>(null);
    const [sortByLoadingDate, setSortByLoadingDate] = useState<"asc" | "desc" | null>(null);

    useEffect(() => {
        const fetchShipments = async () => {
            try {
                const response = await axios.get("/api/get-shipments"); // Adjust the API endpoint as necessary
                setShipments(response.data.shipments);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch shipments");
                setLoading(false);
            }
        };

        fetchShipments();
    }, []);

    useEffect(() => {
        // Apply filters
        let filtered = shipments.filter((shipment) =>
            shipment.shipmentID.toLowerCase().includes(filterId.toLowerCase()) &&
            shipment.serviceType.toLowerCase().includes(filterServiceType.toLowerCase())
        );

        // Apply sorting
        if (sortByArrivalDate === "asc") {
            filtered.sort((a, b) => new Date(a.arrivalDate).getTime() - new Date(b.arrivalDate).getTime());
        } else if (sortByArrivalDate === "desc") {
            filtered.sort((a, b) => new Date(b.arrivalDate).getTime() - new Date(a.arrivalDate).getTime());
        }

        if (sortByLoadingDate === "asc") {
            filtered.sort((a, b) => new Date(a.requestingLoadingDate).getTime() - new Date(b.requestingLoadingDate).getTime());
        } else if (sortByLoadingDate === "desc") {
            filtered.sort((a, b) => new Date(b.requestingLoadingDate).getTime() - new Date(a.requestingLoadingDate).getTime());
        }

        setFilteredShipments(filtered);
    }, [shipments, filterId, filterServiceType, sortByArrivalDate, sortByLoadingDate]);

    const handleSortByArrivalDate = () => {
        if (sortByArrivalDate === "asc") {
            setSortByArrivalDate("desc");
        } else {
            setSortByArrivalDate("asc");
        }
    };

    const handleSortByLoadingDate = () => {
        if (sortByLoadingDate === "asc") {
            setSortByLoadingDate("desc");
        } else {
            setSortByLoadingDate("asc");
        }
    };

    const handleServiceTypeFilterChange = (value: string) => {
        setFilterServiceType(value);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <ClipLoader color="#000" loading={true} size={50} />
                <Progress value={50} /> {/* Example value */}
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center my-4">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Shipments</h1>
            <div className="flex justify-end mb-4">
                <Link href="/shipments/addshipment">
                    <button className="bg-black text-white px-6 py-2 rounded shadow hover:bg-gray-700 transition duration-200">
                        Create Shipment
                    </button>
                </Link>
            </div>
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                    <span className="text-gray-700">Filter by Service Type:</span>
                    <select
                        value={filterServiceType}
                        onChange={(e) => handleServiceTypeFilterChange(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2"
                    >
                        <option value="">All</option>
                        <option value="Small Shipment">Small Shipment</option>
                        <option value="Full Truckload">Full Truckload</option>
                        <option value="LTL">LTL</option>
                    </select>
                </div>
                <div className="flex space-x-4">
                    <button
                        onClick={handleSortByArrivalDate}
                        className={`px-4 py-2 rounded border ${sortByArrivalDate ? 'bg-black text-white' : 'bg-black text-white  '} transition duration-200`}
                    >
                        Sort by Arrival Date
                    </button>
                    <button
                        onClick={handleSortByLoadingDate}
                        className={`px-4 py-2 rounded border ${sortByLoadingDate ? 'bg-black text-white' : 'bg-black text-white  '} transition duration-200`}
                    >
                        Sort by Loading Date
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <Table className="min-w-full bg-white border border-gray-300 shadow-sm rounded-lg">
                    <TableCaption className="text-left p-4 text-gray-500">

                    </TableCaption>
                    <TableHeader className="bg-gray-100">
                        <TableRow>
                            <TableHead className="p-3">
                                <div className="flex items-center">
                                    <span className="mr-2">Id</span>
                                    <input
                                        type="text"
                                        placeholder="Filter"
                                        value={filterId}
                                        onChange={(e) => setFilterId(e.target.value)}
                                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                                    />
                                </div>
                            </TableHead>
                            <TableHead className="p-3">Service Type</TableHead>
                            <TableHead className="p-3">
                                <button
                                    className="flex items-center"
                                    onClick={handleSortByLoadingDate}
                                >
                                    Loading Date
                                    {sortByLoadingDate && (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={`h-4 w-4 ml-1 transition-transform duration-200 ${sortByLoadingDate === "asc" ? "" : "rotate-180"}`}
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M13.293 6.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L10 8.586l2.293-2.293zM7 14a1 1 0 100-2 1 1 0 000 2zM14 8a1 1 0 11-2 0 1 1 0 012 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    )}
                                </button>
                            </TableHead>
                            <TableHead className="p-3">
                                <button
                                    className="flex items-center"
                                    onClick={handleSortByArrivalDate}
                                >
                                    Arrival Date
                                    {sortByArrivalDate && (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={`h-4 w-4 ml-1 transition-transform duration-200 ${sortByArrivalDate === "asc" ? "" : "rotate-180"}`}
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M13.293 6.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L10 8.586l2.293-2.293zM7 14a1 1 0 100-2 1 1 0 000 2zM14 8a1 1 0 11-2 0 1 1 0 012 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    )}
                                </button>
                            </TableHead>
                            <TableHead className="p-3">Pickup Location</TableHead>
                            <TableHead className="p-3">Delivery Location</TableHead>
                            <TableHead className="p-3">Alcohol</TableHead>
                            <TableHead className="p-3">Hazardous Material</TableHead>
                            <TableHead className="p-3">Item Description</TableHead>
                            <TableHead className="p-3">Packaging</TableHead>
                            <TableHead className="p-3">Dimensions (L x W X H) inches </TableHead>
                            <TableHead className="p-3">Weight (lbs)</TableHead>
                            <TableHead className="p-3">Quantity</TableHead>
                            <TableHead className="p-3">Contract</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredShipments.map((shipment) => (
                            <TableRow key={shipment.shipmentID} className="hover:bg-gray-50 transition duration-200">
                                <TableCell className="border p-3">{shipment.shipmentID}</TableCell>
                                <TableCell className="border p-3">{shipment.serviceType}</TableCell>
                                <TableCell className="border p-3">{new Date(shipment.requestingLoadingDate).toLocaleDateString()}</TableCell>
                                <TableCell className="border p-3">{new Date(shipment.arrivalDate).toLocaleDateString()}</TableCell>
                                <TableCell className="border p-3">{shipment.pickupLocationPostalCode}</TableCell>
                                <TableCell className="border p-3">{shipment.deliveryLocationPostalCode}</TableCell>
                                <TableCell className="border p-3">{shipment.shipmentContainAlcohol ? "Yes" : "No"}</TableCell>
                                <TableCell className="border p-3">{shipment.hazardousMaterial ? "Yes" : "No"}</TableCell>
                                <TableCell className="border p-3">{shipment.itemDescription}</TableCell>
                                <TableCell className="border p-3">{shipment.packaging}</TableCell>
                                <TableCell className="border p-3">{`${shipment.dimensions.length} x ${shipment.dimensions.width} x ${shipment.dimensions.height}`}</TableCell>
                                <TableCell className="border p-3">{`${shipment.weight} `}</TableCell>
                                <TableCell className="border p-3">{shipment.quantity}</TableCell>
                                <TableCell className="border p-3">{shipment.contracts ?? 'Not Yet'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default ShipmentsPage;
