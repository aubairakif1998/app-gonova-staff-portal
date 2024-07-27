'use client'

import { useParams } from 'next/navigation'
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';


export default function ApplicationInReview() {
    const router = useRouter();
    const params = useParams()
    console.log(params.userId)
    return (
        <div>
            <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#f8f9fa' }}>
                <h1>Application in Review</h1>
                <button onClick={() => signOut({ callbackUrl: '/' })}>Sign Out</button>
            </nav>
            <main style={{ padding: '2rem', textAlign: 'center' }}>
                <h2>Your profile is under review</h2>
                <p>
                    Nova Admin is currently reviewing your profile. This process usually takes about one business day.
                    Please be patient and check back later.
                </p>
            </main>
        </div>
    );
}