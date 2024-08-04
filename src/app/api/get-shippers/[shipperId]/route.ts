import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/dbConnect';
import ShipperModel from '@/model/Shipper';
import { ShipmentModel } from '@/model/Shipment'; // Assuming this model exists
import { authOptions } from '../../auth/[...nextauth]/options';

export async function GET(req: Request) {
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
        const url = new URL(req.url);
        const { searchParams } = new URL(req.url);
        const shipperId = url.pathname.split('/').pop(); // Extract shipperId from the path

        if (!shipperId) {
            return new Response(
                JSON.stringify({ success: false, message: 'Missing shipperId parameter' }),
                { status: 400 }
            );
        }

        const shipper = await ShipperModel.findById(shipperId);

        if (!shipper) {
            return new Response(
                JSON.stringify({ success: false, message: 'Shipper not found' }),
                { status: 404 }
            );
        }

        // Fetch the shipments based on shipment IDs in the shipper document
        const shipments = await ShipmentModel.find({ _id: { $in: shipper.shipments } });

        return new Response(
            JSON.stringify({ success: true, shipper, shipments }),
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
