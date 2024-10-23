import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from '../auth/[...nextauth]/options';
import CommentModel from '@/model/Comment';

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
        // Parse the request body to get the loadId
        const url = new URL(request.url);
        const loadId = url.searchParams.get('loadId');


        if (!loadId) {
            return new Response(
                JSON.stringify({ success: false, message: 'loadId is required' }),
                { status: 400 }
            );
        }

        // Fetch comments related to the loadId
        const comments = await CommentModel.find({ loadId }).sort({ timestamp: -1 });

        return new Response(
            JSON.stringify({ success: true, comments }),
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
export async function POST(request: Request) {
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

        const body = await request.json();
        const { loadId, content } = body;

        if (!loadId || !content) {
            return new Response(
                JSON.stringify({ success: false, message: 'loadId and content are required' }),
                { status: 400 }
            );
        }

        const newComment = new CommentModel({
            loadId: loadId,
            content,
            sentBy: _user.email,
            timestamp: new Date()
        });

        await newComment.save();
        return new Response(
            JSON.stringify({ success: true, comment: newComment }),
            { status: 201 }
        );
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return new Response(
            JSON.stringify({ message: 'Internal server error', success: false }),
            { status: 500 }
        );
    }
}
