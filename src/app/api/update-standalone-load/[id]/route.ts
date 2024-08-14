// app/api/update-standaloneload/[id]/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConnect';
import StandAloneModel from '@/model/StandAloneLoad';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const updates = await request.json();

    console.log('Request ID:', id);
    console.log('Request Updates:', updates);
    if (!id || !updates || typeof updates !== 'object' || Object.keys(updates).length === 0) {
        return NextResponse.json({ error: 'Missing required parameters or invalid request body' }, { status: 400 });
    }

    await dbConnect();
    const session = await getServerSession(authOptions);
    const _user = session?.user;
    if (!session || !_user) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    try {
        const updatedStandAloneLoad = await StandAloneModel.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true }
        );

        if (!updatedStandAloneLoad) {
            return NextResponse.json({ error: 'StandAloneLoad not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'StandAloneLoad updated successfully', standAloneLoad: updatedStandAloneLoad });
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
