// services/auditService.ts

import axios from 'axios';

export const fetchAuditHistory = async (loadId: string | string[]) => {
    try {
        const response = await axios.get(`/api/audit-history/${loadId}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch audit history:', error);
        return { success: false, message: 'Failed to fetch audit history' };
    }
};
