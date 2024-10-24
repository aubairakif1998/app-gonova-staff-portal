import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LinkPreview } from '@/components/ui/link-preview';
import { IconUpload, IconTrash } from "@tabler/icons-react";

interface AttachedDocsDialogProps {
    open: boolean;
    onClose: () => void;
    urls: string[]; // Array of URLs passed to the component
    loadId: string | string[]; // Load ID to identify the specific load
    onDelete: (url: string) => Promise<void>; // Delete function passed from parent
}

export const AttachedDocsDialog: React.FC<AttachedDocsDialogProps> = ({ open, onClose, urls, loadId, onDelete }) => {
    const [attachedDocs, setAttachedDocs] = useState<string[]>(urls); // Store the URLs in state
    const [loading, setLoading] = useState<boolean>(false);

    const handleDelete = async (url: string) => {
        setLoading(true);
        try {
            await onDelete(url); // Call the delete function passed as a prop
            setAttachedDocs((prev) => prev.filter((docUrl) => docUrl !== url)); // Remove the URL from the state
        } catch (error) {
            console.error('Failed to delete document:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="w-full max-w-3xl p-4 overflow-auto">
                <DialogHeader>
                    <DialogTitle>Attached Documents</DialogTitle>
                    <DialogClose onClick={onClose} />
                </DialogHeader>
                <div className="p-4">
                    {loading ? (
                        <div className="flex justify-center items-center h-60">
                            <span className="text-gray-600">Loading...</span> {/* Replace with a spinner if desired */}
                        </div>
                    ) : attachedDocs.length === 0 ? (
                        <div className="flex justify-center items-center h-60">
                            <span className="text-gray-600">No documents found</span>
                        </div>
                    ) : (
                        <div>
                            <ul className="space-y-3">
                                {attachedDocs.map((url, index) => (
                                    <li key={index} className="flex items-center justify-between p-2 bg-gray-50 border rounded-md shadow-sm">
                                        <a
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 font-bold hover:underline"
                                        >
                                            {url}
                                        </a>
                                        <Button
                                            variant="destructive"

                                            onClick={() => handleDelete(url)}
                                            className="ml-2 text-white"
                                        >
                                            <IconTrash size={16} />
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
