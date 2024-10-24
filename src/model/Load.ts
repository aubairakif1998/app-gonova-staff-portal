import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface ILoad extends Document {
    loadId: string; // Add the loadId field
    pickupDate: Date;
    dropOffDate: Date;
    pickupLocation: string;
    deliveryLocation: string;
    shipmentRequirement: string;
    supportedDocuments: string[];
    latestLocationOfLoad: {
        type: 'Point';
        coordinates: [number, number];
    };
    status: string;
    shipmentRefId: string;
    assignedCarrierMC?: string;
    agentStaffMemberId: string;
    attachedDocs?: string[];
    createdBy: string;
}

const LoadSchema: Schema<ILoad> = new Schema(
    {
        loadId: {
            type: String,
            required: true,  // Ensure loadId is required
            unique: true,    // Ensure loadId is unique
            index: true,     // Add an index for faster lookups
        },
        pickupDate: { type: Date, required: true },
        dropOffDate: { type: Date, required: true },
        pickupLocation: { type: String, required: true },
        deliveryLocation: { type: String, required: true },
        shipmentRequirement: { type: String },
        supportedDocuments: { type: [String], required: true },
        latestLocationOfLoad: {
            type: {
                type: String, // 'Point'
                enum: ['Point'],
            },
            coordinates: { type: [Number] },
        },
        status: {
            type: String,
            enum: ["Carrier not assigned", "Upcoming", "InTransit", "Completed", "Cancelled"],
            required: true,
        },
        shipmentRefId: { type: String, required: true },
        assignedCarrierMC: { type: String },
        agentStaffMemberId: { type: String, required: true },
        attachedDocs: { type: [String], },
        createdBy: { type: String, required: true }
    },
    {
        timestamps: true,
    }
);

const LoadModel: Model<ILoad> = mongoose.models.Load || mongoose.model<ILoad>('Load', LoadSchema);
export default LoadModel;
