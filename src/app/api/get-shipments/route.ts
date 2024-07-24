import { ShipmentModel } from '@/model/Shipment';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConnect';

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
        const userId = _user._id; // Assuming _user._id is already a string
        const shipments = await ShipmentModel.find({ userId });
        return new Response(
            JSON.stringify({ success: true, shipments }),
            { status: 200 }
        );
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return new Response(
            JSON.stringify({ message: 'Internal server error', success: false }),
            { status: 500 }
        );
    }
}