import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConnect';
import LoadModel from '@/model/Load';

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
                JSON.stringify({ success: false, message: 'ID is required' }),
                { status: 400 }
            );
        }

        const loadDocs = await LoadModel.findById(id);
        if (!loadDocs) {
            return new Response(
                JSON.stringify({ success: false, message: 'No loads found' }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({ success: true, load: loadDocs }),
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
