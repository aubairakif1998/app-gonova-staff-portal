'use client'

import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast, useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormDataSchema } from '@/schemas/schema'
import { ApiResponse } from '@/types/ApiResponse';

const AccessTypeSchema = z.object({
    email: z.string().email('Invalid email address'),
    accessType: z.enum(['contributor', 'admin', 'viewer'], {
        errorMap: () => ({ message: 'Invalid Access Type' })
    }),
});

type Inputs = z.infer<typeof AccessTypeSchema>;

export default function StaffRegistrationForm() {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [generatedPassword, setGeneratedPassword] = useState('');

    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({
        resolver: zodResolver(AccessTypeSchema)
    });

    const processForm: SubmitHandler<Inputs> = async data => {
        setIsSubmitting(true);
        try {
            const response = await axios.post<ApiResponse>('/api/register-staff', data);
            toast({
                title: 'Success',
                description: 'response.data.message',
            });
            setGeneratedPassword(response.data.data.password); // Assuming the password is returned in the response
            setIsDialogOpen(true);
        } catch (error) {
            console.error('Error during staff registration:', error);
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message ?? 'There was a problem with the registration. Please try again.';
            toast({
                title: 'Registration Failed',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleCopyPassword = async () => {
        try {
            await navigator.clipboard.writeText(generatedPassword);
            toast({
                title: 'Copied',
                description: 'Password copied to clipboard',
            });
        } catch (err) {
            toast({
                title: 'Copy Failed',
                description: 'Failed to copy the password. Please try again.',
                variant: 'destructive',
            });
        }
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        router.replace('/');
    };

    return (
        <section className='absolute inset-0 flex flex-col justify-center items-center p-14 bg-gray-100'>
            <div className="text-center">
                <h1 className="text-2xl font-extrabold tracking-tight lg:text-5xl mb-16">
                    Staff Portal Registration
                </h1>
            </div>

            <form className='w-full max-w-md' onSubmit={handleSubmit(processForm)}>
                <div className='mb-4'>
                    <label
                        htmlFor='email'
                        className='block text-sm font-medium leading-6 text-gray-900'
                    >
                        Email address
                    </label>
                    <div className='mt-2'>
                        <input
                            id='email'
                            type='email'
                            {...register('email')}
                            autoComplete='email'
                            className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6'
                        />
                        {errors.email?.message && (
                            <p className='mt-2 text-sm text-red-400'>
                                {errors.email.message}
                            </p>
                        )}
                    </div>
                </div>

                <div className='mb-4'>
                    <label
                        htmlFor='accessType'
                        className='block text-sm font-medium leading-6 text-gray-900'
                    >
                        Access Type
                    </label>
                    <div className='mt-2'>
                        <select
                            id='accessType'
                            {...register('accessType')}
                            className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6'
                        >
                            <option value="contributor">Contributor</option>
                            <option value="admin">Admin</option>
                            <option value="viewer">Viewer</option>
                        </select>
                        {errors.accessType?.message && (
                            <p className='mt-2 text-sm text-red-400'>
                                {errors.accessType.message}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between mt-6">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full text-black border-2 border-black ${isSubmitting ? 'bg-gray-500 cursor-not-allowed' : 'hover:bg-black hover:text-white'} transition duration-300 ease-in-out`}
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" /> : 'Submit'}
                    </Button>
                </div>
            </form>

            {isDialogOpen && (
                <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center'>
                    <div className='bg-white p-8 rounded shadow-lg'>
                        <h2 className='text-xl font-bold mb-4'>Your Generated Password</h2>
                        <p className='mb-4'>{generatedPassword}</p>
                        <button
                            onClick={handleCopyPassword}
                            className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700'
                        >
                            Copy Password
                        </button>
                        <button
                            onClick={handleCloseDialog}
                            className='ml-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700'
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}
        </section>
    )
}
