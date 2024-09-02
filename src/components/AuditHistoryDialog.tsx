// components/AuditHistoryDialog.tsx

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { fetchAuditHistory } from '@/services/auditService';
import { AuditRecord } from '@/Interfaces/AuditRecord';
import { Button } from '@/components/ui/button';

interface AuditHistoryDialogProps {
    open: boolean;
    onClose: () => void;
    loadId: string | string[];
}

export const AuditHistoryDialog: React.FC<AuditHistoryDialogProps> = ({ open, onClose, loadId }) => {
    const [auditHistory, setAuditHistory] = useState<AuditRecord[]>([]);
    const [selectedRecord, setSelectedRecord] = useState<AuditRecord | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (open && loadId) {
            const fetchHistory = async () => {
                setLoading(true);
                try {
                    const response = await fetchAuditHistory(loadId);
                    if (response.success) {
                        setAuditHistory(response.auditRecords);
                    }
                } catch (error) {
                    console.error('Failed to fetch audit history:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchHistory();
        }
    }, [open, loadId]);

    const handleRecordClick = (record: AuditRecord) => {
        setSelectedRecord(record);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="w-full max-w-3xl p-4 overflow-auto">
                <DialogHeader>
                    <DialogTitle>Audit History</DialogTitle>
                    <DialogClose onClick={onClose} />
                </DialogHeader>
                <div className="p-4">
                    {loading ? (
                        <div className="flex justify-center items-center h-60">
                            <span className="text-gray-600">Loading...</span> {/* Replace with a spinner if desired */}
                        </div>
                    ) : auditHistory.length === 0 ? (
                        <div className="flex justify-center items-center h-60">
                            <span className="text-gray-600">No data found</span>
                        </div>
                    ) : (
                        <>
                            <ul className="space-y-1 max-h-40 overflow-y-auto">
                                {auditHistory.filter(record =>
                                    record.changes.some(change => change.oldValue !== change.newValue)
                                ).map((record) => (
                                    <li key={record.createdAt} className="flex items-center justify-between p-2 bg-gray-50 border rounded-md shadow-sm hover:bg-gray-100">
                                        <Button variant="link" onClick={() => handleRecordClick(record)} className="text-blue-600 hover:underline">
                                            {record.updatedBy} changed on {new Date(record.createdAt).toLocaleString()}
                                        </Button>
                                    </li>
                                ))}
                            </ul>

                            {selectedRecord && (
                                <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
                                    <h3 className="font-semibold text-lg mb-2">Details:</h3>
                                    <div className="mb-2">
                                        <p><strong>Changed By:</strong> <span className="text-blue-600">{selectedRecord.updatedBy}</span></p>
                                        <p><strong>Changes Done At:</strong> <span className="text-gray-600">{new Date(selectedRecord.createdAt).toLocaleString()}</span></p>
                                    </div>
                                    <h4 className="font-semibold text-md mt-4 mb-2">Changes:</h4>
                                    <div className="max-h-60 overflow-y-auto">
                                        <ul className="space-y-1">
                                            {selectedRecord.changes.map((change, index) => {
                                                // Check if old and new values are different
                                                if (change.oldValue !== change.newValue) {
                                                    return (
                                                        <li key={index} className="flex items-center border-l-2 border-green-500 pl-4">
                                                            <div className="flex items-center space-x-2">
                                                                <span className="text-green-600">&#9654;</span> {/* Right arrow */}

                                                                <strong className="text-gray-800">{change.field}:</strong>
                                                                <div className="ml-2 flex items-center space-x-2">
                                                                    <span className="text-gray-600 bg-gray-200 px-2 py-1 rounded-sm">{change.oldValue}</span>
                                                                    <div className="text-gray-600 mx-2">→</div> {/* Arrow indicating change */}
                                                                    <span className="text-green-600 bg-green-200 px-2 py-1 rounded-sm">{change.newValue}</span>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    );
                                                }
                                                return null;
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
