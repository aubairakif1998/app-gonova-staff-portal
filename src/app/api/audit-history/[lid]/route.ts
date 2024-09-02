// pages/api/audit-history/[id].ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import AuditHistory from '@/model/AuditHistory'; // Adjust the path as needed
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    if (!id) {
        return NextResponse.json({ success: false, message: 'Missing loadId parameter' }, { status: 400 });
    }

    await dbConnect();
    const session = await getServerSession(authOptions);
    const _user = session?.user;

    if (!session || !_user) {
        return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    }

    try {
        const auditRecords = await AuditHistory.find({ loadId: id }).sort({ createdAt: -1 });

        return NextResponse.json({ success: true, auditRecords });
    } catch (error) {
        console.error('Failed to fetch audit history:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
