"use client";
import React, { useEffect, useState } from 'react';
import { fetchCarriers, Carrier, FetchCarriersResponse } from '@/services/carrierService';
import { ClipLoader } from 'react-spinners';
import { Progress } from '@radix-ui/react-progress';
import { useRouter } from "next/navigation";
import CarrierTable from '@/components/CarrierTable';
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input';

const CarriersPage: React.FC = () => {
    const [carriers, setCarriers] = useState<Carrier[]>([]);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [companyName, setCompanyName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [transportMCNumber, setTransportMCNumber] = useState<string>('');
    const [dot, setDot] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        const loadCarriers = async () => {
            setLoading(true);
            const { success, carriers, totalPages } = await fetchCarriers(page, companyName, email, dot, transportMCNumber);
            console.log(carriers[0])
            if (success) {
                setCarriers(carriers);
                setTotalPages(totalPages);
            }
            setLoading(false);
        };

        loadCarriers();
    }, [page, companyName, email, dot, transportMCNumber]);

    const handleViewCarriers = (carrierId: string) => {
        router.push(`/carriers/${carrierId}`);
        console.log('View shipments for:', carrierId);
    };

    const handleCreateCarrier = () => {
        router.push('/carriers/create');
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Carriers</h1>
            <div className="mb-4 flex space-x-2">
                <Input type="text" placeholder="Search by company name" value={companyName}
                    className="  border border-gray-300 rounded p-2" onChange={(e) => setCompanyName(e.target.value)} />

                <Input type="email"
                    placeholder="Search by email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-gray-300 rounded p-2" />


                <Input type="text"
                    placeholder="Search by Dot#"
                    value={dot}
                    onChange={(e) => setDot(e.target.value)}
                    className="border border-gray-300 rounded p-2" />

                <Input type="text"
                    placeholder="Search by Transport MC Number#"
                    value={transportMCNumber}
                    onChange={(e) => setTransportMCNumber(e.target.value)}
                    className="border border-gray-300 rounded p-2" />



                <Button onClick={() => setPage(1)} > Search</Button>
            </div>
            <div className="mb-4 flex justify-end">
                <Button onClick={handleCreateCarrier} > Create Carrier</Button>
            </div>
            {loading ? (
                <div className="flex justify-center">
                    <ClipLoader color="#000" loading={true} size={50} />
                </div>
            ) : (
                <>
                    <CarrierTable carriers={carriers} onViewCarriers={handleViewCarriers} pageCount={totalPages} />
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
                            disabled={page === 1 && totalPages === 0}
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

export default CarriersPage;
