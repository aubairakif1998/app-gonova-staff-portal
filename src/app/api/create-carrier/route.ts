// import necessary modules and types
import CarrierModel from '@/model/Carrier';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/dbConnect';
import { User } from 'next-auth';
import { NextRequest } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/options';

export async function POST(request: NextRequest) {
    try {
        await dbConnect();
    } catch (dbError) {
        console.error('Database connection error:', dbError);
        return new Response(
            JSON.stringify({ success: false, message: 'Database connection error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const session = await getServerSession(authOptions);
    const _user: User = session?.user;
    if (!session || !_user) {
        return new Response(
            JSON.stringify({ success: false, message: 'Not authenticated' }),
            { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
    }

    try {
        const requestData = await request.json();
        const { carrierData } = requestData;
        const finalData = {
            companyName: carrierData.companyName,
            transportMCNumber: carrierData.transportMCNumber,
            dot: carrierData.dot,
            address: carrierData.addressStreet + ',' + carrierData.addressCity + ',' + carrierData.addressZip,
            contacts: carrierData.contacts,
            vehicleInformation: carrierData.vehicleInformation,
            createdBy: _user.email
        }

        console.log('finalData', finalData)
        const newCarrierModel = new CarrierModel(finalData);
        const savedCarrierModel = await newCarrierModel.save();

        return Response.json(
            { message: 'Carrier created', success: true, data: savedCarrierModel },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error creating Carrier:', error);
        return new Response(
            JSON.stringify({ message: 'Error creating Carrier', success: false }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
