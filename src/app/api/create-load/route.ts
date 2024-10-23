import StaffUser from '@/model/StaffUser';
import LoadModel from '@/model/Load';
import { ShipmentModel } from '@/model/Shipment';
import ShipperModel from '@/model/Shipper';
import CarrierModel from '@/model/Carrier';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/dbConnect';
import { User } from 'next-auth';
import { NextRequest } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/options';

// Utility function to generate a unique six-character load ID
function generateLoadId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export async function POST(request: Request) {
    try {
        await dbConnect();
    } catch (dbError) {
        console.error('Database connection error:', dbError);
        return Response.json(
            { success: false, message: 'Database connection error' },
            { status: 500 }
        );
    }

    const session = await getServerSession(authOptions);
    const _user: User = session?.user;
    if (!session || !_user) {
        return Response.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
        );
    }

    try {
        const requestData = await request.json();
        console.log('requestData', requestData.loadData);

        // Generate a six-character load ID
        const loadId = generateLoadId();

        const newLoad = new LoadModel({
            ...requestData.loadData,
            loadId: loadId,  // Assign the generated loadId
        });

        const savedLoad = await newLoad.save();

        // Update the ShipmentModel by pushing the newly created load's ID
        await ShipmentModel.findOneAndUpdate(
            { shipmentID: requestData.loadData.shipmentRefId },
            { $push: { loads: savedLoad._id } }
        );

        return Response.json(
            { message: 'Load created', success: true, data: savedLoad },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error creating Load:', error);
        return Response.json(
            { message: 'Error creating Load', success: false },
            { status: 500 }
        );
    }
}
