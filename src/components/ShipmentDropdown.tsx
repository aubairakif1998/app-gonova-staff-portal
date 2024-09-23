import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { useRouter } from 'next/navigation';
import { useRecoilState, useRecoilValue } from 'recoil';
import { selectedShipmentState, selectedShipperState } from '@/recoil/atom';
import { Shipment } from '@/Interfaces/Shipment';

interface ShipmentDropdownProps {
    shipments: Shipment[];
}

const ShipmentDropdown: React.FC<ShipmentDropdownProps> = ({ shipments }) => {
    const router = useRouter();
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>('');
    const [filteredShipments, setFilteredShipments] = useState<Shipment[]>(shipments);
    const [selectedShipment, setSelectedShipment] = useRecoilState(selectedShipmentState);
    const selectedShipper = useRecoilValue(selectedShipperState);

    useEffect(() => {
        setFilteredShipments(shipments);
    }, [shipments]);

    useEffect(() => {
        setSelectedShipment(null); // Reset selected shipment
        setInputValue(''); // Reset input value
        setFilteredShipments(shipments); // Reset filtered shipments
    }, [selectedShipper, setSelectedShipment, shipments]);

    const handleShipmentClick = (shipment: Shipment) => {
        setSelectedShipment(shipment);
        setInputValue(shipment.shipmentID);
        setShowDropdown(false);
    };

    const handleStandAloneLoad = () => {
        setShowDropdown(false);
        router.push('/loads/create-standalone-load');
    };

    const handleDropdownToggle = () => {
        setShowDropdown((prev) => !prev);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        if (value) {
            const filtered = shipments.filter((shipment) =>
                shipment.shipmentID.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredShipments(filtered);
        } else {
            setFilteredShipments(shipments);
        }
        setShowDropdown(true);
    };

    return (
        <div className="relative w-64">
            <div className="flex items-center">
                <Input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
                    onFocus={() => setShowDropdown(true)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-l"
                    placeholder="Type to search..."
                />
                <button
                    type="button"
                    className="px-4 py-1 text-white bg-black border border-blue-500 rounded-r"
                    onClick={handleDropdownToggle}
                >
                    &#x25BC;
                </button>
            </div>
            {showDropdown && (
                <ul className="absolute w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
                    {filteredShipments.length > 0 ? (
                        filteredShipments.map((shipment) => (


                            <>
                                <li
                                    key={shipment._id}
                                    onMouseDown={() => handleShipmentClick(shipment)}
                                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                >
                                    {shipment.shipmentID}
                                </li>

                            </>

                        ))
                    ) : (
                        <li className="px-4 py-2">No shipments available</li>
                    )}
                    <li
                        key={'stanAloneShipment'}
                        onMouseDown={handleStandAloneLoad}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100 font-bold text-black"
                    >
                        Create standalone load
                    </li>
                </ul>
            )}
        </div>
    );
};

export default ShipmentDropdown;
