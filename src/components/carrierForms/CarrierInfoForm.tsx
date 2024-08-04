import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useDebounce } from 'usehooks-ts';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/Interfaces/ApiResponse';
import { Loader2 } from 'lucide-react';

const CarrierInfoForm = ({ errors, setHasException }: { errors: any, setHasException: any }) => {
    const { register } = useFormContext();
    const [companyName, setCompanyName] = useState('');
    const [companyNameMessage, setCompanyNameMessage] = useState('');
    const [companyNameErrorMessage, setCompanyNameErrorMessage] = useState('');

    const [isCheckingCompanyName, setIsCheckingCompanyName] = useState(false);

    const [dot, setDot] = useState('');
    const [dotMessage, setDotMessage] = useState('');
    const [dotErrorMessage, setDotErrorMessage] = useState('');
    const [isCheckingDot, setIsCheckingDot] = useState(false);

    const [transportMCNumber, setTransportMCNumber] = useState('');
    const [transportMCNumberMessage, setTransportMCNumberMessage] = useState('');
    const [transportMCNumberErrorMessage, setTransportMCNumberErrorMessage] = useState('');
    const [isCheckingTransportMCNumber, setIsCheckingTransportMCNumber] = useState(false);

    const debouncedCompanyName = useDebounce(companyName, 300);
    const debouncedTransportMCNumber = useDebounce(transportMCNumber, 300);
    const debouncedDot = useDebounce(dot, 300);

    const updateExceptionState = () => {
        setHasException(!!(companyNameErrorMessage || transportMCNumberErrorMessage || dotErrorMessage));
    };

    useEffect(() => {
        const checkCompanyNameUnique = async () => {
            if (debouncedCompanyName) {
                setIsCheckingCompanyName(true);
                setCompanyNameMessage(''); // Reset message
                setCompanyNameErrorMessage('');
                try {
                    const response = await axios.get<ApiResponse>(
                        `/api/check-carrier-companyName-unique?companyName=${debouncedCompanyName}`
                    );
                    setCompanyNameMessage(response.data.message);
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    setCompanyNameErrorMessage(
                        axiosError.response?.data.message ?? 'Error checking company name'
                    );
                } finally {
                    setIsCheckingCompanyName(false);
                }
            }
        };
        checkCompanyNameUnique();
    }, [debouncedCompanyName]);

    useEffect(() => {
        const checkTransportMCNumberUnique = async () => {
            if (debouncedTransportMCNumber) {
                setIsCheckingTransportMCNumber(true);
                setTransportMCNumberMessage(''); // Reset message
                setTransportMCNumberErrorMessage(''); // Reset error message

                try {
                    const response = await axios.get<ApiResponse>(
                        `/api/check-MC-unique?transportMCNumber=${debouncedTransportMCNumber}`
                    );
                    setTransportMCNumberMessage(response.data.message);
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    setTransportMCNumberErrorMessage(
                        axiosError.response?.data.message ?? 'Error checking MC number'
                    );
                } finally {
                    setIsCheckingTransportMCNumber(false);
                }
            }
        };
        checkTransportMCNumberUnique();
    }, [debouncedTransportMCNumber]);

    useEffect(() => {
        const checkDotUnique = async () => {
            if (debouncedDot) {
                setIsCheckingDot(true);
                setDotMessage(''); // Reset message
                setDotErrorMessage(''); // Reset error message

                try {
                    const response = await axios.get<ApiResponse>(
                        `/api/check-dot-unique?dot=${debouncedDot}`
                    );
                    setDotMessage(response.data.message);
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    setDotErrorMessage(
                        axiosError.response?.data.message ?? 'Error checking DOT number'
                    );
                } finally {
                    setIsCheckingDot(false);
                }
            }
        };
        checkDotUnique();
    }, [debouncedDot]);

    useEffect(() => {
        updateExceptionState();
    }, [companyNameErrorMessage, transportMCNumberErrorMessage, dotErrorMessage, updateExceptionState]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col">
                <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">Company Name</Label>
                <Input
                    id="companyName"
                    {...register('companyName', {
                        onChange: (e) => {
                            setCompanyName(e.target.value); // Update state on change
                        },
                    })}
                    placeholder="Enter company name"
                    className="mt-1"
                />
                {isCheckingCompanyName && <Loader2 className="animate-spin" />}
                {!isCheckingCompanyName && companyNameMessage && (
                    <p className="mt-2 text-sm text-green-400">
                        {companyNameMessage}
                    </p>
                )}
                {!isCheckingCompanyName && companyNameErrorMessage && (
                    <p className="mt-2 text-sm text-red-400">
                        {companyNameErrorMessage}
                    </p>
                )}
                {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>}
            </div>
            <div className="flex flex-col">
                <Label htmlFor="transportMCNumber" className="text-sm font-medium text-gray-700">Transport MC Number</Label>
                <Input
                    type="text"
                    id="transportMCNumber"
                    {...register('transportMCNumber', {
                        onChange: (e) => {
                            setTransportMCNumber(e.target.value); // Update state on change
                        },
                    })}
                    placeholder="Enter transport MC number"
                    className="mt-1"
                />
                {isCheckingTransportMCNumber && <Loader2 className="animate-spin" />}
                {!isCheckingTransportMCNumber && transportMCNumberMessage && (
                    <p className={`mt-2 text-sm ${transportMCNumberMessage.includes('MCNumber is already taken') ? 'text-red-400' : 'text-green-400'}`}>
                        {transportMCNumberMessage}
                    </p>
                )}
                {!isCheckingTransportMCNumber && transportMCNumberErrorMessage && (
                    <p className="mt-2 text-sm text-red-400">
                        {transportMCNumberErrorMessage}
                    </p>
                )}
                {errors.transportMCNumber && <p className="text-red-500 text-sm mt-1">{errors.transportMCNumber.message}</p>}
            </div>
            <div className="flex flex-col">
                <Label htmlFor="dot" className="text-sm font-medium text-gray-700">DOT</Label>
                <Input
                    id="dot"
                    {...register('dot', {
                        onChange: (e) => {
                            setDot(e.target.value); // Update state on change
                        },
                    })}
                    placeholder="Enter DOT number"
                    className="mt-1"
                />
                {isCheckingDot && <Loader2 className="animate-spin" />}
                {!isCheckingDot && dotMessage && (
                    <p className={`mt-2 text-sm ${dotMessage.includes('DOT number is already taken') ? 'text-red-400' : 'text-green-400'}`}>
                        {dotMessage}
                    </p>
                )}
                {!isCheckingDot && dotErrorMessage && (
                    <p className="mt-2 text-sm text-red-400">
                        {dotErrorMessage}
                    </p>
                )}
                {errors.dot && <p className="text-red-500 text-sm mt-1">{errors.dot.message}</p>}
            </div>
        </div>
    );
};

export default CarrierInfoForm;
