'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import InputMask from 'react-input-mask';
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, SubmitHandler } from 'react-hook-form'
import { ApiResponse } from '@/Interfaces/ApiResponse';
import { useDebounce } from 'usehooks-ts';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { customerOnBoradingSchema } from '@/schemas/customerOnBoradingSchema';

type Inputs = z.infer<typeof customerOnBoradingSchema>

const steps = [
    {
        id: 'Step 1',
        name: 'Customer/Shipper Information',
        fields: ['email', 'phoneNumber', 'companyName']
    },
    {
        id: 'Step 2',
        name: 'Address',
        fields: ['state', 'city', 'locationAddress', 'zip']
    }
]

export default function OnboardCustomer() {
    const router = useRouter();
    const [previousStep, setPreviousStep] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const delta = currentStep - previousStep;

    const [companyName, setCompanyName] = useState('');
    const [companyNameMessage, setCompanyNameMessage] = useState('');
    const [isCheckingCompanyName, setIsCheckingCompanyName] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const debouncedCompanyName = useDebounce(companyName, 300);

    useEffect(() => {
        const checkCompanyNameUnique = async () => {
            if (debouncedCompanyName) {
                setIsCheckingCompanyName(true);
                setCompanyNameMessage(''); // Reset message
                try {
                    const response = await axios.get<ApiResponse>(
                        `/api/check-companyName-unique?companyName=${debouncedCompanyName}`
                    );
                    setCompanyNameMessage(response.data.message);
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    setCompanyNameMessage(
                        axiosError.response?.data.message ?? 'Error checking companyName'
                    );
                } finally {
                    setIsCheckingCompanyName(false);
                }
            }
        };
        checkCompanyNameUnique();
    }, [debouncedCompanyName]);

    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors }
    } = useForm<Inputs>({
        resolver: zodResolver(customerOnBoradingSchema)
    });

    const processForm: SubmitHandler<Inputs> = async data => {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/boarding', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' },
            });

            const result = await response.json();
            if (result.success) {
                toast({ title: 'Success', description: 'Customer registered successfully. Activation email sent.' });
                router.push('/shippers');
            } else {
                toast({ title: 'Error', description: result.message || 'Error registering customer.' });
            }
        } catch (error) {
            toast({ title: 'Error', description: 'Error submitting the form. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    type FieldName = keyof Inputs;

    const next = async () => {
        const fields = steps[currentStep].fields;
        const output = await trigger(fields as FieldName[], { shouldFocus: true });

        if (!output) return;

        if (currentStep < steps.length - 1) {
            setPreviousStep(currentStep);
            setCurrentStep(step => step + 1);
        }
    };

    const prev = () => {
        if (currentStep > 0) {
            setPreviousStep(currentStep);
            setCurrentStep(step => step - 1);
        }
    };

    return (
        <section className='flex flex-col justify-between p-10 '>
            <div className="text-center mb-12">
                <p className="text-md font-bold tracking-tight lg:text-3xl text-gray-800">Customer on boarding</p>
            </div>
            <nav aria-label='Progress'>
                <ol role='list' className='space-y-2 md:flex md:space-x-4 md:space-y-0'>
                    {steps.map((step, index) => (
                        <li key={step.name} className='md:flex-1'>
                            {currentStep > index ? (
                                <div className='group flex w-full flex-col border-l-4 border-black py-1 pl-2 md:border-l-0 md:border-t-4'>
                                    <span className='text-xs font-medium text-black'>{step.id}</span>
                                    <span className='text-xs font-medium'>{step.name}</span>
                                </div>
                            ) : currentStep === index ? (
                                <div className='flex w-full flex-col border-l-4 border-black py-1 pl-2 md:border-l-0 md:border-t-4' aria-current='step'>
                                    <span className='text-xs font-medium text-black'>{step.id}</span>
                                    <span className='text-xs font-medium'>{step.name}</span>
                                </div>
                            ) : (
                                <div className='group flex w-full flex-col border-l-4 border-gray-200 py-1 pl-2 md:border-l-0 md:border-t-4'>
                                    <span className='text-xs font-medium text-gray-500'>{step.id}</span>
                                    <span className='text-xs font-medium'>{step.name}</span>
                                </div>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>

            <form className='mt-8 py-4' onSubmit={handleSubmit(processForm)}>
                {currentStep === 0 && (
                    <motion.div initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.3, ease: 'easeInOut' }}>
                        <h2 className='text-sm font-semibold text-gray-900'>Customer/Shipper Information</h2>
                        <div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-6'>
                            <div className='sm:col-span-4'>
                                <label htmlFor='email' className='block text-xs font-medium text-gray-900'>Email address</label>
                                <input id='email' type='email' {...register('email')} autoComplete='email' className='block w-full rounded-md border-0 py-1 text-gray-900 shadow-sm text-sm' />
                                {errors.email?.message && <p className='mt-1 text-xs text-red-400'>{errors.email.message}</p>}
                            </div>

                            <div className='sm:col-span-3'>
                                <label htmlFor='companyName' className='block text-xs font-medium text-gray-900'>Company Name</label>
                                <input id='companyName' {...register('companyName', { onChange: (e) => setCompanyName(e.target.value) })} className='block w-full rounded-md py-1 text-gray-900 text-sm' />
                                {isCheckingCompanyName && <Loader2 className="animate-spin h-4 w-4" />}
                                {!isCheckingCompanyName && companyNameMessage && <p className={`mt-1 text-xs ${companyNameMessage.includes('taken') ? 'text-red-400' : 'text-green-400'}`}>{companyNameMessage}</p>}
                                {errors.companyName?.message && <p className='mt-1 text-xs text-red-400'>{errors.companyName.message}</p>}
                            </div>

                            <div className='sm:col-span-3'>
                                <label htmlFor='phoneNumber' className='block text-xs font-medium text-gray-900'>Phone Number</label>
                                <InputMask mask="(999) 999-9999" {...register('phoneNumber')} className='block w-full rounded-md py-1 text-gray-900 text-sm' />
                                {errors.phoneNumber && <p className='mt-1 text-xs text-red-400'>{errors.phoneNumber.message}</p>}
                            </div>
                        </div>
                    </motion.div>
                )}

                {currentStep === 1 && (
                    <motion.div initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.3, ease: 'easeInOut' }}>
                        <h2 className='text-sm font-semibold text-gray-900'>Address</h2>
                        <div className='mt-6'>
                            <div className='sm:col-span-4'>
                                <label htmlFor='locationAddress' className='block text-xs font-medium text-gray-900'>Street address</label>
                                <input id='locationAddress' type='text' {...register('locationAddress')} className='block w-full rounded-md border-0 py-1 text-gray-900 shadow-sm text-sm' />
                                {errors.locationAddress && <p className='mt-1 text-xs text-red-400'>{errors.locationAddress.message}</p>}
                            </div>
                            <div className='sm:col-span-2'>
                                <label htmlFor='city' className='block text-xs font-medium text-gray-900'>City</label>
                                <input id='city' type='text' {...register('city')} className='block w-full rounded-md border-0 py-1 text-gray-900 shadow-sm text-sm' />
                                {errors.city && <p className='mt-1 text-xs text-red-400'>{errors.city.message}</p>}
                            </div>

                            <div className='sm:col-span-2'>
                                <label htmlFor='zip' className='block text-xs font-medium text-gray-900'>ZIP / Postal code</label>
                                <input id='zip' type='text' {...register('zip')} className='block w-full rounded-md border-0 py-1 text-gray-900 shadow-sm text-sm' />
                                {errors.zip && <p className='mt-1 text-xs text-red-400'>{errors.zip.message}</p>}
                            </div>
                        </div>
                    </motion.div>
                )}

                <div className="flex justify-between mt-4">
                    {currentStep > 0 && (
                        <Button type='button' variant='outline' onClick={prev}>Previous</Button>
                    )}
                    {currentStep === steps.length - 1 ? (
                        <Button type='submit' className='w-32' disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : 'Submit'}
                        </Button>
                    ) : (
                        <Button type='button' onClick={next}>Next</Button>
                    )}
                </div>
            </form>
        </section>
    )
}
