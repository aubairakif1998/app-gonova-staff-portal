import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IStandAloneLoad extends Document {
    standaloneId: string;
    pickupDate: Date;
    dropOffDate: Date;
    pickupLocation: string;
    deliveryLocation: string;
    serviceType: string;
    loadContainAlcohol: boolean;
    hazardousMaterial: boolean;
    itemDescription: string;
    packaging: "Pallet" | "Box" | "Crate" | "Bundle" | "Drum" | "Roll" | "Bale";
    dimensions: {
        length: number;
        width: number;
        height: number;
    };
    weight: number;
    quantity: number;
    shipmentRequirement?: string;
    supportedDocuments: string[];
    latestLocationOfLoad: {
        type: 'Point';
        coordinates: [number, number];
    };
    status: "Carrier not assigned" | "Upcoming" | "InTransit" | "Completed" | "Cancelled";
    shipperCompanyName: string;
    assignedCarrierMC?: string;
    agentStaffMemberId: string;
    attachedDocs?: string[];
    createdBy: string;
}

const StandAloneLoadSchema: Schema<IStandAloneLoad> = new Schema({
    standaloneId: {
        type: String,
        required: true,  // Ensure loadId is required
        unique: true,    // Ensure loadId is unique
        index: true,     // Add an index for faster lookups
    },
    pickupDate: { type: Date, required: true },
    dropOffDate: { type: Date, required: true },
    pickupLocation: { type: String, required: true },
    deliveryLocation: { type: String, required: true },
    serviceType: { type: String, required: true },
    loadContainAlcohol: { type: Boolean, required: true },
    hazardousMaterial: { type: Boolean, required: true },
    itemDescription: { type: String, required: true },
    packaging: { type: String, enum: ["Pallet", "Box", "Crate", "Bundle", "Drum", "Roll", "Bale"], required: true },
    dimensions: {
        length: { type: Number, required: true },
        width: { type: Number, required: true },
        height: { type: Number, required: true }
    },
    weight: { type: Number, required: true },
    quantity: { type: Number, required: true },
    shipmentRequirement: { type: String },
    supportedDocuments: { type: [String], required: true },
    latestLocationOfLoad: {
        type: {
            type: String,
            enum: ['Point'],
        },
        coordinates: {
            type: [Number],
        },
    },
    status: {
        type: String,
        enum: ["Carrier not assigned", "Upcoming", "InTransit", "Completed", "Cancelled"],
        required: true,
    },
    shipperCompanyName: { type: String, required: true },
    assignedCarrierMC: {
        type: String,
    },
    agentStaffMemberId: { type: String, required: true },
    attachedDocs: { type: [String], },
    createdBy: { type: String, required: true }
}, {
    timestamps: true,
});

const StandAloneLoadModel: Model<IStandAloneLoad> = mongoose.models.StandAloneLoad || mongoose.model<IStandAloneLoad>('StandAloneLoad', StandAloneLoadSchema);

export default StandAloneLoadModel;
