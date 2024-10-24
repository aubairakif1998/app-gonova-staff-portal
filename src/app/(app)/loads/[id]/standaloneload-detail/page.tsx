"use client";
import { useCallback, useEffect, useState } from 'react';
import { deleteAttachedDoc, fetchStandAloneLoadById, updateStandAloneLoad, deleteStandAloneLoad } from '@/services/standAloneLoadService'; // Assuming this is your service
import { StandAloneLoad } from '@/Interfaces/StandAloneLoad';
import { useParams, useRouter } from 'next/navigation';
import { Carrier } from '@/Interfaces/carrier';
import { Shipper } from '@/Interfaces/Shipper';
import { Button } from '@/components/ui/button';
import { carrierListState, selectedCarrierState } from '@/recoil/atom';
import { useRecoilValue, useResetRecoilState, useRecoilValueLoadable } from 'recoil';
import { toast } from '@/components/ui/use-toast';
import { CarrierDropdown } from '@/components/CarrierDropdown';
import { ClipLoader } from 'react-spinners';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { date } from 'zod';
import { AuditHistoryDialog } from '@/components/AuditHistoryDialog';
import { FileUpload } from "@/components/ui/file-upload";
import { Paperclip } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import CommentSection from '@/components/CommentSection';
import { uploadMultipleFilesToFirebase } from '@/services/firebaseStorageService';
import { AttachedDocsDialog } from '@/components/AttachedDocs';
const statusOptions = ["Upcoming", "InTransit", "Completed", "Cancelled"];
const serviceTypeOptions = ["LTL", "Full Truckload", "Small Shipments"];
const packagingTypeOptions = ["Pallet", "Box", "Crate", "Bundle", "Drum", "Roll", "Bale"];
// Helper function to format date as MM/DD/YYYY
const formatDate = (date: any) => {
    if (!date) return '';
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
};

