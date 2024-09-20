import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IShipper extends Document {
    companyName: string;
    locationAddress: string;
    city: string;
    zip: string;
    email: string;
    isVerified: boolean;
    phoneNumber: string;
    standAloneLoads: Types.ObjectId[];
    shipments: Types.ObjectId[];
    activationToken?: string;  // Optional field
    activationTokenExpire?: Date;  // Optional field
    password: string;  // Required field for the password
}

const ShipperSchema: Schema<IShipper> = new Schema({
    companyName: {
        type: String,
        required: [true, 'CompanyName is required'],
        trim: true,
        unique: true,
    },
    locationAddress: {
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
    password: {
        type: String,  // Password should be stored as a hashed string
        required: [true, 'Password is required'],
    },
    activationToken: {
        type: String,  // Token as a string
        default: null,  // Default to null
    },
    activationTokenExpire: {
        type: Date,  // Expiration date for the token
        default: null,  // Default to null
    },
    shipments: [{ type: Schema.Types.ObjectId, ref: 'Shipment' }],
    standAloneLoads: [{ type: Schema.Types.ObjectId, ref: 'StandAloneLoad' }],
}, {
    timestamps: true,
});

const ShipperModel: Model<IShipper> = mongoose.models.Shipper || mongoose.model<IShipper>('Shipper', ShipperSchema);

export default ShipperModel;
