'use client';

import React, { useEffect, useState } from 'react';
import { useRecoilValue, useRecoilValueLoadable, useResetRecoilState } from 'recoil';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShipperDropDown } from '@/components/ShipperDropDown';
import ShipmentDropdown from '@/components/ShipmentDropdown';
import { CarrierDropdown } from '@/components/CarrierDropdown';
import { selectedShipperState, shipperListState, shipmentListState, selectedShipmentState, selectedCarrierState, carrierListState } from '@/recoil/atom';
import { z } from 'zod';
import { useSession } from 'next-auth/react';
import { User } from 'next-auth';
import { useToast } from '@/components/ui/use-toast';
import axios from "axios";
import { ApiResponse } from '@/Interfaces/ApiResponse';

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3; // 3MB
const formSchema = z.object({
    pickupDate: z.string().nonempty("Pickup date is required"),
    dropOffDate: z.string().nonempty("Drop-off date is required"),
    pickupLocation: z.string().nonempty("Pickup location is required"),
    deliveryLocation: z.string().nonempty("Drop-off location is required"),
    shipmentRequirement: z.string().optional(),
    supportedDocuments: z.array(z.instanceof(File).refine((file) => file.size <= MAX_UPLOAD_SIZE, 'File size must be less than 3MB')).optional(),
});

type FormSchema = z.infer<typeof formSchema>;

