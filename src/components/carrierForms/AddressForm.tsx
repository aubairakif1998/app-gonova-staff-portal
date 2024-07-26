import React from 'react';
import { useFormContext } from 'react-hook-form';

const AddressForm = ({ errors }: { errors: any }) => {
    const { register } = useFormContext();
    return (
        <div>

            <div className='my-2'>
                <label htmlFor='addressStreet' className='block text-sm font-medium leading-6 text-gray-900'>
                    Location Address
                </label>
                <div className='mt-2 relative'>
                    <input
                        id='addressStreet'
                        {...register('addressStreet', {

                        })}
                        className='p-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm'
                    />
                    {errors.addressStreet && <p className='mt-2 text-sm text-red-400'>{errors.addressStreet.message}</p>}
                </div>
            </div>
            <div className='my-2'>
                <label htmlFor='addressCity' className='block text-sm font-medium leading-6 text-gray-900'>
                    City
                </label>
                <div className='mt-2 relative'>
                    <input
                        type='text'
                        id='addressCity'
                        {...register('addressCity', {

                        })}
                        className='p-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm'
                    />
                    {errors.addressCity && <p className='mt-2 text-sm text-red-400'>{errors.addressCity.message}</p>}
                </div>
            </div>

            <div className='my-2'>
                <label htmlFor='addressZip' className='block text-sm font-medium leading-6 text-gray-900'>
                    Location Zip Code
                </label>
                <div className='mt-2 relative'>
                    <input
                        type='number'
                        id='addressZip'
                        {...register('addressZip', {
                            pattern: {
                                value: /^\d{5}(-\d{4})?$/,
                                message: 'Please enter a valid US Zip code.'
                            }
                        })}
                        className='p-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm'
                    />
                    {errors.addressZip && <p className='mt-2 text-sm text-red-400'>{errors.addressZip.message}</p>}
                </div>
            </div>
        </div>
    );
};

export default AddressForm;
