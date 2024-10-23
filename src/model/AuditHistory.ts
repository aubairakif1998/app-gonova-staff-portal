import mongoose, { Types, Schema, model } from 'mongoose';

const auditLogSchema = new Schema({
    loadId: {
        type: String,
        required: true,
        refPath: 'loadModel',
    },
    loadModel: {
        type: String,
        required: true,
        enum: ['Load', 'StandAloneLoad'], // The models that `loadId` can reference
    },
    updatedBy: {
        type: String,
        required: true,
    },
    changes: [
        {
            field: { type: String, required: true },
            oldValue: { type: Schema.Types.Mixed, required: true },
            newValue: { type: Schema.Types.Mixed, required: true },
        },
    ],
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
});

const AuditHistory = mongoose.models.AuditHistory || model('AuditHistory', auditLogSchema);
export default AuditHistory;
