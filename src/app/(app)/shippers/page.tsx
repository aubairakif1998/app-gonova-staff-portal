"use client"
import React, { useEffect, useState } from 'react';
import ShipperTable from '@/components/ShipperTable';
import { fetchShippers } from '@/services/shipperService';
import { ClipLoader } from 'react-spinners';
import { Progress } from '@radix-ui/react-progress';
import { useRouter } from "next/navigation";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Shipper } from '@/Interfaces/Shipper';

const ShippersPage: React.FC = () => {
    const [shippers, setShippers] = useState<Shipper[]>([]);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [companyName, setCompanyName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    useEffect(() => {
        const loadShippers = async () => {
            setLoading(true);
            const { success, shippers, totalPages } = await fetchShippers(page, companyName, email);
            if (success) {
                setShippers(shippers);
                setTotalPages(totalPages);
            }
            setLoading(false);
        };

        loadShippers();
    }, [page, companyName, email]);

    const handleViewShipments = (shipperId: string) => {
        router.push(`/shippers/shipperdetail/${shipperId}`)
        console.log('View shipments for:', shipperId);
    };


    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Shippers</h1>
            <div className="mb-4 flex space-x-2">
                <Input type="text"
                    placeholder="Search by company name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="bg-white border border-gray-300 rounded p-2" />
                {/* <input
                    type="text"
                    placeholder="Search by company name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="border border-gray-300 rounded p-2"
                /> */}

                <Input type="email"
                    placeholder="Search by email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white border border-gray-300 rounded p-2" />
                {/* <input
                    type="email"
                    placeholder="Search by email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-gray-300 rounded p-2"
                /> */}
                <Button onClick={() => setPage(1)} className="bg-black text-white rounded p-2 hover:bg-black">Search</Button>
            </div>
            {loading ? (
                <div className="flex justify-center">
                    <ClipLoader color="#000" loading={true} size={50} />
                </div>
            ) : (
                <>
                    <ShipperTable shippers={shippers} onViewShipper={handleViewShipments} pageCount={totalPages} />
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

export default ShippersPage;
