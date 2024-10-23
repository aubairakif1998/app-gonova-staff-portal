
import { CommentResponse, CommentPayload } from "@/Interfaces/Comment";
export async function createComment(payload: CommentPayload): Promise<CommentResponse> {
    try {
        const response = await fetch('/api/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data: CommentResponse = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to create comment');
        }

        return data;
    } catch (error: any) {
        console.error('Error creating comment:', error);
        return { success: false, message: error.message };
    }
}

export async function getComments(loadId: string | string[]): Promise<CommentResponse> {
    try {
        const response = await fetch(`/api/comments?loadId=${loadId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data: CommentResponse = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch comments');
        }

        return data;
    } catch (error: any) {
        console.error('Error fetching comments:', error);
        return { success: false, message: error.message };
    }
}
