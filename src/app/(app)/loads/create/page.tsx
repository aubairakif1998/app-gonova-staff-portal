'use client';

import React from 'react';
import { useRecoilState } from 'recoil';
import Autocomplete from '@/components/AutoComplete';
import { selectedShipperState } from '@/recoil/atom';
import { Shipper } from '@/types/Shipper';

const Page: React.FC = () => {
    // Use Recoil state for selectedShipper
    const [selectedShipper, setSelectedShipper] = useRecoilState(selectedShipperState);

    const handleSelectShipper = (shipper: Shipper) => {
        setSelectedShipper(shipper);
    };

    return (
        <div>
            <h1>Create Load</h1>
            <Autocomplete onSelectShipper={handleSelectShipper} />
            {selectedShipper && (
                <div>
                    Selected Shipper: {selectedShipper.companyName} (ID: {selectedShipper._id})
                </div>
            )}
            {/* Other components and logic can be integrated here */}
        </div>
    );
};

export default Page;
