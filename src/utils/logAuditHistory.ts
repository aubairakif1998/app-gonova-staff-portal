import AuditHistory from '@/model/AuditHistory';

interface Change {
    field: string;
    oldValue: any;
    newValue: any;
}

export const logAuditHistory = async (
    loadId: string,
    loadModel: string,
    updatedBy: string,
    changes: Change[]
): Promise<void> => {
    try {
        // Filter out changes where oldValue and newValue are the same
        const filteredChanges = changes.filter(change => change.oldValue !== change.newValue);

        // Proceed only if there are meaningful changes
        if (filteredChanges.length > 0) {
            const newAuditLog = new AuditHistory({
                loadId,
                loadModel,
                updatedBy,
                changes: filteredChanges,
            });

            await newAuditLog.save();
        }
    } catch (error) {
        console.error('Failed to log audit history:', error);
    }
};
