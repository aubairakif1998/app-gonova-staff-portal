
// models/Carrier.ts

import mongoose, { Document, Schema, Types } from 'mongoose';

interface Contact {
    email: string;
    phone: string;
    workingHours: string;
}

interface VehicleInformation {
    truckNumber: string;
    driverName: string;
    driverContactNo: string;
}

export interface ICarrier extends Document {
    companyName: string;
    transportMCNumber: string;
    dot: string;
    contacts: {
        primary: Contact;
        secondary: Contact;
    };
    address: string;
    vehicleInformation: VehicleInformation;
    assignedLoads: Types.ObjectId[];
    createdBy: string;
}

const CarrierSchema: Schema<ICarrier> = new Schema({
    companyName: { type: String, required: true, unique: true },
    transportMCNumber: { type: String, required: true, unique: true },
    dot: { type: String, required: true, unique: true },
    contacts: {
        primary: {
            email: { type: String, required: true },
            phone: { type: String, required: true },
            workingHours: { type: String, required: true },
        },
        secondary: {
            email: { type: String, required: true },
            phone: { type: String, required: true },
            workingHours: { type: String, required: true },
        },
    },
    address: { type: String, required: true },
    vehicleInformation: {
        truckNumber: { type: String, required: true },
        driverName: { type: String, required: true },
        driverContactNo: { type: String, required: true },
    },
    createdBy: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
});

const CarrierModel = mongoose.models.Carrier || mongoose.model<ICarrier>('Carrier', CarrierSchema);

export default CarrierModel;
