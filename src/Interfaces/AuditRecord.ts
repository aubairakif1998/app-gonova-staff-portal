export interface AuditRecord {
    loadId: string;
    updatedBy: string;
    operation: string;
    createdAt: string;
    changes: ChangeDetail[]; // Details of the changes made
}

export interface ChangeDetail {
    field: string; // Name of the field that was changed
    oldValue: any; // Previous value of the field
    newValue: any; // New value of the field
}
