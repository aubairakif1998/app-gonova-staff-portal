
// import React, { useState } from 'react';
// import { Input } from "@/components/ui/input";
// import { Carrier } from '@/Interfaces/carrier';
// import { useRecoilState } from 'recoil';
// import { selectedCarrierState } from '@/recoil/atom'
// interface CarrierDropdownProps {
//     carriers: Carrier[];
// }

// const CarrierDropdown: React.FC<CarrierDropdownProps> = ({ carriers }) => {
// const [showDropdown, setShowDropdown] = useState<Boolean>(false)
// const [inputValue, setInputValue] = useState<string>('')
// const [filteredCarriers, setFilteredCarriers] = useState<Carrier[]>(carriers)
// const [selectedCarrier, setSelectedCarrier] = useRecoilState(selectedCarrierState)
// const handleShipperClick = (carrier: Carrier) => {
//     setSelectedCarrier(carrier)
//     setInputValue(carrier.transportMCNumber)
//     setShowDropdown((prev) => !prev)
// }
// const handleDropdownToggle = () => {
//     setShowDropdown((prev) => !prev)
// }
// const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setInputValue(value);
//     if (value) {
//         const filtered = filteredCarriers
//             .filter((carrier) =>
//                 carrier.transportMCNumber.toLowerCase().includes(value.toLowerCase())
//             );
//         setFilteredCarriers(filtered);
//     } else {
//         setFilteredCarriers(carriers);
//     }

//     setShowDropdown(true);
// };
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
//                     placeholder="Type to search carriers"
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
//                     {filteredCarriers.map((carrier, index) => (
//                         <li
//                             key={index}
//                             onMouseDown={() => handleShipperClick(carrier)}
//                             className="px-4 py-2 cursor-pointer hover:bg-gray-100"
//                         >
//                             {carrier.transportMCNumber}
//                         </li>
//                     ))}
//                 </ul>
//             )}
//         </div>
//     );
// };

// export default CarrierDropdown;



"use client"
import { Carrier } from '@/Interfaces/carrier';
import { useRecoilState } from 'recoil';
import { selectedCarrierState } from '@/recoil/atom'
import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Input } from "@/components/ui/input";
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


interface CarrierDropdownProps {
    carriers: Carrier[];
}


export const CarrierDropdown: React.FC<CarrierDropdownProps> = ({ carriers }) => {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")
    const [selectedCarrier, setSelectedCarrier] = useRecoilState(selectedCarrierState)
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
                        ? carriers.find((carrier) => carrier.transportMCNumber === value)?.transportMCNumber
                        : "Select Carrier"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search by MC number" />
                    <CommandList>
                        <CommandEmpty>No carrier found.</CommandEmpty>
                        <CommandGroup>
                            {carriers.map((carrier) => (
                                <CommandItem
                                    key={carrier._id}
                                    value={carrier.transportMCNumber}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                        setSelectedCarrier(carrier)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === carrier.transportMCNumber ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {carrier.transportMCNumber}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
