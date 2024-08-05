"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { fetchLoads, FetchLoadsResponse } from '@/services/loadService';
import { Load } from "@/Interfaces/Load";
import { ClipLoader } from 'react-spinners';
import { useRouter } from "next/navigation";
import LoadTable from '@/components/LoadTable';
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from '@/components/ui/checkbox';
import { FiRefreshCcw } from 'react-icons/fi';  // Import the refresh icon
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const statusOptions = ['Upcoming', 'InTransit', 'Completed', 'Cancelled', 'All'];

const LoadsPage: React.FC = () => {
    const [loads, setLoads] = useState<Load[]>([]);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [assignedCarrierMC, setAssignedCarrierMC] = useState<string>('');
    const [status, setStatus] = useState<string[]>([]);
    const [shipmentRefId, setShipmentRefId] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const loadCarriers = useCallback(async () => {
        setLoading(true);
        const { success, loads, totalPages } = await fetchLoads(page, shipmentRefId, assignedCarrierMC, status);
        if (success) {
            setLoads(loads);
            setTotalPages(totalPages);
        }
        setLoading(false);
    }, [page, shipmentRefId, assignedCarrierMC, status]);

    useEffect(() => {
        loadCarriers();
    }, [page, assignedCarrierMC, status, shipmentRefId, loadCarriers]);

    const handleViewLoads = (loadId: string) => {
        router.push(`/loads/${loadId}`);
    };

    const handleCreateLoad = () => {
        router.push('/loads/create');
    };

    const handleStatusChange = (statusType: string) => {
        setStatus((prevStatus) => {
            if (statusType === 'All') {
                return prevStatus.includes('All') ? [] : ['All'];
            }
            const newStatus = prevStatus.includes(statusType)
                ? prevStatus.filter((s) => s !== statusType)
                : [...prevStatus, statusType];

            if (newStatus.includes('All')) {
                newStatus.splice(newStatus.indexOf('All'), 1);
            }

            return newStatus;
        });
    };

    return (
        <div className="container mx-auto p-4">
            {/* <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger>Is it accessible?</AccordionTrigger>
                    <AccordionContent>
                        Yes. It adheres to the WAI-ARIA design pattern.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <h1 className="text-2xl font-bold mb-4">Loads</h1> */}
            <div className="mb-4 flex space-x-2">
                <Input
                    type="text"
                    placeholder="Search by Carrier MC Number"
                    value={assignedCarrierMC}
                    className="border border-gray-300 rounded p-2"
                    onChange={(e) => setAssignedCarrierMC(e.target.value)}
                />
                <Input
                    type="email"
                    placeholder="Search by Shipment Id"
                    value={shipmentRefId}
                    onChange={(e) => setShipmentRefId(e.target.value)}
                    className="border border-gray-300 rounded p-2"
                />
                <Button onClick={() => setPage(1)}>Search</Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button>Filter by Status</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="space-y-2 transition-all duration-300">
                        {statusOptions.map((statusOption) => (
                            <DropdownMenuItem key={statusOption} asChild>
                                <label className="flex items-center space-x-2">
                                    <Checkbox
                                        checked={status.includes(statusOption)}
                                        onCheckedChange={() => handleStatusChange(statusOption)}
                                    />
                                    <span>{statusOption}</span>
                                </label>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button onClick={loadCarriers}>
                    <FiRefreshCcw className="inline-block mr-2" /> Refresh
                </Button>
            </div>
            <div className="mb-4 flex justify-end">
                <Button onClick={handleCreateLoad}>Create Load</Button>
            </div>
            {loading ? (
                <div className="flex justify-center">
                    <ClipLoader color="#000" loading={true} size={50} />
                </div>
            ) : (
                <>
                    <LoadTable loads={loads} onViewLoads={handleViewLoads} pageCount={totalPages} />
                    <div className="flex justify-between items-center mt-4">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className={`px-4 py-2 rounded ${page === 1 ? 'bg-gray-300' : 'bg-black text-white hover:bg-black'}`}
                        >
                            Previous
                        </button>
                        <span>Page {page} of {totalPages}</span>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                            className={`px-4 py-2 rounded ${page === totalPages ? 'bg-gray-300' : 'bg-black text-white hover:bg-black'}`}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default LoadsPage;
