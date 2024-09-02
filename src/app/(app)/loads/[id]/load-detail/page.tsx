"use client";
import { useCallback, useEffect, useState } from 'react';
import { fetchLoadById, updateLoad } from '@/services/loadService';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { carrierListState, selectedCarrierState } from '@/recoil/atom';
import { useRecoilValue, useResetRecoilState, useRecoilValueLoadable } from 'recoil';
import { toast } from '@/components/ui/use-toast';
import { CarrierDropdown } from '@/components/CarrierDropdown';
import { ClipLoader } from 'react-spinners';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Load } from '@/Interfaces/Load';
import { formatDate } from '@/utils/utils';
import { Carrier } from '@/Interfaces/carrier';
import { Shipment } from '@/Interfaces/Shipment';
import { AuditHistoryDialog } from '@/components/AuditHistoryDialog';
const statusOptions = ["Upcoming", "InTransit", "Completed", "Cancelled"];
const serviceTypeOptions = ["LTL", "Full Truckload", "Small Shipments"];
const packagingTypeOptions = ["Pallet", "Box", "Crate", "Bundle", "Drum", "Roll", "Bale"];

const LoadDetailPage = () => {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [loadData, setLoadData] = useState<Load | null>(null);
    const [carrierData, setCarrierData] = useState<Carrier | null>(null);
    const [shipmentData, setShipmentData] = useState<Shipment | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isCarrierEditing, setIsCarrierEditing] = useState<boolean>(false);
    const [isPickDropEditing, setIsPickDropEditing] = useState<boolean>(false);
    const [isItemInfoEditing, setIsItemInfoEditing] = useState<boolean>(false);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const { id } = useParams();
    const selectedCarrier = useRecoilValue(selectedCarrierState);
    const carrierLoadable = useRecoilValueLoadable(carrierListState);
    const resetSelectedCarrier = useResetRecoilState(selectedCarrierState);
    const router = useRouter();
    const [originalItemInfo, setOriginalItemInfo] = useState({
        itemDescription: '',
        serviceType: '',
        dimensions: { length: 0, width: 0, height: 0 },
        weight: 0,
        quantity: 0
    });
    const [originalPickDropInfo, setOriginalPickDropInfo] = useState({
        pickupDate: '',
        dropOffDate: '',
        pickupLocation: '',
        deliveryLocation: '',
    });
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetchLoadById(id);
            if (response.success) {
                setLoadData(response.load);
                setCarrierData(response.carrier);
                setShipmentData(response.shipment);
                setSelectedStatus(response.load.status);

                setOriginalPickDropInfo({
                    pickupDate: formatDate(response.load.pickupDate),
                    dropOffDate: formatDate(response.load.dropOffDate),
                    pickupLocation: response.load.pickupLocation,
                    deliveryLocation: response.load.deliveryLocation,
                });

                // setOriginalItemInfo({
                //     itemDescription: response.standAloneLoad.itemDescription,
                //     serviceType: response.standAloneLoad.serviceType,
                //     dimensions: response.standAloneLoad.dimensions,
                //     weight: response.standAloneLoad.weight,
                //     quantity: response.standAloneLoad.quantity
                // });



            } else {
                setError(response.message || 'Failed to fetch data');
                toast({
                    title: 'Error',
                    description: response.message || 'Failed to fetch data',
                    variant: 'destructive',
                });
            }
        } catch (err) {
            console.error("Error while fetching StandAloneLoad info:", err);
            setError('An unexpected error occurred.');
            toast({
                title: 'Error',
                description: 'An unexpected error occurred.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchData();
        return () => {
            resetSelectedCarrier();
        };
    }, [fetchData, resetSelectedCarrier]);

    const handleCarrierEditing = () => {
        setIsCarrierEditing(true);
    };
    const handleItemEditing = () => {
        setIsItemInfoEditing(true);
    };
    const handlePickDropEditing = () => {
        setIsPickDropEditing(true);
    };
    const handleSaveCarrierEditing = async () => {
        const body = {
            assignedCarrierMC: selectedCarrier?.transportMCNumber,
            status: selectedStatus || "Upcoming"
        };

        try {
            const response = await updateLoad(id, body);

            if (response.success) {
                setLoadData(response.load);
                setSuccessMessage('Carrier info updated successfully!');
                toast({
                    title: 'Success',
                    description: 'Carrier info updated successfully!',
                });
                setError(null);
            } else {
                setError(response.message || 'Failed to update carrier info');
                toast({
                    title: 'Updation Failed',
                    description: response.message || 'An unexpected error occurred while updating carrier info.',
                    variant: 'destructive',
                });
                setSuccessMessage(null);
            }
        } catch (error) {
            console.error('Error updating carrier info:', error);
            setError('An unexpected error occurred while updating carrier info.');
            toast({
                title: 'Updation Failed',
                description: 'An unexpected error occurred while updating carrier info.',
                variant: 'destructive',
            });
            setSuccessMessage(null);
        } finally {
            setIsCarrierEditing(false);
            resetSelectedCarrier();
        }
    };
    const handleSavePickupDropOff = async () => {
        if (loadData) {
            // Basic validation
            if (
                !loadData.pickupDate ||
                !loadData.dropOffDate ||
                !loadData.pickupLocation ||
                !loadData.deliveryLocation
            ) {
                toast({
                    title: 'Validation Error',
                    description: 'Please ensure all fields are filled in.',
                    variant: 'destructive',
                });
                return;
            }

            const hasChanges = JSON.stringify(originalPickDropInfo) !== JSON.stringify({
                pickupDate: loadData.pickupDate,
                dropOffDate: loadData.dropOffDate,
                pickupLocation: loadData.pickupLocation,
                deliveryLocation: loadData.deliveryLocation,
            });

            if (hasChanges) {
                try {
                    const response = await updateLoad(id, {
                        pickupDate: loadData.pickupDate,
                        dropOffDate: loadData.dropOffDate,
                        pickupLocation: loadData.pickupLocation,
                        deliveryLocation: loadData.deliveryLocation,
                    });

                    if (response.success) {
                        setLoadData(response.load);
                        setSuccessMessage('Pick&Drop info updated successfully!');
                        toast({
                            title: 'Success',
                            description: 'Pick & Drop updated successfully!',
                        });
                        setError(null);
                        setOriginalPickDropInfo({
                            pickupDate: formatDate(response.load.pickupDate),
                            dropOffDate: formatDate(response.load.dropOffDate),
                            pickupLocation: response.load.pickupLocation,
                            deliveryLocation: response.load.deliveryLocation,
                        });
                    } else {
                        setError(response.message || 'Failed to update item info');
                        toast({
                            title: 'Updation Failed',
                            description: response.message || 'An unexpected error occurred while updating item info.',
                            variant: 'destructive',
                        });
                        setSuccessMessage(null);
                    }
                } catch (error) {
                    console.error('Error updating item info:', error);
                    setError('An unexpected error occurred while updating PickDrop info.');
                    toast({
                        title: 'Updation Failed',
                        description: 'An unexpected error occurred while updating PickDrop info.',
                        variant: 'destructive',
                    });
                    setSuccessMessage(null);
                } finally {
                    setIsPickDropEditing(false);
                }
            } else {
                toast({
                    title: 'No Changes',
                    description: 'No changes were made to the PickDrop info.',
                });
                setIsPickDropEditing(false);
            }
        }
    };

    const handleStatusChange = async (status: string) => {
        if (carrierData) {
            setSelectedStatus(status);
            const body = {
                status: status
            };

            try {

                const response = await updateLoad(id, body);

                if (response.success) {
                    setLoadData(response.load);
                    setSuccessMessage('Status updated successfully!');
                    toast({
                        title: 'Success',
                        description: 'Status updated successfully!',
                    });
                    setError(null);
                } else {
                    setError(response.message || 'Failed to update carrier info');
                    toast({
                        title: 'Updation Failed',
                        description: response.message || 'An unexpected error occurred while updating carrier info.',
                        variant: 'destructive',
                    });
                    setSuccessMessage(null);
                }
            } catch (error) {
                console.error('Error updating carrier info:', error);
                setError('An unexpected error occurred while updating carrier info.');
                toast({
                    title: 'Updation Failed',
                    description: 'An unexpected error occurred while updating carrier info.',
                    variant: 'destructive',
                });
                setSuccessMessage(null);
            } finally {
                setIsCarrierEditing(false);
                resetSelectedCarrier();
            }
        }

    };

    const handleRefresh = () => {
        fetchData();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <ClipLoader color="#000" loading={true} size={50} />
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-start space-y-4">
            <h1 className="text-xl font-bold mb-4">Load Details</h1>
            <div className="flex justify-start w-full max-w-md mb-4">
                <Button className="mr-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-100" onClick={handleRefresh} >Refresh Data</Button>
                <Button className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-100" onClick={() => setIsDialogOpen(true)}>View Audit History</Button>
                <AuditHistoryDialog
                    open={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    loadId={id}
                />
            </div>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <div className="bg-white shadow-md rounded-md border border-gray-200 p-4">
                    <h2 className="text-lg font-semibold mb-2">Shipment Info</h2>
                    <p><strong>Shippent Id:</strong> {shipmentData?.shipmentID}</p>
                    <p><strong>Service Type:</strong> {shipmentData?.serviceType}</p>

                </div>

                <div className="bg-white shadow-md rounded-md border border-gray-200 p-4">
                    <h2 className="text-lg font-semibold mb-2">Carrier Info</h2>
                    {isCarrierEditing ? (
                        <>
                            {carrierLoadable.state === 'loading' && (
                                <div className="text-center">
                                    <ClipLoader color="#000" loading={true} size={50} />
                                </div>
                            )}
                            {carrierLoadable.state === 'hasError' && (
                                <p className="text-red-500">Error loading carriers.</p>
                            )}
                            {carrierLoadable.state === 'hasValue' && (
                                <>
                                    <CarrierDropdown carriers={carrierLoadable.contents} />
                                    <div className="flex justify-end space-x-4 mt-4">
                                        <Button variant="outline" onClick={() => setIsCarrierEditing(false)}>Cancel</Button>
                                        <Button onClick={handleSaveCarrierEditing}>Save</Button>
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            {carrierData ? (
                                <>
                                    <p><strong>Company Name:</strong> {carrierData.companyName}</p>
                                    <p><strong>MC Number:</strong> {carrierData.transportMCNumber}</p>
                                    <Button className="mt-2" onClick={handleCarrierEditing}>Edit Carrier</Button>
                                </>
                            ) : (
                                <>
                                    <p>No Carrier assigned yet</p>
                                    <Button className="mt-2" onClick={handleCarrierEditing}>Assign Carrier</Button>
                                </>
                            )}
                        </>
                    )}
                </div>

                <div className="bg-white shadow-md rounded-md border border-gray-200 p-4">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-lg font-semibold">Status</h2>
                        {selectedStatus && (
                            <span
                                className={`px-2 py-1 rounded-full text-xs font-semibold ${selectedStatus === 'Completed' ? 'bg-green-500 text-white' :
                                    selectedStatus === 'InTransit' ? 'bg-blue-500 text-white' :
                                        selectedStatus === 'Cancelled' ? 'bg-red-500 text-white' :
                                            selectedStatus === 'Upcoming' ? 'bg-gray-500 text-gray-100' :
                                                ''
                                    }`}
                            >
                                {selectedStatus}
                            </span>
                        )}
                    </div>
                    <select
                        value={selectedStatus || ''}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        disabled={!carrierData}
                        className="p-2 border border-gray-300 rounded-md w-full"
                    >
                        <option value="">Select Status</option>
                        {statusOptions.map((status) => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
                {
                    isPickDropEditing ? <>
                        <div className="bg-white shadow-md rounded-md border border-gray-200 p-4">
                            <Label>Pickup Location:</Label>
                            <Input
                                type="text"
                                value={loadData?.pickupLocation || ''}
                                onChange={(e) => setLoadData(prev => ({ ...prev!, pickupLocation: e.target.value }))}
                            />

                            <Label>DropOff  Location:</Label>
                            <Input
                                type="text"
                                value={loadData?.deliveryLocation || ''}
                                onChange={(e) => setLoadData(prev => ({ ...prev!, deliveryLocation: e.target.value }))}
                            />
                            <Label>Pickup Date:</Label>
                            <Input
                                type="date"
                                value={loadData?.pickupDate || ''}
                                onChange={(e) => setLoadData(prev => ({ ...prev!, pickupDate: e.target.value }))}
                            />
                            <Label>DropOff Date:</Label>
                            <Input
                                type="date"
                                value={loadData?.dropOffDate || ''}
                                onChange={(e) => setLoadData(prev => ({ ...prev!, dropOffDate: e.target.value }))}
                            />

                            <Button variant="outline" onClick={() => setIsPickDropEditing(false)}>Cancel</Button>
                            <Button onClick={handleSavePickupDropOff}>Save</Button></div>
                    </>
                        : <div className="bg-white shadow-md rounded-md border border-gray-200 p-4">
                            <h2 className="text-lg font-semibold mb-2">Pickup and DropOff Info</h2>
                            <p><strong>Pickup Date:</strong> {loadData?.pickupDate ? formatDate(loadData.pickupDate) : 'N/A'}</p>
                            <p><strong>Pickup Location:</strong> {loadData?.pickupLocation || 'N/A'}</p>
                            <p><strong>DropOff Date:</strong> {loadData?.dropOffDate ? formatDate(loadData.dropOffDate) : 'N/A'}</p>
                            <p><strong>DropOff Location:</strong> {loadData?.deliveryLocation || 'N/A'}</p>
                            <Button className="mt-2" onClick={handlePickDropEditing}>Edit Info</Button>
                        </div>

                }
            </div>

        </div>
    );
};

export default LoadDetailPage;
