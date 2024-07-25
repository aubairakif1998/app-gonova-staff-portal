import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConnect';
import ShipperModel from '@/model/Shipper';

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
        // Extract query parameters from the request URL
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') || '1', 10);
        const limit = parseInt(url.searchParams.get('limit') || '10', 10);
        const companyName = url.searchParams.get('companyName');
        const email = url.searchParams.get('email');

        if (isNaN(page) || isNaN(limit)) {
            return new Response(
                JSON.stringify({ success: false, message: 'Invalid pagination parameters' }),
                { status: 400 }
            );
        }

        // Build the query object
        const query: any = {};
        if (companyName) query.companyName = { $regex: companyName, $options: 'i' };
        if (email) query.email = { $regex: email, $options: 'i' };

        // Calculate the total number of documents that match the query
        const totalDocuments = await ShipperModel.countDocuments(query);
        const totalPages = Math.ceil(totalDocuments / limit);

        // Fetch the shippers with pagination and the query
        const shippers = await ShipperModel.find(query)
            .skip((page - 1) * limit)
            .limit(limit);

        return new Response(
            JSON.stringify({ success: true, shippers, totalPages }),
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
