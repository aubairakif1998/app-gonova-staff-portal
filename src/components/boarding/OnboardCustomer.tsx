"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export const companyNameValidation = z
    .string()
    .min(2, 'Company Name must be at least 2 characters')
    .max(20, 'Company Name  must be no more than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Company Name must not contain special characters');

const OnboardSchema = z.object({
    companyName: companyNameValidation,
    locationAddress: z.string().min(1, 'Location address is required'),
    city: z.string().min(1, 'City is required'),
    zip: z.string().min(5, 'ZIP must be exactly 5 digits').max(5, 'ZIP must be exactly 5 digits'),
    email: z.string().nonempty("Email is required").email({ message: 'Invalid email address' }),
    phoneNumber: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, "Invalid phone number"),
});

type OnboardFormData = z.infer<typeof OnboardSchema>;

export default function OnboardCustomer() {
    const [message, setMessage] = useState<string | null>(null); // Show success or error messages
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<OnboardFormData>({
        resolver: zodResolver(OnboardSchema),
    });

    const onSubmit = async (data: OnboardFormData) => {
        try {
            const response = await fetch('/api/boarding', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();
            if (result.success) {
                setMessage('Customer registered successfully. Activation email sent.');
            } else {
                setMessage(result.message || 'Error registering customer');
            }
        } catch (error) {
            setMessage('Error submitting the form. Please try again.');
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-semibold mb-6">Onboard New Customer</h1>
            {message && (
                <div className="p-4 mb-4 text-center font-semibold text-white bg-green-500 rounded-lg">
                    {message}
                </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block mb-1 text-gray-700">Company Name</label>
                    <input
                        type="text"
                        {...register('companyName')}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                    />
                    {errors.companyName && (
                        <p className="text-red-600 text-sm mt-1">{errors.companyName.message}</p>
                    )}
                </div>

                <div>
                    <label className="block mb-1 text-gray-700">Location Address</label>
                    <input
                        type="text"
                        {...register('locationAddress')}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                    />
                    {errors.locationAddress && (
                        <p className="text-red-600 text-sm mt-1">{errors.locationAddress.message}</p>
                    )}
                </div>

                <div>
                    <label className="block mb-1 text-gray-700">City</label>
                    <input
                        type="text"
                        {...register('city')}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                    />
                    {errors.city && (
                        <p className="text-red-600 text-sm mt-1">{errors.city.message}</p>
                    )}
                </div>

                <div>
                    <label className="block mb-1 text-gray-700">ZIP Code</label>
                    <input
                        type="text"
                        {...register('zip')}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                    />
                    {errors.zip && (
                        <p className="text-red-600 text-sm mt-1">{errors.zip.message}</p>
                    )}
                </div>

                <div>
                    <label className="block mb-1 text-gray-700">Email</label>
                    <input
                        type="email"
                        {...register('email')}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                    />
                    {errors.email && (
                        <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                    )}
                </div>

                <div>
                    <label className="block mb-1 text-gray-700">Phone Number</label>
                    <input
                        type="text"
                        {...register('phoneNumber')}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                    />
                    {errors.phoneNumber && (
                        <p className="text-red-600 text-sm mt-1">{errors.phoneNumber.message}</p>
                    )}
                </div>

                <button type="submit" className="w-full p-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600">
                    Send Onboarding Email
                </button>
            </form>
        </div>
    );
}
