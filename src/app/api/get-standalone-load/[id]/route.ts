import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConnect';
import StandAloneModel from '@/model/StandAloneLoad';
import ShipperModel from '@/model/Shipper';
import CarrierModel from '@/model/Carrier';
import { NextResponse } from 'next/server';

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

        const standAloneLoadDocs = await StandAloneModel.findById(id);
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


export async function DELETE(request: Request) {
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

        // Attempt to delete the record
        const result = await StandAloneModel.findByIdAndDelete(id);
        if (!result) {
            return new Response(
                JSON.stringify({ success: false, message: 'No StandAloneLoad found with the given ID' }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({ success: true, message: 'StandAloneLoad deleted successfully' }),
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
