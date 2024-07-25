import mongoose, { Document, Schema, Types } from 'mongoose';

export enum LoadStatus {
    Pending = 'Pending',
    InProgress = 'InProgress',
    Completed = 'Completed',
    Cancelled = 'Cancelled',
}

export interface Load extends Document {
    listOfPickupLocations: string[];
    listOfDropOffLocations: string[];
    shipmentRequirements: string;
    primaryAgentStaffMemberId: string;
    supportedDocuments: string[];
    latestLocationOfLoad: {
        type: 'Point';
        coordinates: [number, number];
    };
    status: LoadStatus;
    shipment: string; // Reference to Shipment
    assignedCarrierId: Types.ObjectId; // Reference to Carrier
}

const LoadSchema: Schema<Load> = new Schema({
    listOfPickupLocations: {
        type: [String],
        required: true,
    },
    listOfDropOffLocations: {
        type: [String],
        required: true,
    },
    shipmentRequirements: {
        type: String,
        required: true,
    },
    primaryAgentStaffMemberId: {
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
    shipment: {
        type: String,
        ref: 'Shipment',
        required: true,
    },
    assignedCarrierId: {
        type: Schema.Types.ObjectId,
        ref: 'Carrier',
        required: true,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});

const LoadModel = mongoose.model<Load>('Load', LoadSchema);

export default LoadModel;
