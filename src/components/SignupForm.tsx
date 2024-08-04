'use client'

import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast, useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ApiResponse } from '@/Interfaces/ApiResponse'

const AccessTypeSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
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

    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({
        resolver: zodResolver(AccessTypeSchema)
    });

    const processForm: SubmitHandler<Inputs> = async data => {
        setIsSubmitting(true);
        try {
            const response = await axios.post<ApiResponse>('/api/sign-up', data);
            toast({
                title: 'Success',
                description: response.data.message,
            });
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
                        htmlFor='password'
                        className='block text-sm font-medium leading-6 text-gray-900'
                    >
                        Password
                    </label>
                    <div className='mt-2'>
                        <input
                            id='password'
                            type='password'
                            {...register('password')}
                            autoComplete='new-password'
                            className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6'
                        />
                        {errors.password?.message && (
                            <p className='mt-2 text-sm text-red-400'>
                                {errors.password.message}
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
                        className={`w-full text-gray-100 border-2 border-black ${isSubmitting ? 'bg-gray-500 cursor-not-allowed' : 'hover:bg-black hover:text-white'} transition duration-300 ease-in-out`}
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" /> : 'Submit'}
                    </Button>
                </div>
            </form>

            {isDialogOpen && (
                <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Registration Successful</AlertDialogTitle>
                            <AlertDialogDescription>
                                <p className='mb-4'>Your registration was successful.</p>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <Button onClick={handleCloseDialog}>
                                Continue
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </section>
    )
}
