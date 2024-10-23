export interface CommentPayload {
    loadId: string | string[];
    content: string;
}

export interface Comment {
    _id: string;
    loadId: string;
    content: string;
    sentBy: string;
    timestamp: string;
}

export interface CommentResponse {
    success: boolean;
    comments?: Comment[];
    comment?: Comment;
    message?: string;
}