"use client";
import React, { useState } from 'react';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CarrierSchema } from '@/schemas/carrierSchema';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import ClipLoader from 'react-spinners/ClipLoader';
import CarrierInfoForm from '@/components/carrierForms/CarrierInfoForm';
import AddressForm from '@/components/carrierForms/AddressForm';
import ContactsForm from '@/components/carrierForms/ContactsForm';
import VehicleInfoForm from '@/components/carrierForms/VehicleInfoForm';
import { toast } from '@/components/ui/use-toast';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/Interfaces/ApiResponse';

const steps = [
    { id: 'Step 1', name: 'Carrier Info', fields: ['companyName', 'transportMCNumber', 'dot'] },
    { id: 'Step 2', name: 'Address', fields: ['addressZip', 'addressStreet', 'addressCity'] },
    { id: 'Step 3', name: 'Contacts', fields: ['contacts.primary.email', 'contacts.primary.phone', 'contacts.primary.workingHours', 'contacts.secondary.email', 'contacts.secondary.phone', 'contacts.secondary.workingHours'] },
    { id: 'Step 4', name: 'Vehicle Info', fields: ['vehicleInformation.truckNumber', 'vehicleInformation.driverName', 'vehicleInformation.driverContactNo'] },
    { id: 'Step 5', name: 'Preview', fields: [] },
    { id: 'Step 6', name: 'Complete' }
];

type Inputs = z.infer<typeof CarrierSchema>;

