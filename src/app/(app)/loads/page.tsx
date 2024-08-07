"use client"
import React, { useState } from "react";
import LoadTypeSelector from "@/components/LoadTypeSelector";
import LoadsPage from "@/components/LoadsPage";
import StandAloneLoadPage from "@/components/StandAloneLoadPage";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const MainPage: React.FC = () => {
    const [selectedLoadType, setSelectedLoadType] = useState<string>("");
    const router = useRouter();

    const handleCreateLoad = () => {
        router.push('/loads/create');
    };

    const handleCreateStandaloneLoad = () => {
        router.push('/loads/create-standalone-load');
    };

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
        <div className="p-1 sm:p-2 md:p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-4">
                <div className="mb-4 sm:mb-0">
                    <LoadTypeSelector onSelect={setSelectedLoadType} />
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <Button className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-100" onClick={handleCreateLoad}>
                        Create Load
                    </Button>
                    <Button className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-100" onClick={handleCreateStandaloneLoad}>
                        Create Standalone Load
                    </Button>
                </div>
            </div>
            {renderContent()}
        </div>
    );
};

export default MainPage;
