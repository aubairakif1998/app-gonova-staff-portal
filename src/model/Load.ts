import mongoose, { Document, Schema, Types } from 'mongoose';

export enum LoadStatus {
    Upcoming = 'Upcoming',
    InTransit = 'InTransit',
    Completed = 'Completed',
    Cancelled = 'Cancelled',
}

export interface Load extends Document {
    pickupDate: Date;
    dropOffDate: Date;
    pickupLocation: string;
    dropOffLocation: string;
    shipmentRequirement: string;
    agentStaffMemberId: string;
    agentStaffMemberName: string;
    supportedDocuments: string[];
    latestLocationOfLoad: {
        type: 'Point';
        coordinates: [number, number];
    };
    status: LoadStatus;
    shipmentRefId: string;
    assignedCarrierName: string;
    createdBy: string;
    assignedCarrierId: Types.ObjectId;
}

const LoadSchema: Schema<Load> = new Schema(
    {
        pickupDate: { type: Date, required: true },
        dropOffDate: { type: Date, required: true },
        pickupLocation: {
            type: String,
            required: true,
        },
        dropOffLocation: {
            type: String,
            required: true,
        },
        shipmentRequirement: {
            type: String,
            required: true,
        },

        agentStaffMemberName: {
            type: String,
            required: true,
        },
        supportedDocuments: {
            type: [String],
            required: true,
        },
        latestLocationOfLoad: {
            type: {
                type: String, // 'Point'
                enum: ['Point'],
                required: true,
            },
            coordinates: {
                type: [Number],
                required: true,
            },
        },
        status: {
            type: String,
            enum: Object.values(LoadStatus),
            required: true,
        },
        agentStaffMemberId: {
            type: String,
            ref: 'StaffUser',
            required: true,
        },
        shipmentRefId: {
            type: String,
            ref: 'Shipment',
            required: true,
        },
        assignedCarrierName: {
            type: String,
            required: true,
        },
        assignedCarrierId: {
            type: Schema.Types.ObjectId,
            ref: 'Carrier',
            required: true,
        },
        createdBy: {
            type: String,
            required: true,
        }
    }, {
    timestamps: true,
});

const LoadModel = mongoose.model<Load>('Load', LoadSchema);
export default LoadModel;