const CarrierFormStepper = () => {
    const [previousStep, setPreviousStep] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const delta = currentStep - previousStep;
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const methods = useForm<Inputs>({
        resolver: zodResolver(CarrierSchema),
    });
    const [hasException, setHasException] = useState(false);
    const { handleSubmit, trigger, getValues, formState: { errors }, reset } = methods;

    const processForm: SubmitHandler<Inputs> = async data => {
        setLoading(true);
        try {
            const response = await axios.post<ApiResponse>('/api/create-carrier', { carrierData: data });
            console.log(response.data.message);
            toast({
                title: response.data.message,
                variant: 'default',
            });
            router.push('/carriers');
            reset();
            setCurrentStep(-1);
            setPreviousStep(0);
        } catch (error) {
            console.error('Create quote error:', error);
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Error',
                description:
                    axiosError.response?.data.message ??
                    'Failed to create carrier',
                variant: 'destructive',
            });
            setPreviousStep(currentStep);
            setCurrentStep(step => step - 1);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    type FieldName = keyof Inputs;

    const next = async () => {

        const fields = steps[currentStep].fields;
        const output = await trigger(fields as FieldName[], { shouldFocus: true });

        if (!output) return;
        if (!hasException) {
            if (currentStep === steps.length - 2) {
                setPreviousStep(currentStep);
                setCurrentStep(step => step + 1);
            } else if (currentStep < steps.length - 1) {
                setPreviousStep(currentStep);
                setCurrentStep(step => step + 1);
            } else if (currentStep === steps.length - 1) {
                await handleSubmit(processForm)();
            }
        }

    };

    const prev = () => {
        if (currentStep > 0) {
            setPreviousStep(currentStep);
            setCurrentStep(step => step - 1);
        }
    };

    const renderPreview = () => {
        const data = getValues();
        return (
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Review Your Information</h2>
                <div className="space-y-4">
                    {/* Carrier Info Card */}
                    <div className="p-3 border rounded-lg shadow-sm bg-white">
                        <h3 className="text-lg font-semibold mb-1">Carrier Info</h3>
                        <p><strong>Company Name:</strong> {data.companyName}</p>
                        <p><strong>Transport MC Number:</strong> {data.transportMCNumber}</p>
                        <p><strong>DOT:</strong> {data.dot}</p>
                    </div>

                    {/* Address Card */}
                    <div className="p-3 border rounded-lg shadow-sm bg-white">
                        <h3 className="text-lg font-semibold mb-1">Address</h3>
                        <p><strong>Street:</strong> {data.addressStreet}</p>
                        <p><strong>City:</strong> {data.addressCity}</p>
                        <p><strong>ZIP Code:</strong> {data.addressZip}</p>
                    </div>

                    {/* Contacts Card */}
                    <div className="p-3 border rounded-lg shadow-sm bg-white">
                        <h3 className="text-lg font-semibold mb-1">Contacts</h3>
                        <p><strong>Primary Email:</strong> {data.contacts.primary.email}</p>
                        <p><strong>Primary Phone:</strong> {data.contacts.primary.phone}</p>
                        <p><strong>Primary Working Hours:</strong> {data.contacts.primary.workingHours}</p>
                        {data.contacts.secondary && (
                            <>
                                <p><strong>Secondary Email:</strong> {data.contacts.secondary.email}</p>
                                <p><strong>Secondary Phone:</strong> {data.contacts.secondary.phone}</p>
                                <p><strong>Secondary Working Hours:</strong> {data.contacts.secondary.workingHours}</p>
                            </>
                        )}
                    </div>

                    {/* Vehicle Info Card */}
                    <div className="p-3 border rounded-lg shadow-sm bg-white">
                        <h3 className="text-lg font-semibold mb-1">Vehicle Info</h3>
                        <p><strong>Truck Number:</strong> {data.vehicleInformation.truckNumber}</p>
                        <p><strong>Driver Name:</strong> {data.vehicleInformation.driverName}</p>
                        <p><strong>Driver Contact:</strong> {data.vehicleInformation.driverContactNo}</p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <section className='absolute inset-0 flex flex-col justify-between p-24'>
            {loading && (
                <div className="flex flex-col justify-center items-center min-h-screen">
                    <ClipLoader color="#000" loading={true} size={50} />
                    <p className="mt-4 text-lg font-medium">Creating...</p>
                </div>
            )}
            {!loading && (
                <>
                    <nav aria-label='Progress'>
                        <ol role='list' className='space-y-4 md:flex md:space-x-8 md:space-y-0'>
                            {steps.map((step, index) => (
                                <li key={step.name} className='md:flex-1'>
                                    {currentStep > index ? (
                                        <div className='group flex w-full flex-col border-l-4 border-black py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'>
                                            <span className='text-sm font-medium text-black transition-colors '>
                                                {step.id}
                                            </span>
                                            <span className='text-sm font-medium'>{step.name}</span>
                                        </div>
                                    ) : currentStep === index ? (
                                        <div
                                            className='flex w-full flex-col border-l-4 border-black py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'
                                            aria-current='step'
                                        >
                                            <span className='text-sm font-medium text-black'>
                                                {step.id}
                                            </span>
                                            <span className='text-sm font-medium'>{step.name}</span>
                                        </div>
                                    ) : (
                                        <div className='group flex w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'>
                                            <span className='text-sm font-medium text-gray-500 transition-colors'>
                                                {step.id}
                                            </span>
                                            <span className='text-sm font-medium'>{step.name}</span>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ol>
                    </nav>

                    <form className='mt-12 py-12' onSubmit={handleSubmit(processForm)}>
                        <FormProvider {...methods}>
                            {currentStep === 0 && (
                                <motion.div
                                    initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                >
                                    <CarrierInfoForm errors={errors} setHasException={setHasException} />
                                </motion.div>
                            )}
                            {currentStep === 1 && (
                                <motion.div
                                    initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                >
                                    <AddressForm errors={errors} />
                                </motion.div>
                            )}
                            {currentStep === 2 && (
                                <motion.div
                                    initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                >
                                    <ContactsForm errors={errors} />
                                </motion.div>
                            )}
                            {currentStep === 3 && (
                                <motion.div
                                    initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                >
                                    <VehicleInfoForm errors={errors} />
                                </motion.div>
                            )}
                            {currentStep === 4 && renderPreview()}
                            {currentStep === 5 && (
                                <motion.div
                                    initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                >
                                    <div className="text-center">
                                        <h2 className="text-2xl font-bold">Form Completed!</h2>
                                        <p className="mt-4">Review your information and submit the form.</p>
                                    </div>
                                </motion.div>
                            )}
                        </FormProvider>
                        <div className='flex justify-between mt-8'>
                            {currentStep > 0 && (
                                <button
                                    type='button'
                                    className='py-2 px-4 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
                                    onClick={prev}
                                >
                                    Back
                                </button>
                            )}
                            <button
                                type='button'
                                className='py-2 px-4 text-sm font-medium text-black bg-white border border-black rounded-md hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500'
                                onClick={next}
                            >
                                {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
                            </button>
                        </div>
                    </form>
                </>
            )}
        </section>
    );
};

export default CarrierFormStepper;
