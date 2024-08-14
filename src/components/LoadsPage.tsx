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

const statusOptions = ['All', 'Carrier not assigned', 'Upcoming', 'InTransit', 'Completed', 'Cancelled'];

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
        router.push(`/loads/${loadId}/load-detail`);
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
            <div className="mb-4 flex flex-wrap md:flex-nowrap space-x-2 space-y-2 md:space-y-0">
                <Input
                    type="text"
                    placeholder="Search by Carrier MC Number"
                    value={assignedCarrierMC}
                    className="border border-gray-300 rounded p-2 w-full md:w-auto"
                    onChange={(e) => setAssignedCarrierMC(e.target.value)}
                />
                <Input
                    type="text"
                    placeholder="Search by Shipment Id"
                    value={shipmentRefId}
                    onChange={(e) => setShipmentRefId(e.target.value)}
                    className="border border-gray-300 rounded p-2 w-full md:w-auto"
                />
                <Button className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 w-full md:w-auto" onClick={() => setPage(1)}>Search</Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 w-full md:w-auto">Filter by Status</Button>
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
                <Button className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 w-full md:w-auto" onClick={loadCarriers}>
                    <FiRefreshCcw className="inline-block mr-2" /> Refresh
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center">
                    <ClipLoader color="#000" loading={true} size={50} />
                </div>
            ) : (
                <>
                    <LoadTable loads={loads} onViewLoads={handleViewLoads} pageCount={totalPages} />
                    <div className="flex justify-between items-center mt-4">
                        <Button
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className={`px-4 py-2 rounded ${page === 1 ? 'bg-gray-300' : 'bg-black text-white hover:bg-black'}`}
                        >
                            Previous
                        </Button>
                        <span className='text-sm'>Page {page} of {totalPages}</span>
                        <Button
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                            className={`px-4 py-2 rounded ${page === totalPages ? 'bg-gray-300' : 'bg-black text-white hover:bg-black'}`}
                        >
                            Next
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default LoadsPage;