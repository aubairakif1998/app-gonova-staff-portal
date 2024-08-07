import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConnect';
import StandAloneLoadModel from '@/model/StandAloneLoad';

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
        const page = parseInt(url.searchParams.get('page') || '1', 10);
        const limit = parseInt(url.searchParams.get('limit') || '10', 10);
        const shipperCompanyName = url.searchParams.get('shipperCompanyName');
        const assignedCarrierMC = url.searchParams.get('assignedCarrierMC');
        const status = url.searchParams.get('status');

        if (isNaN(page) || isNaN(limit)) {
            return new Response(
                JSON.stringify({ success: false, message: 'Invalid pagination parameters' }),
                { status: 400 }
            );
        }

        const query: any = {};
        if (shipperCompanyName) query.shipperCompanyName = { $regex: shipperCompanyName, $options: 'i' };
        if (assignedCarrierMC) query.assignedCarrierMC = { $regex: assignedCarrierMC, $options: 'i' };
        if (status) {
            const statusArray = status.split(',');
            if (!statusArray.includes('All')) {
                query.status = { $in: statusArray };
            }
        }

        const totalDocuments = await StandAloneLoadModel.countDocuments(query);
        const totalPages = Math.ceil(totalDocuments / limit);
        const standAloneloads = await StandAloneLoadModel.find(query)
            .skip((page - 1) * limit)
            .limit(limit);

        return new Response(
            JSON.stringify({ success: true, standAloneloads, totalPages }),
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
