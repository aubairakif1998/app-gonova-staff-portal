
// import React, { useState } from 'react';
// import { Input } from "@/components/ui/input";
// import { Shipper } from '@/Interfaces/Shipper';
// import { useRecoilState } from 'recoil';
// import { selectedShipperState } from '@/recoil/atom'
// interface ShipperDropDownProps {
//     shippers: Shipper[];
// }

// const ShipperDropDown: React.FC<ShipperDropDownProps> = ({ shippers }) => {
// const [showDropdown, setShowDropdown] = useState<Boolean>(false)
// const [inputValue, setInputValue] = useState<string>('')
// const [filteredShippers, setFilteredShippers] = useState<Shipper[]>(shippers)
// const [selectedShipper, setSelectedShipepr] = useRecoilState(selectedShipperState)
// const handleShipperClick = (shipper: Shipper) => {
//     setSelectedShipepr(shipper)
//     setInputValue(shipper.companyName)
//     setShowDropdown((prev) => !prev)
// }
//     const handleDropdownToggle = () => {
//         setShowDropdown((prev) => !prev)
//     }
//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const value = e.target.value;
//         setInputValue(value);
//         if (value) {
//             const filtered = filteredShippers
//                 .filter((shipper) =>
//                     shipper.companyName.toLowerCase().includes(value.toLowerCase())
//                 );
//             setFilteredShippers(filtered);
//         } else {
//             setFilteredShippers(shippers);
//         }

//         setShowDropdown(true);
//     };
//     return (
//         <div className="relative w-64">
//             <div className="flex items-center">
//                 <Input
//                     type="text"
//                     value={inputValue}
//                     onChange={handleInputChange}
//                     onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
//                     onFocus={() => setShowDropdown(true)}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-l"
//                     placeholder="Type to search..."
//                 />
//                 <button
//                     type="button"
//                     className="px-4 py-1 text-white bg-black border border-blue-500 rounded-r"
//                     onClick={handleDropdownToggle}
//                 >
//                     &#x25BC;
//                 </button>
//             </div>
//             {showDropdown && (
//                 <ul className="absolute w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
//                     {filteredShippers.map((shipper, index) => (
//                         <li
//                             key={index}
//                             onMouseDown={() => handleShipperClick(shipper)}
//                             className="px-4 py-2 cursor-pointer hover:bg-gray-100"
//                         >
//                             {shipper.companyName}
//                         </li>
//                     ))}
//                 </ul>
//             )}
//         </div>
//     );
// };

// export default ShipperDropDown;


"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Input } from "@/components/ui/input";
import { Shipper } from '@/Interfaces/Shipper';
import { useRecoilState } from 'recoil';
import { selectedShipperState } from '@/recoil/atom'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"


interface ShipperDropDownProps {
    shippers: Shipper[];
}


export const ShipperDropDown: React.FC<ShipperDropDownProps> = ({ shippers }) => {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")
    const [selectedShipper, setSelectedShipepr] = useRecoilState(selectedShipperState)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {value
                        ? shippers.find((shipper) => shipper.companyName === value)?.companyName
                        : "Select Shipper"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search by Company" />
                    <CommandList>
                        <CommandEmpty>No Shipper found.</CommandEmpty>
                        <CommandGroup>
                            {shippers.map((shipper) => (
                                <CommandItem
                                    key={shipper._id}
                                    value={shipper.companyName}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue === value ? currentValue : currentValue)
                                        setOpen(false)
                                        setSelectedShipepr(shipper)
                                    }}

                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === shipper.companyName ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {shipper.companyName}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
