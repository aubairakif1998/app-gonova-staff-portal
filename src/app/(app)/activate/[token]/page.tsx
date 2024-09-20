"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ActivateAccount({ params }: { params: { token: string } }) {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isActivated, setIsActivated] = useState(false); // New state to track activation
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        try {
            const res = await fetch(`/api/activate`, {
                method: 'POST',
                body: JSON.stringify({ token: params.token, password }),
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await res.json();
            if (data.success) {
                setMessage('Account activated successfully! Redirecting...');
                setIsActivated(true); // Disable further form submissions

            } else {
                setMessage(data.message || 'Error activating account');
            }
        } catch (err) {
            setMessage('Error activating account');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-semibold mb-6">Activate Your Account</h1>

            {isActivated ? (
                // Success message displayed after activation
                <p className="text-green-600 text-center font-semibold">{message}</p>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 text-gray-700">New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            required
                            disabled={isActivated} // Disable input after activation
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            required
                            disabled={isActivated} // Disable input after activation
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full p-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
                        disabled={isActivated} // Disable button after activation
                    >
                        Activate Account
                    </button>
                </form>
            )}

            {message && !isActivated && (
                <p className="mt-4 text-center text-red-600">{message}</p>
            )}
        </div>
    );
}
