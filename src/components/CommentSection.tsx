import React, { useEffect, useState } from 'react';
import { createComment, getComments } from '@/services/commentService';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Comment } from "@/Interfaces/Comment"
import { useParams } from 'next/navigation';
import { toast } from './ui/use-toast';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

const CommentSection = () => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [comment, setComment] = useState('');
    const [isLoadingComment, setIsLoadingComment] = useState(false);
    const [isLoadingSend, setIsLoadingSend] = useState(false);
    const { id } = useParams();
    const loadId = id
    useEffect(() => {
        const fetchComments = async () => {
            setIsLoadingComment(true);
            const response = await getComments(loadId);
            if (response.success && response.comments) {
                setComments(response.comments);

            } else {

                toast({
                    title: 'Error',
                    description:
                        response.message || 'Failed to fetch comments',
                    variant: 'destructive',
                });
            }
            setIsLoadingComment(false);
        };

        fetchComments();
    }, [loadId]);

    const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoadingSend(true);


        const response = await createComment({ loadId, content: comment });

        if (response.success && response.comment) {
            setComments((prev) => [response.comment!, ...prev]);
            toast({
                title: "Comment Added Successfully!",
                variant: 'default',
            });
        } else {
            toast({
                title: 'Error',
                description:
                    response.message || 'Failed to create comment',
                variant: 'destructive',
            });

        }

        setIsLoadingSend(false);
        setComment('');
    };

    return (
        <div>
            <h4 className="mb-3 text-md font-semibold text-gray-800">Comments of LoadId: {loadId}</h4>

            {isLoadingComment ? (
                <p>Loading comments...</p>
            ) : (
                <ScrollArea className="h-40 w-full">
                    {comments.length === 0 ? <p className='flex justify-center'>No comments yet.</p> : comments.map((comment) => (
                        <div
                            key={comment._id}
                            className="w-full mb-2 p-2 border rounded-md shadow-sm bg-gray-50"
                        >
                            <div className="text-sm font-medium text-gray-800">{comment.sentBy}</div>
                            <div className="text-sm text-gray-700 break-words">{comment.content}</div>
                            <div className="text-xs text-gray-500">{new Date(comment.timestamp).toLocaleString()}</div>
                        </div>
                    ))}
                </ScrollArea>
            )}

            <form onSubmit={handleCommentSubmit} className="mt-4 flex">
                <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Type your comment..."
                    className="flex-grow p-2 border border-gray-300 rounded-md"
                />
                <Button type="submit" disabled={isLoadingSend} className="ml-2">
                    {isLoadingSend ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending
                        </>
                    ) : (
                        'Send'
                    )}
                </Button>
            </form>
        </div>
    );
};

export default CommentSection;
