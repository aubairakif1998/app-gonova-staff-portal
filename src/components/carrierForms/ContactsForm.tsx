import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import InputMask from 'react-input-mask';

const ContactsForm = ({ errors }: { errors: any }) => {
    const { register } = useFormContext();
    return (
        <div className="space-y-6">
            <div className="flex flex-col">
                <Label htmlFor="primaryEmail" className="text-sm font-medium text-gray-700">Primary Email</Label>
                <Input id="primaryEmail" {...register('contacts.primary.email')} placeholder="Enter primary email" className="mt-1" />
                {errors.contacts?.primary?.email && <p className="text-red-500 text-sm mt-1">{errors.contacts.primary.email.message}</p>}
            </div>
            <div className="flex flex-col">
                <Label htmlFor="primaryPhone" className="text-sm font-medium text-gray-700">Primary Phone</Label>

                <InputMask
                    id='primaryPhone'
                    mask="(999) 999-9999"
                    {...register('contacts.primary.phone')}
                    autoComplete='tel'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6'
                />

                {errors.contacts?.primary?.phone && <p className="text-red-500 text-sm mt-1">{errors.contacts.primary.phone.message}</p>}
            </div>
            <div className="flex flex-col">
                <Label htmlFor="primaryWorkingHours" className="text-sm font-medium text-gray-700">Primary Working Hours</Label>
                <Input id="primaryWorkingHours" {...register('contacts.primary.workingHours')} placeholder="Enter primary working hours" className="mt-1" />
                {errors.contacts?.primary?.workingHours && <p className="text-red-500 text-sm mt-1">{errors.contacts.primary.workingHours.message}</p>}
            </div>
            <div className="flex flex-col">
                <Label htmlFor="secondaryEmail" className="text-sm font-medium text-gray-700">Secondary Email</Label>
                <Input id="secondaryEmail" {...register('contacts.secondary.email')} placeholder="Enter secondary email" className="mt-1" />
                {errors.contacts?.secondary?.email && <p className="text-red-500 text-sm mt-1">{errors.contacts.secondary.email.message}</p>}
            </div>
            <div className="flex flex-col">
                <Label htmlFor="secondaryPhone" className="text-sm font-medium text-gray-700">Secondary Phone</Label>

                <InputMask
                    id='secondaryPhone'
                    mask="(999) 999-9999"
                    {...register('contacts.secondary.phone')}
                    autoComplete='tel'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6'
                />



                {errors.contacts?.secondary?.phone && <p className="text-red-500 text-sm mt-1">{errors.contacts.secondary.phone.message}</p>}
            </div>
            <div className="flex flex-col">
                <Label htmlFor="secondaryWorkingHours" className="text-sm font-medium text-gray-700">Secondary Working Hours</Label>
                <Input id="secondaryWorkingHours" {...register('contacts.secondary.workingHours')} placeholder="Enter secondary working hours" className="mt-1" />
                {errors.contacts?.secondary?.workingHours && <p className="text-red-500 text-sm mt-1">{errors.contacts.secondary.workingHours.message}</p>}
            </div>
        </div>
    );
};

export default ContactsForm;
