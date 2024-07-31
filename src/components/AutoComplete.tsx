import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Shipper } from '@/types/Shipper';
import { fetchAllShippers } from '@/services/shipperService'; // Adjust the import path as necessary

interface AutocompleteProps {
    onSelectShipper: (shipper: Shipper) => void;
}

const Autocomplete: React.FC<AutocompleteProps> = ({ onSelectShipper }) => {
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [shippers, setShippers] = useState<Shipper[]>([]);

    useEffect(() => {
        const fetchShippers = async () => {
            const data = await fetchAllShippers();
            if (data.success) {
                setShippers(data.shippers);
                setFilteredSuggestions(data.shippers.map(shipper => shipper.companyName));
            }
        };

        fetchShippers();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);

        if (value) {
            const filtered = shippers
                .map(shipper => shipper.companyName)
                .filter((companyName) =>
                    companyName.toLowerCase().includes(value.toLowerCase())
                );
            setFilteredSuggestions(filtered);
        } else {
            setFilteredSuggestions(shippers.map(shipper => shipper.companyName));
        }

        setShowDropdown(true);
    };

    const handleSuggestionClick = (companyName: string) => {
        setInputValue(companyName);
        setFilteredSuggestions(shippers.map(shipper => shipper.companyName));
        setShowDropdown(false);

        const selectedShipper = shippers.find(shipper => shipper.companyName === companyName);
        if (selectedShipper) {
            onSelectShipper(selectedShipper);
        }
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
                    onClick={() => setShowDropdown((prev) => !prev)}
                >
                    &#x25BC;
                </button>
            </div>
            {showDropdown && (
                <ul className="absolute w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
                    {filteredSuggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            onMouseDown={() => handleSuggestionClick(suggestion)}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Autocomplete;
