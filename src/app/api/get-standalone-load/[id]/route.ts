import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConnect';
import StandAloneModel from '@/model/StandAloneLoad';
import ShipperModel from '@/model/Shipper';
import CarrierModel from '@/model/Carrier';
import { NextResponse } from 'next/server';
import { logAuditHistory } from '@/utils/logAuditHistory';

export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const _user = session?.user;

    if (!session || !_user) {
        return new Response(
            JSON.stringify({ success: false, message: 'Not authenticated' }),
            { status: 401 }
        );
    }

    try {
        const url = new URL(request.url);
        const id = url.pathname.split('/').pop();
        if (!id) {
            return new Response(
                JSON.stringify({ success: false, message: 'StandAloneLoad ID is required' }),
                { status: 400 }
            );
        }

        const standAloneLoadDocs = await StandAloneModel.findOne({ standaloneId: id });
        if (!standAloneLoadDocs) {
            return new Response(
                JSON.stringify({ success: false, message: 'No StandAloneLoads found' }),
                { status: 404 }
            );
        }

        const associatedShipper = await ShipperModel.findOne({ companyName: standAloneLoadDocs.shipperCompanyName });
        if (!associatedShipper) {
            return new Response(
                JSON.stringify({ success: false, message: 'No associated shipper found' }),
                { status: 404 }
            );
        }

        const associatedCarrier = await CarrierModel.findOne({ transportMCNumber: standAloneLoadDocs.assignedCarrierMC });
        if (!associatedCarrier) {
            return new Response(
                JSON.stringify({ success: true, standAloneLoad: standAloneLoadDocs, carrier: null, shipper: associatedShipper }),
                { status: 200 }
            );
        }

        return new Response(
            JSON.stringify({ success: true, standAloneLoad: standAloneLoadDocs, carrier: associatedCarrier, shipper: associatedShipper }),
            { status: 200 }
        );
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return new Response(
            JSON.stringify({ success: false, message: 'Internal server error' }),
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const updates = await request.json();
    const url = new URL(request.url);
    const standaloneloadId = url.pathname.split('/').pop();

    console.log('Request standaloneloadId:', standaloneloadId);
    console.log('Request Updates:', updates);

    if (!standaloneloadId || !updates || typeof updates !== 'object' || Object.keys(updates).length === 0) {
        return NextResponse.json({ error: 'Missing required parameters or invalid request body' }, { status: 400 });
    }

    await dbConnect();
    const session = await getServerSession(authOptions);
    const _user = session?.user;

    if (!session || !_user || !_user.email) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    try {
        const existingStandAloneLoad = await StandAloneModel.findOne({ standaloneId: standaloneloadId });

        if (!existingStandAloneLoad) {
            return NextResponse.json({ error: 'StandaloneId not found' }, { status: 404 });
        }

        const updatedStandAloneLoad = await StandAloneModel.findOneAndUpdate(
            { standaloneId: standaloneloadId },
            { $set: updates },
            { new: true }
        );

        if (!updatedStandAloneLoad) {
            return NextResponse.json({ error: 'StandAloneLoad not found' }, { status: 404 });
        }

        // Collect field changes
        const changes = Object.keys(updates).map((field) => ({
            field,
            oldValue: existingStandAloneLoad.get(field as keyof typeof existingStandAloneLoad) || 'N/A',
            newValue: updates[field],
        }));

        // Make sure `standaloneloadId` and `_user.email` are valid before calling `logAuditHistory`
        if (standaloneloadId && _user.email) {
            await logAuditHistory(standaloneloadId, 'StandAloneLoad', _user.email, changes);
        } else {
            console.error('Missing required data for logging audit history:', {
                standaloneloadId,
                userEmail: _user.email,
            });
        }
        return NextResponse.json({
            success: true,
            message: 'StandAloneLoad updated successfully',
            standAloneLoad: updatedStandAloneLoad,
        });
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
