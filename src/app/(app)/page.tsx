"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ClipLoader } from 'react-spinners';
import { Progress } from '@radix-ui/react-progress';
import { User } from 'next-auth';
function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const user: User = session?.user;

  useEffect(() => {
    if (status === 'loading') {
      return;
    }
    if (!session) {
      router.push('/sign-in');
    } else {
      if (!user.isVerified) {
        router.push(`/application-inreview/${user._id}`);
      }
      router.push('/loads');
    }
  }, [session, status, router, user._id, user.isVerified]);

  // Show loading state while checking session
  if (status === 'loading' || !session) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader color="#000" loading={true} size={50} />
        <Progress value={50} /> {/* Example value */}
      </div>
    );
  }

  return null;
}

export default Page;
