'use client';
import { useEffect, useState } from 'react';
import { fetchLoadById } from '@/services/loadService';
import { Load } from '@/Interfaces/Load';
import { StandAloneLoad } from '@/Interfaces/StandAloneLoad';
import { useParams } from 'next/navigation';

interface Data {
    success: boolean;
    data: Load | null;
    message?: string;
}

const LoadDetailPage = () => {
    const [loadData, setLoadData] = useState<Data | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response: Data = await fetchLoadById(id);
                if (response.success) {
                    setLoadData(response);
                } else {
                    setLoadData(null);
                    setError(response.message || 'Failed to fetch data');
                }
            } catch (err) {
                console.error("Error while fetching load info:", err);
                setError('An unexpected error occurred.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) {
        return <div className="text-center mt-4">Loading...</div>;
    }

    if (!loadData && error) {
        return <div className="text-center mt-4">{error}</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Load Data</h1>
            <pre className="bg-gray-100 p-4 rounded-md shadow-md">
                {loadData?.data?.agentStaffMemberId || 'Data Not found'}
            </pre>
        </div>
    );
};

export default LoadDetailPage;
