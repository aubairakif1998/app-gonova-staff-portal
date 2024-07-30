import mongoose, { Document, Schema, Types } from 'mongoose';

// Function to generate a 6-character ID
const generateId = (): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    console.log(result, 'result1')
    return result;
};

export interface IShipment extends Document {
    shipmentID: string;
    shipperId: Types.ObjectId;
    serviceType: string;
    requestingLoadingDate: Date;
    arrivalDate: Date;
    pickupLocation: string;
    deliveryLocation: string;
    shipmentContainAlcohol: boolean;
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
    contract: Types.ObjectId;
    status: "Active" | "Non-Active";
}

// Define Shipment schema with reference to User and Contract schemas
const ShipmentSchema: Schema<IShipment> = new Schema({
    shipmentID: { type: String, default: generateId, required: true, unique: true }, // Custom ID of 6 characters
    shipperId: { type: Schema.Types.ObjectId, ref: 'Shipper', required: true }, // Reference to User
    serviceType: { type: String, required: true },
    requestingLoadingDate: { type: Date, required: true },
    arrivalDate: { type: Date, required: true },
    pickupLocation: { type: String, required: true },
    deliveryLocation: { type: String, required: true },
    shipmentContainAlcohol: { type: Boolean, required: true },
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
    contract: { type: Schema.Types.ObjectId, ref: 'Contract' },
    status: { type: String, enum: ["Active", "Non-Active"], required: true },
}, {
    timestamps: true,
});

const ShipmentModel = mongoose.models.Shipment || mongoose.model<IShipment>('Shipment', ShipmentSchema);
export interface IContract extends Document {
    shipmentID: string;
    shipperId: Types.ObjectId;
    carrierId: Types.ObjectId;
    userEmail: string;
    carrierEmail: string;
    carrierCompanyName: string;
    settledCost: string;
    loadingDate: Date;
    arrivalDate: Date;
    signedDate: Date;
    pickupLocation: string;
    dropoffLocation: string;
    completedSuccessfully: boolean;
}

// Define Contract schema with reference to Shipment and User schemas
const ContractSchema: Schema<IContract> = new Schema({
    shipperId: { type: Schema.Types.ObjectId, ref: 'Shipper', required: true }, // Reference to User
    carrierId: { type: Schema.Types.ObjectId, ref: 'Carrier', required: true }, // Reference to Carrier
    userEmail: { type: String, required: true },
    carrierEmail: { type: String, required: true },
    carrierCompanyName: { type: String, required: true },
    settledCost: { type: String, required: true },
    loadingDate: { type: Date, required: true },
    arrivalDate: { type: Date, required: true },
    signedDate: { type: Date, required: true },
    pickupLocation: { type: String, required: true },
    dropoffLocation: { type: String, required: true },
}, {
    timestamps: true,
});

const ContractModel = mongoose.models.Contract || mongoose.model<IContract>('Contract', ContractSchema);

export { ShipmentModel, ContractModel };
