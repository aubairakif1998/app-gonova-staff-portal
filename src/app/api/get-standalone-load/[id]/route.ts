
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConnect';
import StandAloneModel from '@/model/StandAloneLoad';
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
        const id = url.pathname.split('/').pop();
        if (!id) {
            return new Response(
                JSON.stringify({ success: false, message: 'StandAloneLoad ID is required' }),
                { status: 400 }
            );
        }

        const standAloneLoadDocs = await StandAloneModel.findById(id);
        if (!standAloneLoadDocs) {
            return new Response(
                JSON.stringify({ success: false, message: 'No StandAloneLoads found' }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({ success: true, standAloneLoad: standAloneLoadDocs }),
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
