'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function LoadById() {
    const router = useRouter();
    const params = useParams();

    useEffect(() => {
        if (params.id) {
            router.replace(`/loads`);
        }
    }, [params.id, router]);

    return null;
}
