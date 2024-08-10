'use client';
import { useEffect, useState } from 'react';
import { fetchStandAloneLoadById } from '@/services/standAloneLoadService';
import { StandAloneLoad } from '@/Interfaces/StandAloneLoad';
import { useParams } from 'next/navigation';

interface Data {
    success: boolean;
    data: StandAloneLoad | null;
    message?: string;
}

const StandALoneLoadDetailPage = () => {
    const [standAloneLoadData, setstandAloneLoadData] = useState<StandAloneLoad | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const { id } = useParams();

    const statusOptions = [
        "Carrier not assigned",
        "Upcoming",
        "InTransit",
        "Completed",
        "Cancelled"
    ];

    const serviceTypeOptions = [
        "Full Truckload",
        "LTL",
        "Small Shipement",
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response: Data = await fetchStandAloneLoadById(id);
                if (response.success) {
                    setstandAloneLoadData(response.data);
                } else {
                    setstandAloneLoadData(null);
                    setError(response.message || 'Failed to fetch data');
                }
            } catch (err) {
                console.error("Error while fetching StandALoneload info:", err);
                setError('An unexpected error occurred.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setstandAloneLoadData(prevData => ({
            ...prevData!,
            [name]: value,
        }));
    };

    const handleSave = () => {
        // Implement the save functionality to update the data in the backend.
        console.log("Saving data...", standAloneLoadData);
        setIsEditing(false);
    };

    if (loading) {
        return <div className="text-center mt-4">Loading...</div>;
    }

    if (!standAloneLoadData && error) {
        return <div className="text-center mt-4 text-red-500">{error}</div>;
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center">
            <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Standalone Load Data</h1>
                <div>
                    {/* Agent Staff Member ID */}
                    <div className="mb-6">
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                            Agent Staff Member ID
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="agentStaffMemberId"
                                value={standAloneLoadData?.agentStaffMemberId || ''}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        ) : (
                            <div className="bg-gray-100 p-4 rounded-md shadow-md">
                                {standAloneLoadData?.agentStaffMemberId || 'Data Not found'}
                            </div>
                        )}
                    </div>

                    {/* Pickup Date */}
                    <div className="mb-6">
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                            Pickup Date
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="pickupDate"
                                value={standAloneLoadData?.pickupDate || ''}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        ) : (
                            <div className="bg-gray-100 p-4 rounded-md shadow-md">
                                {standAloneLoadData?.pickupDate || 'Data Not found'}
                            </div>
                        )}
                    </div>

                    {/* Drop Off Date */}
                    <div className="mb-6">
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                            Drop Off Date
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="dropOffDate"
                                value={standAloneLoadData?.dropOffDate || ''}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        ) : (
                            <div className="bg-gray-100 p-4 rounded-md shadow-md">
                                {standAloneLoadData?.dropOffDate || 'Data Not found'}
                            </div>
                        )}
                    </div>

                    {/* Pickup Location */}
                    <div className="mb-6">
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                            Pickup Location
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="pickupLocation"
                                value={standAloneLoadData?.pickupLocation || ''}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        ) : (
                            <div className="bg-gray-100 p-4 rounded-md shadow-md">
                                {standAloneLoadData?.pickupLocation || 'Data Not found'}
                            </div>
                        )}
                    </div>

                    {/* Delivery Location */}
                    <div className="mb-6">
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                            Delivery Location
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="deliveryLocation"
                                value={standAloneLoadData?.deliveryLocation || ''}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        ) : (
                            <div className="bg-gray-100 p-4 rounded-md shadow-md">
                                {standAloneLoadData?.deliveryLocation || 'Data Not found'}
                            </div>
                        )}
                    </div>

                    {/* Service Type */}
                    <div className="mb-6">
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                            Service Type
                        </label>
                        {isEditing ? (
                            <select
                                name="status"
                                value={standAloneLoadData?.serviceType || ''}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                                {serviceTypeOptions.map(option => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <div className="bg-gray-100 p-4 rounded-md shadow-md">
                                {standAloneLoadData?.serviceType || 'Data Not found'}
                            </div>
                        )}
                    </div>

                    {/* Load Contain Alcohol */}
                    <div className="mb-6">
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                            Load Contain Alcohol
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="loadContainAlcohol"
                                value={standAloneLoadData?.loadContainAlcohol || ''}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        ) : (
                            <div className="bg-gray-100 p-4 rounded-md shadow-md">
                                {standAloneLoadData?.loadContainAlcohol || 'Data Not found'}
                            </div>
                        )}
                    </div>

                    {/* Hazardous Material */}
                    <div className="mb-6">
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                            Hazardous Material
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="hazardousMaterial"
                                value={standAloneLoadData?.hazardousMaterial || ''}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        ) : (
                            <div className="bg-gray-100 p-4 rounded-md shadow-md">
                                {standAloneLoadData?.hazardousMaterial || 'Data Not found'}
                            </div>
                        )}
                    </div>

                    {/* Item Description */}
                    <div className="mb-6">
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                            Item Description
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="itemDescription"
                                value={standAloneLoadData?.itemDescription || ''}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        ) : (
                            <div className="bg-gray-100 p-4 rounded-md shadow-md">
                                {standAloneLoadData?.itemDescription || 'Data Not found'}
                            </div>
                        )}
                    </div>

                    {/* Packaging */}
                    <div className="mb-6">
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                            Packaging
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="packaging"
                                value={standAloneLoadData?.packaging || ''}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        ) : (
                            <div className="bg-gray-100 p-4 rounded-md shadow-md">
                                {standAloneLoadData?.packaging || 'Data Not found'}
                            </div>
                        )}
                    </div>

                    {/* Dimensions */}
                    <div className="mb-6">
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                            Dimensions (L x W x H)
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="dimensions"
                                value={`${standAloneLoadData?.dimensions.length || ''} x ${standAloneLoadData?.dimensions.width || ''} x ${standAloneLoadData?.dimensions.height || ''}`}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        ) : (
                            <div className="bg-gray-100 p-4 rounded-md shadow-md">
                                {`${standAloneLoadData?.dimensions.length} x ${standAloneLoadData?.dimensions.width} x ${standAloneLoadData?.dimensions.height}`}
                            </div>
                        )}
                    </div>

                    {/* Weight */}
                    <div className="mb-6">
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                            Weight
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="weight"
                                value={standAloneLoadData?.weight || ''}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        ) : (
                            <div className="bg-gray-100 p-4 rounded-md shadow-md">
                                {standAloneLoadData?.weight}
                            </div>
                        )}
                    </div>

                    {/* Quantity */}
                    <div className="mb-6">
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                            Quantity
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="quantity"
                                value={standAloneLoadData?.quantity || ''}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        ) : (
                            <div className="bg-gray-100 p-4 rounded-md shadow-md">
                                {standAloneLoadData?.quantity}
                            </div>
                        )}
                    </div>

                    {/* Shipment Requirement */}
                    <div className="mb-6">
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                            Shipment Requirement
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="shipmentRequirement"
                                value={standAloneLoadData?.shipmentRequirement || ''}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        ) : (
                            <div className="bg-gray-100 p-4 rounded-md shadow-md">
                                {standAloneLoadData?.shipmentRequirement}
                            </div>
                        )}
                    </div>

                    {/* Status */}
                    <div className="mb-6">
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                            Status
                        </label>
                        {isEditing ? (
                            <select
                                name="status"
                                value={standAloneLoadData?.status || ''}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                                {statusOptions.map(option => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <div className="bg-gray-100 p-4 rounded-md shadow-md">
                                {standAloneLoadData?.status}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-center">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleSave}
                                    className="bg-blue-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-600 transition-colors"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="bg-gray-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-gray-600 transition-colors ml-4"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-blue-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-600 transition-colors"
                            >
                                Edit
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StandALoneLoadDetailPage;