// Helper function to parse MM/DD/YYYY date input back to Date object
const parseDate = (dateStr: any) => {
    const [month, day, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
};
const StandALoneLoadDetailPage = () => {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [isDocsDialogOpen, setIsDocsDialogOpen] = useState<boolean>(false);
    const [standAloneLoadData, setStandAloneLoadData] = useState<StandAloneLoad | null>(null);
    const [carrierData, setCarrierData] = useState<Carrier | null>(null);
    const [shipperData, setShipperData] = useState<Shipper | null>(null);
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

    const [files, setFiles] = useState<File[]>([]);
    useEffect(() => {
        // Cleanup function to clear the files state on unmount
        return () => {
            setFiles([]);
        };
    }, []);
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
            const response = await fetchStandAloneLoadById(id);
            if (response.success) {
                setStandAloneLoadData(response.standAloneLoad);
                setCarrierData(response.carrier);
                setShipperData(response.shipper);
                setSelectedStatus(response.standAloneLoad.status);

                setOriginalPickDropInfo({
                    pickupDate: formatDate(response.standAloneLoad.pickupDate),
                    dropOffDate: formatDate(response.standAloneLoad.dropOffDate),
                    pickupLocation: response.standAloneLoad.pickupLocation,
                    deliveryLocation: response.standAloneLoad.deliveryLocation,
                });

                setOriginalItemInfo({
                    itemDescription: response.standAloneLoad.itemDescription,
                    serviceType: response.standAloneLoad.serviceType,
                    dimensions: response.standAloneLoad.dimensions,
                    weight: response.standAloneLoad.weight,
                    quantity: response.standAloneLoad.quantity
                });



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
    const [uploading, setUploading] = useState(false);
    const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
    const handleFileUpload = (files: File[]) => {
        setFiles(files);
        console.log("selected files", files);
    };
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
            const response = await updateStandAloneLoad(id, body);

            if (response.success) {
                setStandAloneLoadData(response.standAloneLoad);
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
        if (standAloneLoadData) {
            // Basic validation
            if (
                !standAloneLoadData.pickupDate ||
                !standAloneLoadData.dropOffDate ||
                !standAloneLoadData.pickupLocation ||
                !standAloneLoadData.deliveryLocation
            ) {
                toast({
                    title: 'Validation Error',
                    description: 'Please ensure all fields are filled in.',
                    variant: 'destructive',
                });
                return;
            }

            // Check for changes
            const hasChanges = JSON.stringify(originalPickDropInfo) !== JSON.stringify({
                pickupDate: standAloneLoadData.pickupDate,
                dropOffDate: standAloneLoadData.dropOffDate,
                pickupLocation: standAloneLoadData.pickupLocation,
                deliveryLocation: standAloneLoadData.deliveryLocation,
            });

            if (hasChanges) {
                try {
                    const response = await updateStandAloneLoad(id, {
                        pickupDate: standAloneLoadData.pickupDate,
                        dropOffDate: standAloneLoadData.dropOffDate,
                        pickupLocation: standAloneLoadData.pickupLocation,
                        deliveryLocation: standAloneLoadData.deliveryLocation,
                    });

                    if (response.success) {
                        setStandAloneLoadData(response.standAloneLoad);
                        setSuccessMessage('Pick & Drop updated successfully!');
                        toast({
                            title: 'Success',
                            description: 'Pick & Drop updated successfully!',
                        });
                        setError(null);
                        setOriginalPickDropInfo({
                            pickupDate: formatDate(response.standAloneLoad.pickupDate),
                            dropOffDate: formatDate(response.standAloneLoad.dropOffDate),
                            pickupLocation: response.standAloneLoad.pickupLocation,
                            deliveryLocation: response.standAloneLoad.deliveryLocation,
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
    const handleSaveItemInfo = async () => {
        if (standAloneLoadData) {
            // Basic validation to ensure required fields are not empty
            if (
                !standAloneLoadData.itemDescription ||
                !standAloneLoadData.serviceType ||
                !standAloneLoadData.dimensions.length ||
                !standAloneLoadData.dimensions.width ||
                !standAloneLoadData.dimensions.height ||
                !standAloneLoadData.weight ||
                !standAloneLoadData.quantity
            ) {
                toast({
                    title: 'Validation Error',
                    description: 'Please ensure all fields are filled in.',
                    variant: 'destructive',
                });
                return;
            }

            // Check if there are any changes
            const hasChanges = JSON.stringify(originalItemInfo) !== JSON.stringify({
                itemDescription: standAloneLoadData.itemDescription,
                serviceType: standAloneLoadData.serviceType,
                dimensions: standAloneLoadData.dimensions,
                weight: standAloneLoadData.weight,
                quantity: standAloneLoadData.quantity
            });

            if (hasChanges) {
                try {
                    const response = await updateStandAloneLoad(id, {
                        itemDescription: standAloneLoadData.itemDescription,
                        serviceType: standAloneLoadData.serviceType,
                        dimensions: standAloneLoadData.dimensions,
                        weight: standAloneLoadData.weight,
                        quantity: standAloneLoadData.quantity
                    });

                    if (response.success) {
                        setStandAloneLoadData(response.standAloneLoad);
                        setSuccessMessage('Item info updated successfully!');
                        toast({
                            title: 'Success',
                            description: 'Item info updated successfully!',
                        });
                        setError(null);
                        setOriginalItemInfo({
                            itemDescription: standAloneLoadData.itemDescription,
                            serviceType: standAloneLoadData.serviceType,
                            dimensions: standAloneLoadData.dimensions,
                            weight: standAloneLoadData.weight,
                            quantity: standAloneLoadData.quantity
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
                    setError('An unexpected error occurred while updating item info.');
                    toast({
                        title: 'Updation Failed',
                        description: 'An unexpected error occurred while updating item info.',
                        variant: 'destructive',
                    });
                    setSuccessMessage(null);
                } finally {
                    setIsItemInfoEditing(false);
                }
            } else {
                toast({
                    title: 'No Changes',
                    description: 'No changes were made to the item info.',
                });
                setIsItemInfoEditing(false);
            }
        }
    };

    const uploadFilesToFirebase = async () => {
        setUploading(true);
        try {
            const uploadedFileUrls = await uploadMultipleFilesToFirebase(files, id, `Load/${id}`);
            setUploadedUrls(uploadedFileUrls);
            console.log("Files uploaded successfully:", uploadedFileUrls);
            toast({
                title: 'Success',
                description: 'Files uploaded successfully!',
            });
            const updatedAttachedDocs = [...(standAloneLoadData?.attachedDocs || []), ...uploadedFileUrls];

            const body = {
                attachedDocs: updatedAttachedDocs,
            };
            const response = await updateStandAloneLoad(id, body);
            if (response.success) {
                setStandAloneLoadData(response.standAloneLoad);
                toast({
                    title: 'Success',
                    description: 'Documents are uploaded successfully!',
                });
            } else {
                toast({
                    title: 'Updation Failed',
                    description: response.message || 'An unexpected error occurred while uploading docs.',
                    variant: 'destructive',
                });
                setSuccessMessage(null);
            }
            setFiles([]);
        } catch (error) {
            console.error("Error uploading files:", error);
            toast({
                title: 'Error',
                description: "Error uploading files:",
                variant: 'destructive',
            });
        } finally {
            setUploading(false);
            setFiles([]);
        }
    };



    const handleStatusChange = async (status: string) => {
        if (carrierData) {
            setSelectedStatus(status);
            const body = {
                status: status
            };

            try {
                const response = await updateStandAloneLoad(id, body);

                if (response.success) {
                    setStandAloneLoadData(response.standAloneLoad);
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
        setFiles([]);
    };

    const handleDeleteDoc = async (url: string) => {
        try {
            const response = await deleteAttachedDoc(id, url);
            if (response.success) {
                // Update the load data by removing the deleted document URL from the attachedDocs array
                setStandAloneLoadData((prevLoadData) => {
                    if (!prevLoadData) return null;  // If there's no load data, return null

                    return {
                        ...prevLoadData,
                        attachedDocs: prevLoadData.attachedDocs?.filter((doc) => doc !== url) || [],
                    };
                });

                toast({
                    title: 'Success',
                    description: 'Document deleted successfully!',
                });
            } else {
                toast({
                    title: 'Error',
                    description: response.message || 'Failed to delete document.',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error('Error deleting document:', error);
            toast({
                title: 'Error',
                description: 'An error occurred while deleting the document.',
                variant: 'destructive',
            });
        }
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
            <h1 className="text-xl font-bold mb-4">StandAloneLoad Details</h1>

            <div className="flex justify-start w-full max-w-md mb-4">
                <Button onClick={handleRefresh} className="mr-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-100">Refresh Data</Button>
                <Button className="mr-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-100" onClick={() => setIsDialogOpen(true)}>View Audit History</Button>
                <AuditHistoryDialog
                    open={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    loadId={id}
                />
                <Button
                    className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 flex items-center gap-2"
                    onClick={() => setIsDocsDialogOpen(true)}
                >
                    <Paperclip className="w-4 h-4" /> {/* Render the Paperclip icon */}
                    Attached Docs
                </Button>

                <AttachedDocsDialog
                    open={isDocsDialogOpen}
                    onClose={() => setIsDocsDialogOpen(false)}
                    urls={standAloneLoadData?.attachedDocs ?? []}
                    loadId={id} // Pass loadId to handle document deletion
                    onDelete={handleDeleteDoc}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <div className="bg-white shadow-md rounded-md border border-gray-200 p-4">
                    <h2 className="text-lg font-semibold mb-2">Shipper Info</h2>
                    <p><strong>Company Name:</strong> {shipperData?.companyName}</p>
                    <p><strong>Email:</strong> {shipperData?.email}</p>
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
                    <h2 className="text-lg font-semibold mb-2">Status</h2>
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
                                value={standAloneLoadData?.pickupLocation || ''}
                                onChange={(e) => setStandAloneLoadData(prev => ({ ...prev!, pickupLocation: e.target.value }))}
                            />

                            <Label>DropOff  Location:</Label>
                            <Input
                                type="text"
                                value={standAloneLoadData?.deliveryLocation || ''}
                                onChange={(e) => setStandAloneLoadData(prev => ({ ...prev!, deliveryLocation: e.target.value }))}
                            />
                            <Label>Pickup Date:</Label>
                            <Input
                                type="date"
                                value={standAloneLoadData?.pickupDate || ''}
                                onChange={(e) => setStandAloneLoadData(prev => ({ ...prev!, pickupDate: e.target.value }))}
                            />
                            <Label>DropOff Date:</Label>
                            <Input
                                type="date"
                                value={standAloneLoadData?.dropOffDate || ''}
                                onChange={(e) => setStandAloneLoadData(prev => ({ ...prev!, dropOffDate: e.target.value }))}
                            />

                            <Button variant="outline" onClick={() => setIsPickDropEditing(false)}>Cancel</Button>
                            <Button onClick={handleSavePickupDropOff}>Save</Button></div>
                    </>
                        : <div className="bg-white shadow-md rounded-md border border-gray-200 p-4">
                            <h2 className="text-lg font-semibold mb-2">Pickup and DropOff Info</h2>
                            <p><strong>Pickup Date:</strong> {standAloneLoadData?.pickupDate ? formatDate(standAloneLoadData.pickupDate) : 'N/A'}</p>
                            <p><strong>Pickup Location:</strong> {standAloneLoadData?.pickupLocation || 'N/A'}</p>
                            <p><strong>DropOff Date:</strong> {standAloneLoadData?.dropOffDate ? formatDate(standAloneLoadData.dropOffDate) : 'N/A'}</p>
                            <p><strong>DropOff Location:</strong> {standAloneLoadData?.deliveryLocation || 'N/A'}</p>
                            <Button className="mt-2" onClick={handlePickDropEditing}>Edit Info</Button>
                        </div>

                }

                {
                    isItemInfoEditing ? (
                        <div className="bg-white shadow-md rounded-md border border-gray-200 p-4">
                            <Label>Item Desc:</Label>
                            <Input
                                type="text"
                                value={standAloneLoadData?.itemDescription || ''}
                                onChange={(e) => setStandAloneLoadData(prev => ({ ...prev!, itemDescription: e.target.value }))}
                            />
                            <Label>Service Type:</Label>
                            <select
                                value={standAloneLoadData?.serviceType || ''}
                                onChange={(e) => setStandAloneLoadData(prev => ({ ...prev!, serviceType: e.target.value }))}
                                className="p-2 border border-gray-300 rounded-md w-full"
                            >
                                <option value="">Select Service Type</option>
                                {serviceTypeOptions.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>

                            {/* <Label>Packaging:</Label>
                            <select
                                value={standAloneLoadData?.packaging || ''}
                                onChange={(e) => setStandAloneLoadData(prev => ({ ...prev!, packaging: e.target.value }))}
                                className="p-2 border border-gray-300 rounded-md w-full"
                            >
                                <option value="">Select Packaging</option>
                                {packagingTypeOptions.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select> */}
                            <Label>Dimensions - Length /inches:</Label>
                            <Input
                                type="number"
                                value={standAloneLoadData?.dimensions?.length || 0}
                                onChange={(e) => setStandAloneLoadData(prev => ({ ...prev!, dimensions: { ...prev!.dimensions, length: parseFloat(e.target.value) } }))}
                            />
                            <Label>Dimensions - Width /inches:</Label>
                            <Input
                                type="number"
                                value={standAloneLoadData?.dimensions?.width || 0}
                                onChange={(e) => setStandAloneLoadData(prev => ({ ...prev!, dimensions: { ...prev!.dimensions, width: parseFloat(e.target.value) } }))}
                            />
                            <Label>Dimensions - Height /inches:</Label>
                            <Input
                                type="number"
                                value={standAloneLoadData?.dimensions?.height || 0}
                                onChange={(e) => setStandAloneLoadData(prev => ({ ...prev!, dimensions: { ...prev!.dimensions, height: parseFloat(e.target.value) } }))}
                            />
                            <Label>Weight /Ibs :</Label>
                            <Input
                                type="number"
                                value={standAloneLoadData?.weight || 0}
                                onChange={(e) => setStandAloneLoadData(prev => ({ ...prev!, weight: parseFloat(e.target.value) }))}
                            />

                            <Label>Quantity:</Label>
                            <Input
                                type="number"
                                value={standAloneLoadData?.quantity || 0}
                                onChange={(e) => setStandAloneLoadData(prev => ({ ...prev!, quantity: parseInt(e.target.value) }))}
                            />
                            <Button variant="outline" onClick={() => setIsItemInfoEditing(false)}>Cancel</Button>
                            <Button onClick={handleSaveItemInfo}>Save</Button>
                        </div>
                    ) : <div className="bg-white shadow-md rounded-md border border-gray-200 p-4">
                        <h2 className="text-lg font-semibold mb-2">Item Info</h2>
                        <p><strong>Item Desc: </strong> {standAloneLoadData?.itemDescription}</p>
                        <p><strong>serviceType:</strong> {standAloneLoadData?.serviceType}</p>
                        <p><strong>Dimensions:</strong> {standAloneLoadData?.dimensions.length} X {standAloneLoadData?.dimensions.width} X {standAloneLoadData?.dimensions.height}</p>
                        <p><strong>Weight:</strong> {standAloneLoadData?.weight}</p>
                        <p><strong>Quantity:</strong> {standAloneLoadData?.quantity}</p>
                        <Button className="mt-2" onClick={handleItemEditing}>Edit Item Info</Button>
                    </div>
                }

                <div className="w-full max-w-4xl mx-auto min-h-56 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
                    <FileUpload onChange={handleFileUpload} />
                    {files.length > 0 && (
                        <div className="mt-4">
                            <Button
                                className="text-white px-4 py-2 rounded"
                                onClick={uploadFilesToFirebase}
                            // disabled={uploading}
                            >
                                {uploading ? "Uploading..." : `Upload Files For Load ${id}`}
                            </Button>
                        </div>
                    )}
                </div>
                <div className="md:col-span-2 bg-white shadow-md rounded-md border border-gray-200 p-4">
                    <CommentSection />
                </div>
            </div>

        </div>
    );
};

export default StandALoneLoadDetailPage;
