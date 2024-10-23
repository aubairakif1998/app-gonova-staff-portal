import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConnect';
import LoadModel from '@/model/Load';
import { ShipmentModel } from '@/model/Shipment';
import CarrierModel from '@/model/Carrier';
import { NextResponse } from 'next/server';
import { logAuditHistory } from '@/utils/logAuditHistory'; // Ensure this is the correct import path

// GET function to fetch Load details using loadId instead of _id
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
        const loadId = url.pathname.split('/').pop();  // Get loadId from the URL
        if (!loadId) {
            return new Response(
                JSON.stringify({ success: false, message: 'Load ID is required' }),
                { status: 400 }
            );
        }

        // Find the load by loadId instead of _id
        const loadDoc = await LoadModel.findOne({ loadId });
        if (!loadDoc) {
            return new Response(
                JSON.stringify({ success: false, message: 'No load found with this Load ID' }),
                { status: 404 }
            );
        }

        const associatedShipment = await ShipmentModel.findOne({ shipmentID: loadDoc.shipmentRefId });
        if (!associatedShipment) {
            return new Response(
                JSON.stringify({ success: false, message: 'No associated Shipment found' }),
                { status: 404 }
            );
        }

        const associatedCarrier = await CarrierModel.findOne({ transportMCNumber: loadDoc.assignedCarrierMC });
        if (!associatedCarrier) {
            return new Response(
                JSON.stringify({ success: true, load: loadDoc, carrier: null, shipment: associatedShipment }),
                { status: 200 }
            );
        }

        return new Response(
            JSON.stringify({ success: true, load: loadDoc, carrier: associatedCarrier, shipment: associatedShipment }),
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

// PATCH function to update Load details using loadId instead of _id
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    const url = new URL(request.url);
    const loadId = url.pathname.split('/').pop();  // Get loadId from the URL
    const updates = await request.json();

    if (!loadId || !updates || typeof updates !== 'object' || Object.keys(updates).length === 0) {
        return NextResponse.json({ error: 'Missing required parameters or invalid request body' }, { status: 400 });
    }

    await dbConnect();
    const session = await getServerSession(authOptions);
    const _user = session?.user;

    if (!session || !_user) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    try {
        // Find the load by loadId instead of _id
        const existingLoad = await LoadModel.findOne({ loadId });

        if (!existingLoad) {
            return NextResponse.json({ error: 'Load not found' }, { status: 404 });
        }

        // Perform update
        const updatedLoad = await LoadModel.findOneAndUpdate({ loadId }, { $set: updates }, { new: true });

        if (!updatedLoad) {
            return NextResponse.json({ error: 'Load not found after update' }, { status: 404 });
        }

        // Determine changes
        const changes = Object.keys(updates).map(field => ({
            field,
            oldValue: existingLoad.get(field as keyof typeof existingLoad) || 'N/A',
            newValue: updates[field],
        }));

        // Log changes to the audit history
        await logAuditHistory(loadId, 'Load', _user.email, changes);

        return NextResponse.json({ success: true, message: 'Load updated successfully', load: updatedLoad });
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
