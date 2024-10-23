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
import StandAloneLoadModel from '@/model/StandAloneLoad';

// Utility function to generate a unique 6-character load ID
function generateStandLoadId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let loadId = '';
    for (let i = 0; i < 6; i++) {
        loadId += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return loadId;
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

        // Generate a unique 6-character load ID
        const standLoadId = generateStandLoadId();

        // Include the generated standLoadId in the new load data
        const newLoad = new StandAloneLoadModel({
            ...requestData.standAloneloadData,
            standaloneId: standLoadId,  // Assign the generated standLoadId
        });

        const savedLoad = await newLoad.save();

        // Update the corresponding shipper record with the new load's ID
        await ShipperModel.findOneAndUpdate(
            { companyName: requestData.standAloneloadData.shipperCompanyName },
            { $push: { standAloneLoads: savedLoad._id } }
        );

        return Response.json(
            { message: 'StandAloneload created', success: true, data: savedLoad },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error creating StandAloneload:', error);
        return Response.json(
            { message: 'Error creating StandAloneload', success: false },
            { status: 500 }
        );
    }
}
