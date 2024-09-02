import AuditHistory from '@/model/AuditHistory';
import { NextApiRequest, NextApiResponse } from 'next';

const logChanges = async (req: NextApiRequest, res: NextApiResponse, next: Function) => {
    try {
        const { loadId, loadModel, updatedBy, changes } = req.body;

        if (!loadId || !loadModel || !updatedBy || !changes) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (!['Load', 'StandAloneLoad'].includes(loadModel)) {
            return res.status(400).json({ error: 'Invalid loadModel value' });
        }

        const newAuditLog = new AuditHistory({
            loadId,
            loadModel, // Dynamic model reference based on request data
            updatedBy,
            changes,
        });

        await newAuditLog.save();
        next(); // Call the next middleware or route handler
    } catch (error: any) {
        return res.status(500).json({ error: 'Failed to log changes', details: error });
    }
};

export default logChanges;
