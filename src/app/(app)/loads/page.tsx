
"use client"
import React, { useState } from "react";
import LoadTypeSelector from "@/components/LoadTypeSelector";
import LoadsPage from "@/components/LoadsPage";
import StandAloneLoadPage from "@/components/StandAloneLoadPage";
import Image from 'next/image';
import ClipLoader from "react-spinners/ClipLoader";
const MainPage: React.FC = () => {
    const [selectedLoadType, setSelectedLoadType] = useState<string>("");

    const renderContent = () => {
        switch (selectedLoadType) {
            case "load-associated-with-shipments":
                return <LoadsPage />;
            case "stand-alone-loads":
                return <StandAloneLoadPage />;
            default:
                return <LoadsPage />;
        }
    };

    return (
        <div className="">
            <LoadTypeSelector onSelect={setSelectedLoadType} />
            {renderContent()}

        </div>
    );
};

export default MainPage;
