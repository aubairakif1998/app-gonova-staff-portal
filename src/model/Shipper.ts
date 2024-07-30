import mongoose, { Schema, Document, Model, Types } from 'mongoose';


export interface IShipper extends Document {
    companyName: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    email: string;
    isVerified: boolean;
    phoneNumber: string;
    shipments: Types.ObjectId[];
}


const ShipperSchema: Schema<IShipper> = new Schema({
    companyName: {
        type: String,
        required: [true, 'CompanyName is required'],
        trim: true,
        unique: true,
    },
    street: {
        type: String,
        required: true,
        trim: true,
        minlength: 2, maxlength: 30
    },
    city: {
        type: String,
        required: true,
        trim: true,
        minlength: 2, maxlength: 30
    },
    state: {
        type: String,
        required: true,
        trim: true,
        minlength: 2, maxlength: 30
    },
    zip: {
        type: String,
        required: true,
        match: [/^\d{5}(-\d{4})?$/, "Invalid postal address"], maxlength: 30
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/\S+@\S+\.\S+/, "Invalid email address"],
    },
    phoneNumber: {
        type: String,
        required: [true, 'phoneNumber is required'],
        trim: true,
        unique: true,
        match: [/^\(\d{3}\) \d{3}-\d{4}$/, "Invalid phone number"],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    shipments: [{ type: Schema.Types.ObjectId, ref: 'Shipment' }]
}, {
    timestamps: true,
});

const ShipperModel: Model<IShipper> = mongoose.models.Shipper || mongoose.model<IShipper>('Shipper', ShipperSchema);

export default ShipperModel; 