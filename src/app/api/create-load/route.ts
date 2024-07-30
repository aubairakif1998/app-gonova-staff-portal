import UserModel from '@/model/StaffUser';
import LoadModel from '@/model/Load';
import { ShipmentModel } from '@/model/Shipment';
import ShipperModel from '@/model/Shipper';
import CarrierModel from '@/model/Carrier';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/dbConnect';
import { User } from 'next-auth';
import { NextRequest } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/options';

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
        const newLoad = new LoadModel(requestData);
        const savedLoad = await newLoad.save();
        await UserModel.findByIdAndUpdate(_user._id, { $push: { shipments: savedLoad._id } });

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
