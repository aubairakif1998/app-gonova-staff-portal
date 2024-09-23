'use client'

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import InputMask from 'react-input-mask';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ApiResponse } from '@/Interfaces/ApiResponse';
import { useDebounce } from 'usehooks-ts';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { customerOnBoradingSchema } from '@/schemas/customerOnBoradingSchema';

type Inputs = z.infer<typeof customerOnBoradingSchema>;

export default function OnboardCustomer() {
    const router = useRouter();
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
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(customerOnBoradingSchema),
    });

    const processForm: SubmitHandler<Inputs> = async (data) => {
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

    return (
        <section className='flex flex-col justify-between p-10'>
            <div className="text-center mb-12">
                <p className="text-md font-bold tracking-tight lg:text-3xl text-gray-800">Customer Onboarding</p>
            </div>

            <form className='mt-8 py-4' onSubmit={handleSubmit(processForm)}>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
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

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.1 }}>
                    <h2 className='text-sm font-semibold text-gray-900'>Address</h2>
                    <div className='mt-6 grid grid-cols-1 gap-4'>
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

                <div className="flex justify-end mt-4">
                    <Button type='submit' className='w-32' disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : 'Submit'}
                    </Button>
                </div>
            </form>
        </section>
    );
}
