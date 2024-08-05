// LoadTypeSelector.tsx
"use client";
import React, { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

const options = [
    {
        value: "load-associated-with-shipments",
        label: "Load associated with shipments",
    },
    {
        value: "stand-alone-loads",
        label: "Stand alone loads",
    },
];

interface LoadTypeSelectorProps {
    onSelect: (value: string) => void;
}

const LoadTypeSelector: React.FC<LoadTypeSelectorProps> = ({ onSelect }) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("load-associated-with-shipments");

    const handleSelect = (currentValue: string) => {
        setValue(currentValue);
        setOpen(false);
        onSelect(currentValue);
    };

    return (
        <div className="pl-6 pt-5">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[300px] justify-between"
                    >
                        {value
                            ? options.find((option) => option.value === value)?.label
                            : "Select load type..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                    <Command>
                        <CommandList>
                            <CommandGroup>
                                {options.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        value={option.value}
                                        onSelect={handleSelect}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === option.value ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {option.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default LoadTypeSelector;