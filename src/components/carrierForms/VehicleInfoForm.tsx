import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import InputMask from 'react-input-mask';

const VehicleInfoForm = ({ errors }: { errors: any }) => {
    const { register } = useFormContext();
    return (
        <div className="space-y-6">
            <div className="flex flex-col">
                <Label htmlFor="truckNumber" className="text-sm font-medium text-gray-700">Truck Number</Label>
                <Input id="truckNumber" {...register('vehicleInformation.truckNumber')} placeholder="Enter truck number" className="mt-1" />
                {errors.vehicleInformation?.truckNumber && <p className="text-red-500 text-sm mt-1">{errors.vehicleInformation.truckNumber.message}</p>}
            </div>
            <div className="flex flex-col">
                <Label htmlFor="driverName" className="text-sm font-medium text-gray-700">Driver Name</Label>
                <Input id="driverName" {...register('vehicleInformation.driverName')} placeholder="Enter driver name" className="mt-1" />
                {errors.vehicleInformation?.driverName && <p className="text-red-500 text-sm mt-1">{errors.vehicleInformation.driverName.message}</p>}
            </div>
            <div className="flex flex-col">
                <Label htmlFor="driverContactNo" className="text-sm font-medium text-gray-700">Driver Contact No</Label>
                <InputMask
                    id='driverContactNo'
                    mask="(999) 999-9999"
                    {...register('vehicleInformation.driverContactNo')}
                    autoComplete='tel'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6'
                />
                {errors.vehicleInformation?.driverContactNo && <p className="text-red-500 text-sm mt-1">{errors.vehicleInformation?.driverContactNo.message}</p>}
            </div>
        </div>
    );
};

export default VehicleInfoForm;
