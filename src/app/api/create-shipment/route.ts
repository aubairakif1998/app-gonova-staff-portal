import UserModel from '@/model/StaffUser';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/dbConnect';
import { User } from 'next-auth';
import { NextRequest } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/options';
import { ShipmentModel } from '@/model/Shipment';

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
        const { shipmentData } = requestData;
        const finalData = {
            userId: _user._id, // Reference to User
            serviceType: shipmentData.serviceType,
            requestingLoadingDate: new Date(shipmentData.requestingLoadingDate),
            arrivalDate: new Date(shipmentData.arrivalDate),
            pickupLocation: shipmentData.pickupLocationStreet + ',' + shipmentData.pickupLocationCity + ',' + shipmentData.pickupLocationState + ',' + shipmentData.pickupLocationZip,
            deliveryLocation: shipmentData.deliveryLocationStreet + ',' + shipmentData.deliveryLocationCity + ',' + shipmentData.deliveryLocationState + ',' + shipmentData.deliveryLocationZip,
            shipmentContainAlcohol: shipmentData.shipmentContainAlcohol,
            hazardousMaterial: shipmentData.hazardousMaterial,
            itemDescription: shipmentData.itemDescription,
            packaging: shipmentData.packaging,
            dimensions: shipmentData.dimensions,
            weight: shipmentData.weight,
            quantity: shipmentData.quantity,
            contracts: [],
            status: 'upcoming'
        }

        console.log('finalData', finalData)
        const newShipment = new ShipmentModel(finalData);
        const savedShipment = await newShipment.save();
        await UserModel.findByIdAndUpdate(_user._id, { $push: { shipments: savedShipment._id } });

        return Response.json(
            { message: 'Shipment created', success: true, data: savedShipment },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error creating shipment:', error);
        return Response.json(
            { message: 'Error creating shipment', success: false },
            { status: 500 }
        );
    }
}