const Page: React.FC = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data: session } = useSession();
    const user: User = session?.user;
    const { toast } = useToast();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
    });
    const router = useRouter();
    const selectedShipper = useRecoilValue(selectedShipperState);
    const selectedCarrier = useRecoilValue(selectedCarrierState);
    const selectedShipment = useRecoilValue(selectedShipmentState);

    const shippersLoadable = useRecoilValueLoadable(shipperListState);
    const shipmentsLoadable = useRecoilValueLoadable(shipmentListState);
    const carrierLoadable = useRecoilValueLoadable(carrierListState);

    const resetSelectedShipper = useResetRecoilState(selectedShipperState);
    const resetCarrierShipper = useResetRecoilState(selectedCarrierState);
    const resetSelectedShipment = useResetRecoilState(selectedShipmentState);
    const [supportedDocuments, setSupportedDocuments] = useState<File[]>([]);
    useEffect(() => {
        return () => {
            resetSelectedShipper();
            resetCarrierShipper();
        };
    }, [resetSelectedShipper, resetCarrierShipper]);

    useEffect(() => {
        resetSelectedShipment();
    }, [selectedShipper, resetSelectedShipment]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // format as YYYY-MM-DD
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setSupportedDocuments(files);
        setValue("supportedDocuments", files);
    };

    const onSubmit = async (data: FormSchema) => {
        setIsSubmitting(true);
        try {
            const loadBody = {
                pickupDate: data.pickupDate,
                dropOffDate: data.dropOffDate,
                pickupLocation: data.pickupLocation,
                deliveryLocation: data.deliveryLocation,
                shipmentRequirement: data.shipmentRequirement,
                supportedDocuments: [],
                latestLocationOfLoad: null,
                status: selectedCarrier?.transportMCNumber == null ? "Carrier not assigned" : 'Upcoming',
                shipmentRefId: selectedShipment?.shipmentID,
                assignedCarrierMC: selectedCarrier?.transportMCNumber ?? "",
                agentStaffMemberId: user.email,
                createdBy: user.email,
            }
            const response = await axios.post<ApiResponse>('/api/create-load', { loadData: loadBody });
            toast({
                title: response.data.message,
                description: "Your load has been successfully created.",
                variant: 'default',
            });
            router.replace('/loads')
        } catch (error) {
            console.error('Error creating load', error);
            toast({
                title: "Error",
                description: "There was an error creating the load. Please try again.",
            });
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto mb-8 mt-10">
                <div className="w-full flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-1/3">
                        {shippersLoadable.state === 'loading' && (
                            <div className="relative h-12 w-full rounded-md overflow-hidden bg-gray-200">
                                <div className="absolute top-0 left-[-100%] h-full w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
                            </div>
                        )}
                        {shippersLoadable.state === 'hasError' && <p className="text-red-500">Error loading shippers.</p>}
                        {shippersLoadable.state === 'hasValue' && (
                            <>
                                <ShipperDropDown shippers={shippersLoadable.contents} />
                            </>
                        )}
                    </div>
                    {selectedShipper && (
                        <div className="w-full md:w-1/3">
                            {shipmentsLoadable.state === 'loading' && (
                                <div className="relative h-12 w-full rounded-md overflow-hidden bg-gray-200">
                                    <div className="absolute top-0 left-[-100%] h-full w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
                                </div>
                            )}
                            {shipmentsLoadable.state === 'hasError' && <p className="text-red-500">Error loading shipments.</p>}
                            {shipmentsLoadable.state === 'hasValue' && (
                                <>
                                    <label className="block text-sm font-medium mb-2">Select Shipment</label>
                                    <ShipmentDropdown shipments={shipmentsLoadable.contents} />
                                </>
                            )}
                        </div>
                    )}
                    <div className="w-full md:w-1/3">
                        {carrierLoadable.state === 'loading' && (
                            <div className="relative h-12 w-full rounded-md overflow-hidden bg-gray-200">
                                <div className="absolute top-0 left-[-100%] h-full w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
                            </div>
                        )}
                        {carrierLoadable.state === 'hasError' && <p className="text-red-500">Error loading carriers.</p>}
                        {carrierLoadable.state === 'hasValue' && (
                            <>
                                <CarrierDropdown carriers={carrierLoadable.contents} />
                            </>
                        )}
                    </div>
                </div>
                {selectedShipment && (
                    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-md shadow-md w-full max-w-2xl mx-auto space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Shipment ID:</label>
                                <input
                                    disabled={true}
                                    type="text"
                                    value={selectedShipment.shipmentID}
                                    readOnly
                                    className="block w-full p-3 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Carrier Company Name:</label>
                                <input
                                    disabled={true}
                                    type="text"
                                    value={selectedCarrier?.companyName || ''}
                                    readOnly
                                    className="block w-full p-3 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Pickup Date:</label>
                                <input
                                    type="date"
                                    defaultValue={formatDate(selectedShipment.requestingLoadingDate)}
                                    {...register('pickupDate')}
                                    className="block w-full p-3 border border-gray-300 rounded-md"
                                />
                                {errors.pickupDate && <p className="text-red-500 text-sm mt-1">{errors.pickupDate.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Drop Off Date:</label>
                                <input
                                    type="date"
                                    defaultValue={formatDate(selectedShipment.arrivalDate)}
                                    {...register('dropOffDate')}
                                    className="block w-full p-3 border border-gray-300 rounded-md"
                                />
                                {errors.dropOffDate && <p className="text-red-500 text-sm mt-1">{errors.dropOffDate.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Pickup Location:</label>
                                <input
                                    type="text"
                                    defaultValue={selectedShipment.pickupLocation}
                                    {...register('pickupLocation')}
                                    className="block w-full p-3 border border-gray-300 rounded-md"
                                />
                                {errors.pickupLocation && <p className="text-red-500 text-sm mt-1">{errors.pickupLocation.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Drop Off Location:</label>
                                <input
                                    type="text"
                                    defaultValue={selectedShipment.deliveryLocation}
                                    {...register('deliveryLocation')}
                                    className="block w-full p-3 border border-gray-300 rounded-md"
                                />
                                {errors.deliveryLocation && <p className="text-red-500 text-sm mt-1">{errors.deliveryLocation.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Shipment Requirement:</label>
                                <input
                                    type="text"
                                    {...register('shipmentRequirement')}
                                    className="block w-full p-3 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Agent Staff Member Email:</label>
                                <input
                                    type="text"
                                    disabled={true}
                                    value={user.email}
                                    readOnly
                                    className="block w-full p-3 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Supported Documents:</label>
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                    className="block w-full p-3 border border-gray-300 rounded-md"
                                />
                                {errors.supportedDocuments && <p className="text-red-500 text-sm mt-1">{errors.supportedDocuments.message}</p>}
                            </div>
                        </div>
                        <button
                            type="submit"
                            className={`w-full py-3 px-4 rounded-md transition ${isSubmitting ? 'bg-gray-400' : 'bg-black hover:bg-gray-900 text-white'}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <div className="flex justify-center items-center">
                                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path d="M12 2a10 10 0 0 1 0 20 10 10 0 0 1 0-20" className="opacity-25" />
                                    </svg>
                                    Creating...
                                </div>
                            ) : (
                                'Submit'
                            )}
                        </button>
                    </form>
                )}
            </div>
        </>
    );
};

export default Page;
