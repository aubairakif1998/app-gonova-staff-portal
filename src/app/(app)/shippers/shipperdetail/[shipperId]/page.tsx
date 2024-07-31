// pages/shipper/[shipperId].tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchShipperDetails, Shipment } from '@/services/shipperService';
import { ClipLoader } from 'react-spinners';
import ShipmentTable from '@/components/ShipmentTable';
import { Shipper } from '@/types/Shipper';

const ShipperByIdPage: React.FC = () => {
    const { shipperId } = useParams();
    const router = useRouter();
    const [shipper, setShipper] = useState<Shipper | null>(null);
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(1);

    useEffect(() => {
        if (shipperId) {
            const loadShipperDetails = async () => {
                setLoading(true);
                const { success, shipper, shipments } = await fetchShipperDetails(shipperId);
                if (success) {
                    if (shipper === null) {
                        router.push('/shippers/shipperdetail/404');
                    } else {
                        setShipper(shipper);
                        setShipments(shipments);
                    }
                } else {
                    router.push('/shippers/shipperdetail/404');
                }
                setLoading(false);
            };

            loadShipperDetails();
        }
    }, [shipperId, router]);

    if (loading) {
        return (
            <div className="flex justify-center">
                <ClipLoader color="#000" loading={true} size={50} />
            </div>
        );
    }

    if (!shipper) {
        // Redirecting or rendering a 404 page handled in useEffect
        return null;
    }


    return (
        <div className="container mx-auto p-4">
            <div>
                <h1 className="text-2xl font-bold mb-4">Shipper Details</h1>
                <p className="text-lg   mb-4">Company: {shipper.companyName}</p>
                <p className="text-lg   mb-4">Email: {shipper.email}</p>
            </div>
            {shipments.length > 0 ? (
                <div>
                    <h2 className="text-xl font-bold mt-8 mb-4">Shipments</h2>
                    <ShipmentTable shipments={shipments} />

                </div>
            ) : (
                <p className="text-center text-gray-500 mt-8">No shipments available</p>
            )}
        </div>
    );
};

export default ShipperByIdPage;
