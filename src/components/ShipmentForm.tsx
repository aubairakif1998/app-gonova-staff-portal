'use client'
import { ClipLoader } from 'react-spinners';
import { Progress } from '@radix-ui/react-progress';
import { useState } from 'react'
import { motion } from 'framer-motion'
import { z } from 'zod'
import { ShipmentFormDataSchema } from '@/schemas/ShipmentFormDataSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form'
import { redirect, useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { toast } from './ui/use-toast';
type Inputs = z.infer<typeof ShipmentFormDataSchema>


const steps = [
    {
        id: 'Step 1',
        name: 'Shipment Service',
        fields: ['serviceType']
    },
    {
        id: 'Step 2', name: 'Dates & Addresses',
        fields: [
            'requestingLoadingDate',
            'pickupLocationZip',
            'pickupLocationState',
            'pickupLocationCity',
            'pickupLocationStreet',
            'deliveryLocationZip',
            'deliveryLocationState',
            'deliveryLocationCity',
            'deliveryLocationStreet',
            'arrivalDate'
        ]
    },
    { id: 'Step 3', name: 'Tell us more about your freight', fields: ['shipmentContainAlcohol', 'hazardousMaterial'] },
    { id: 'Step 4', name: 'Items', fields: ['itemDescription', 'packaging', 'dimensions', 'weight', 'quantity'] },
    { id: 'Step 5', name: 'Complete' }
]
export default function ShipmentForm() {
    const [previousStep, setPreviousStep] = useState(0)
    const [currentStep, setCurrentStep] = useState(0)
    const delta = currentStep - previousStep
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const {
        register,
        handleSubmit,
        watch,
        reset,
        control,
        trigger,
        formState: { errors }
    } = useForm<Inputs>({
        resolver: zodResolver(ShipmentFormDataSchema),

    })



    const processForm: SubmitHandler<Inputs> = async data => {
        setLoading(true);
        try {
            const response = await axios.post<ApiResponse>('/api/create-shipment', { shipmentData: data });
            console.log(response.data.message);
            toast({
                title: response.data.message,
                variant: 'default',
            });
            router.push('/shipments');
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
                    'Failed to create shipment',
                variant: 'destructive',
            });
            setPreviousStep(currentStep)
            setCurrentStep(step => step - 1)
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    type FieldName = keyof Inputs

    const next = async () => {
        const fields = steps[currentStep].fields
        const output = await trigger(fields as FieldName[], { shouldFocus: true })

        if (!output) return

        if (currentStep <= steps.length - 1) {
            console.log(currentStep)
            if (currentStep === steps.length - 1) {
                await handleSubmit(processForm)();
            }
            setPreviousStep(currentStep)
            setCurrentStep(step => step + 1)
        }
    }

    const prev = () => {
        if (currentStep > 0) {
            setPreviousStep(currentStep)
            setCurrentStep(step => step - 1)
        }
    }
    // const watchServiceType = watch("serviceType");
    // const watchTruckloadType = watch("truckloadType");
    return (
        <section className='absolute inset-0 flex flex-col justify-between p-24'>
            {
                loading && <div className="flex justify-center items-center min-h-screen">
                    <ClipLoader color="#000" loading={true} size={50} />
                    <Progress value={50} /> {/* Example value */}
                </div>
            }
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

            {/* Form */}
            <form className='mt-12 py-12' onSubmit={handleSubmit(processForm)}>
                {currentStep === 0 && (
                    <motion.div
                        initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        {/* Service Type */}
                        <div className='my-10'>
                            <div className='flex space-x-6 mt-2'>
                                <div className='flex flex-col bg-gray-300 rounded-xl p-10'>
                                    <label className='flex items-center space-x-2'>
                                        <input
                                            type='radio'
                                            value='LTL'
                                            {...register('serviceType')}
                                            className='form-radio h-4 w-4 text-black focus:ring-gray-500'
                                        />
                                        <span className='text-black font-bold'>LTL</span>
                                    </label>
                                    <p className='text-black mt-2'>Quotes for less than truckload shipments.</p>
                                </div>

                                {/* Full Truckload */}
                                <div className='flex flex-col bg-gray-300 rounded-xl p-10'>
                                    <label className='flex items-center space-x-2'>
                                        <input
                                            type='radio'
                                            value='Full Truckload'
                                            {...register('serviceType')}
                                            className='form-radio h-4 w-4 text-black focus:ring-gray-500'
                                        />
                                        <span className='text-black font-bold'>Full Truckload</span>
                                    </label>
                                    <p className='text-black mt-2'>
                                        We offer solutions with our dry van, flatbed, and temperature-controlled trailers.
                                    </p>
                                </div>

                                {/* Small Shipments */}
                                <div className='flex flex-col bg-gray-300 rounded-xl p-10'>
                                    <label className='flex items-center space-x-2'>
                                        <input
                                            type='radio'
                                            value='Small Shipments'
                                            {...register('serviceType')}
                                            className='form-radio h-4 w-4 text-black focus:ring-gray-500'
                                        />
                                        <span className='text-black font-bold'>Small Shipments</span>
                                    </label>
                                    <p className='text-black mt-2'>Ship your small parcel.</p>
                                </div>
                            </div>
                            {errors.serviceType && <p className='text-red-500 text-sm mt-2'>{errors.serviceType.message}</p>}
                        </div>

                    </motion.div>
                )}

                {currentStep === 1 && (
                    <motion.div
                        initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        <div className='bg-gray-200 w-full p-6 rounded-lg shadow-md'>
                            <div className='grid grid-cols-2 gap-6'>
                                <div>
                                    <label htmlFor='requestingLoadingDate' className='block text-sm font-medium leading-6 text-gray-900'>
                                        Requesting Loading Date
                                    </label>
                                    <div className='mt-2 relative'>
                                        <input
                                            id='requestingLoadingDate'
                                            type='date'
                                            {...register('requestingLoadingDate')}
                                            className='p-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm'
                                        />
                                        {errors.requestingLoadingDate && <p className='mt-2 text-sm text-red-400'>{errors.requestingLoadingDate.message}</p>}
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor='arrivalDate' className='block text-sm font-medium leading-6 text-gray-900'>
                                        Arrival Date
                                    </label>
                                    <div className='mt-2 relative'>
                                        <input
                                            id='arrivalDate'
                                            type='date'
                                            {...register('arrivalDate')}
                                            className='p-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm'
                                        />
                                        {errors.arrivalDate && <p className='mt-2 text-sm text-red-400'>{errors.arrivalDate.message}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>




                        <div className='mt-3 bg-gray-200 w-full p-6 rounded-lg shadow-md'>
                            <div className='grid grid-cols-2 gap-6'>





                                <div>
                                    <label htmlFor='pickupLocationStreet' className='block text-sm font-medium leading-6 text-gray-900'>
                                        Pickup Location Street
                                    </label>
                                    <div className='mt-2 relative'>
                                        <input
                                            id='pickupLocationStreet'
                                            {...register('pickupLocationStreet', {
                                            })}
                                            className='p-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm'
                                        />
                                        {errors.pickupLocationStreet && <p className='mt-2 text-sm text-red-400'>{errors.pickupLocationStreet.message}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor='deliveryLocationZip' className='block text-sm font-medium leading-6 text-gray-900'>
                                        Delivery Location Street
                                    </label>
                                    <div className='mt-2 relative'>
                                        <input
                                            id='deliveryLocationStreet'
                                            {...register('deliveryLocationStreet', {
                                            })}
                                            className='p-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm'
                                        />
                                        {errors.deliveryLocationStreet && <p className='mt-2 text-sm text-red-400'>{errors.deliveryLocationStreet.message}</p>}
                                    </div>
                                </div>


                                <div>
                                    <label htmlFor='pickupLocationCity' className='block text-sm font-medium leading-6 text-gray-900'>
                                        Pickup Location City
                                    </label>
                                    <div className='mt-2 relative'>
                                        <input
                                            id='pickupLocationCity'
                                            {...register('pickupLocationCity', {

                                            })}
                                            className='p-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm'
                                        />
                                        {errors.pickupLocationCity && <p className='mt-2 text-sm text-red-400'>{errors.pickupLocationCity.message}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor='deliveryLocationCity' className='block text-sm font-medium leading-6 text-gray-900'>
                                        Delivery Location City
                                    </label>
                                    <div className='mt-2 relative'>
                                        <input
                                            id='deliveryLocationCity'
                                            {...register('deliveryLocationCity', {

                                            })}
                                            className='p-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm'
                                        />
                                        {errors.deliveryLocationCity && <p className='mt-2 text-sm text-red-400'>{errors.deliveryLocationCity.message}</p>}
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor='pickupLocationState' className='block text-sm font-medium leading-6 text-gray-900'>
                                        Pickup Location State
                                    </label>
                                    <div className='mt-2 relative'>
                                        <input
                                            id='pickupLocationState'
                                            {...register('pickupLocationState', {

                                            })}
                                            className='p-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm'
                                        />
                                        {errors.pickupLocationState && <p className='mt-2 text-sm text-red-400'>{errors.pickupLocationState.message}</p>}
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor='deliveryLocationState' className='block text-sm font-medium leading-6 text-gray-900'>
                                        Delivery Location State
                                    </label>
                                    <div className='mt-2 relative'>
                                        <input
                                            id='deliveryLocationState'
                                            {...register('deliveryLocationState', {

                                            })}
                                            className='p-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm'
                                        />
                                        {errors.deliveryLocationState && <p className='mt-2 text-sm text-red-400'>{errors.deliveryLocationState.message}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor='pickupLocationZip' className='block text-sm font-medium leading-6 text-gray-900'>
                                        Pickup Location Postal Code
                                    </label>
                                    <div className='mt-2 relative'>
                                        <input
                                            type='number'
                                            id='pickupLocationZip'
                                            {...register('pickupLocationZip', {
                                                pattern: {
                                                    value: /^\d{5}(-\d{4})?$/,
                                                    message: 'Please enter a valid US postal code.'
                                                }
                                            })}
                                            className='p-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm'
                                        />
                                        {errors.pickupLocationZip && <p className='mt-2 text-sm text-red-400'>{errors.pickupLocationZip.message}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor='deliveryLocationZip' className='block text-sm font-medium leading-6 text-gray-900'>
                                        Delivery Location Postal Code
                                    </label>
                                    <div className='mt-2 relative'>
                                        <input
                                            type='number'

                                            id='deliveryLocationZip'
                                            {...register('deliveryLocationZip', {
                                                pattern: {
                                                    value: /^\d{5}(-\d{4})?$/,
                                                    message: 'Please enter a valid US postal code.'
                                                }
                                            })}
                                            className='p-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm'
                                        />
                                        {errors.deliveryLocationZip && <p className='mt-2 text-sm text-red-400'>{errors.deliveryLocationZip.message}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </motion.div>
                )}

                {currentStep === 2 && (
                    <div className=''>
                        <div className=''>
                            <label htmlFor='shipmentContainAlcohol' className='block text-lg font-medium leading-6 text-gray-900 text-center'>
                                Does this shipment contain Alcohol?
                            </label>
                            <div className="flex justify-center items-center space-x-6 mt-2">
                                <label className="flex items-center space-x-2">
                                    <input type="radio" value="true" {...register('shipmentContainAlcohol')} className="form-radio h-6 w-6 text-indigo-600" />
                                    <span className="text-lg text-gray-700">Yes</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input type="radio" value="false" {...register('shipmentContainAlcohol')} className="form-radio h-6 w-6 text-indigo-600" />
                                    <span className="text-lg text-gray-700">No</span>
                                </label>
                            </div>
                            {errors.shipmentContainAlcohol && <p className="text-red-500 text-sm mt-2">{errors.shipmentContainAlcohol.message}</p>}
                        </div>

                        <div className='mt-8'>
                            <label htmlFor='hazardousMaterial' className='block text-lg font-medium leading-6 text-gray-900 text-center'>
                                Does this shipment contain hazardous material?
                            </label>
                            <div className='mt-2'>
                                <div className="flex justify-center items-center space-x-6 mt-2">
                                    <label className="flex items-center space-x-2">
                                        <input type="radio" value="true" {...register('hazardousMaterial')} className="form-radio h-6 w-6 text-black" />
                                        <span className="text-lg text-gray-700">Yes</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input type="radio" value="false" {...register('hazardousMaterial')} className="form-radio h-6 w-6 text-black" />
                                        <span className="text-lg text-gray-700">No</span>
                                    </label>
                                </div>
                                {errors.hazardousMaterial && <p className="text-red-500 text-sm mt-2">{errors.hazardousMaterial.message}</p>}
                            </div>
                        </div>
                    </div>
                )}


                {currentStep === 3 && (
                    <motion.div
                        initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >


                        <div className='grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
                            <div className='sm:col-span-3'>
                                <label htmlFor={`itemDescription`} className='block text-sm font-medium leading-6 text-gray-900'>
                                    Item Description
                                </label>
                                <div className='mt-2'>
                                    <input
                                        id={`itemDescription`}
                                        {...register(`itemDescription`)}
                                        className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-black sm:max-w-xs sm:text-sm sm:leading-6'
                                    />
                                    {errors.itemDescription && <p className='mt-2 text-sm text-red-400'>{errors.itemDescription.message}</p>}
                                </div>
                            </div>
                            <div className='sm:col-span-3'>
                                <label htmlFor={`packaging`} className='block text-sm font-medium leading-6 text-gray-900'>
                                    Packaging
                                </label>
                                <div className='mt-2'>
                                    <select
                                        id={`packaging`}
                                        {...register(`packaging`)}
                                        className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-black sm:max-w-xs sm:text-sm sm:leading-6'
                                    >
                                        <option value='Pallet'>Pallet</option>
                                        <option value='Box'>Box</option>
                                        <option value='Crate'>Crate</option>
                                        <option value='Drum'>Drum</option>
                                    </select>
                                    {errors.packaging && <p className='mt-2 text-sm text-red-400'>{errors.packaging.message}</p>}
                                </div>
                            </div>
                            <div className='sm:col-span-3'>
                                <label htmlFor={`dimensions.length`} className='block text-sm font-medium leading-6 text-gray-900'>
                                    Dimensions (L x W x H)
                                </label>
                                <div className='mt-2 flex'>
                                    <input
                                        id={`dimensions.length`}
                                        type='number'
                                        step='0.1'
                                        {...register(`dimensions.length`, { valueAsNumber: true })}
                                        placeholder='Length'
                                        className='p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6'
                                    />
                                    <input
                                        id={`dimensions.width`}
                                        type='number'
                                        step='0.1'
                                        {...register(`dimensions.width`, { valueAsNumber: true })}
                                        placeholder='Width'
                                        className='p-3 ml-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6'
                                    />
                                    <input
                                        id={`dimensions.height`}
                                        type='number'
                                        step='0.1'
                                        {...register(`dimensions.height`, { valueAsNumber: true })}
                                        placeholder='Height'
                                        className='p-3 ml-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6'
                                    />
                                </div>
                                {errors?.dimensions && (
                                    <p className='mt-2 text-sm text-red-400'>{errors.dimensions.message}</p>
                                )}
                            </div>
                            <div className='sm:col-span-3'>
                                <label htmlFor={`weight`} className='block text-sm font-medium leading-6 text-gray-900'>
                                    Weight (lbs)
                                </label>
                                <div className='mt-2'>
                                    <input
                                        id={`weight`}
                                        type='number'
                                        step='0.1'
                                        {...register(`weight`, { valueAsNumber: true })}
                                        className='p-3  block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-black sm:max-w-xs sm:text-sm sm:leading-6'
                                    />
                                    {errors?.weight && <p className='mt-2 text-sm text-red-400'>{errors.weight.message}</p>}
                                </div>
                            </div>
                            <div className='sm:col-span-3'>
                                <label htmlFor={`quantity`} className='block text-sm font-medium leading-6 text-gray-900'>
                                    Quantity
                                </label>
                                <div className='mt-2'>
                                    <input
                                        id={`quantity`}
                                        type='number'
                                        {...register(`quantity`, { valueAsNumber: true })}
                                        className='p-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-black sm:max-w-xs sm:text-sm sm:leading-6'
                                    />
                                    {errors?.quantity && <p className='mt-2 text-sm text-red-400'>{errors.quantity.message}</p>}
                                </div>
                            </div>
                        </div>

                    </motion.div>
                )}
                {currentStep === 4 && (
                    <motion.div
                        initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >


                        <div className='bg-white p-10 rounded-xl shadow-lg'>
                            <h2 className='mx-10 my-10 text-2xl font-bold text-black'>Preview Your Information</h2>

                            <div className='flex justify-start align-items'>
                                <div className='mx-10 my-4'>
                                    <h3 className='text-md font-bold text-center text-gray-700'>Service Type:</h3>
                                    <p className='text-center text-gray-700'>{watch('serviceType')}</p>
                                </div>

                                <div className='mx-10  my-4'>
                                    <h3 className='text-md font-bold text-center text-gray-700'>Requesting Loading Date:</h3>
                                    <p className='text-center text-gray-700'>{watch('requestingLoadingDate')}</p>
                                </div>

                                <div className='mx-10 my-4'>
                                    <h3 className='text-md font-bold text-center text-gray-700'>Pickup Location:</h3>
                                    <span className='text-center text-gray-700'>{watch('pickupLocationStreet')}</span>
                                    <span className='text-center text-gray-700'>,{watch('pickupLocationCity')}</span>
                                    <span className='text-center text-gray-700'>,{watch('pickupLocationState')}</span>
                                    <span className='text-center text-gray-700'>,{watch('pickupLocationZip')}</span>
                                </div>

                                <div className='mx-10 my-4'>
                                    <h3 className='text-md font-bold text-center text-gray-700'>Delivery Location:</h3>
                                    <span className='text-center text-gray-700'>{watch('deliveryLocationStreet')}</span>
                                    <span className='text-center text-gray-700'>,{watch('deliveryLocationCity')}</span>
                                    <span className='text-center text-gray-700'>,{watch('deliveryLocationState')}</span>
                                    <span className='text-center text-gray-700'>,{watch('deliveryLocationZip')}</span>
                                </div>
                            </div>

                            <div className='flex justify-start align-items'>
                                <div className='mx-10 my-4'>
                                    <h3 className='text-md font-bold text-center text-gray-700'>Arrival Date:</h3>
                                    <p className='text-center text-gray-700'>{watch('arrivalDate')}</p>
                                </div>

                                <div className='mx-10 my-4'>
                                    <h3 className='text-md font-bold text-center text-gray-700'>Item Description:</h3>
                                    <p className='text-center text-gray-700'>{watch('itemDescription')}</p>
                                </div>

                                <div className='mx-10 my-4'>
                                    <h3 className='text-md font-bold text-center text-gray-700'>Packaging:</h3>
                                    <p className='text-center text-gray-700'>{watch('packaging')}</p>
                                </div>

                                <div className='mx-10 my-4'>
                                    <h3 className='text-md font-bold text-center text-gray-700'>Weight:</h3>
                                    <p className='text-center text-gray-700'>{watch('weight')}</p>
                                </div>
                                <div className='mx-10 my-4'>
                                    <h3 className='text-md font-bold text-center text-gray-700'>Quantity:</h3>
                                    <p className='text-center text-gray-700'>{watch('quantity')}</p>
                                </div>

                                <div className='mx-10 my-4'>
                                    <h3 className='text-md font-bold text-center text-gray-700'>Dimensions (L x W x H):</h3>
                                    <p className='text-center text-gray-700'>{`${watch('dimensions.length')} x ${watch('dimensions.width')} x ${watch('dimensions.height')}`}</p>
                                </div>
                            </div>

                        </div>


                    </motion.div>
                )}
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
        </section>
    )
}



// 1234 Park ST - Pickup location
// Portland, OR - Pickup location City
// 97255 - Pickup location Zip code