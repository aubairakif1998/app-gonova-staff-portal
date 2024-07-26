import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"


const CarrierInfoForm = ({ errors }: { errors: any }) => {
    const { register } = useFormContext();
    return (
        <div className="space-y-6">
            <div className="flex flex-col">
                <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">Company Name</Label>
                <Input id="companyName" {...register('companyName')} placeholder="Enter company name" className="mt-1" />
                {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>}
            </div>
            <div className="flex flex-col">
                <Label htmlFor="transportMCNumber" className="text-sm font-medium text-gray-700">Transport MC Number</Label>
                <Input type="text" id="transportMCNumber" {...register('transportMCNumber')} placeholder="Enter transport MC number" className="mt-1" />
                {errors.transportMCNumber && <p className="text-red-500 text-sm mt-1">{errors.transportMCNumber.message}</p>}
            </div>
            <div className="flex flex-col">
                <Label htmlFor="dot" className="text-sm font-medium text-gray-700">DOT</Label>
                <Input id="dot" {...register('dot')} placeholder="Enter DOT number" className="mt-1" />
                {errors.dot && <p className="text-red-500 text-sm mt-1">{errors.dot.message}</p>}
            </div>
        </div>
    );
};

export default CarrierInfoForm;
