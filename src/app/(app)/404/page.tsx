"use client"
import React from 'react';
import { useRouter } from 'next/navigation';

const Custom404: React.FC = () => {
    const router = useRouter();

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">404</h1>
                <p className="text-lg mb-4">User Not Found</p>
                <button
                    onClick={() => router.push('/')}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Go Home
                </button>
            </div>
        </div>
    );
};

export default Custom404;
