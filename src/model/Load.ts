import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface ILoad extends Document {
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
    assignedCarrierMC: string;
    agentStaffMemberId: string;
    createdBy: string;

}

const LoadSchema: Schema<ILoad> = new Schema(
    {
        pickupDate: { type: Date, required: true },
        dropOffDate: { type: Date, required: true },
        pickupLocation: {
            type: String,
            required: true,
        },
        deliveryLocation: {
            type: String,
            required: true,
        },
        shipmentRequirement: {
            type: String,
        },
        supportedDocuments: {
            type: [String],
            required: true
        },
        latestLocationOfLoad: {
            type: {
                type: String, // 'Point'
                enum: ['Point'],
            },
            coordinates: {
                type: [Number],
            },
        },
        status: {
            type: String,
            enum: ["Upcoming", "InTransit", "Completed", "Cancelled"],
            required: true,
        },
        shipmentRefId: {
            type: String,
            ref: 'Shipment',
            required: true,
        },
        assignedCarrierMC: {
            type: String,
            ref: 'Carrier',
            required: true,
        },
        agentStaffMemberId: {
            type: String,
            ref: 'StaffUser',
            required: true,
        },
        createdBy: {
            type: String,
            required: true,
        }
    }, {
    timestamps: true,
});

const LoadModel: Model<ILoad> = mongoose.models.Load || mongoose.model<ILoad>('Load', LoadSchema);
export default LoadModel;
