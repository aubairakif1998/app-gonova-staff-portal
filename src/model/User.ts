import mongoose, { Schema, Document, Model, Types } from 'mongoose';


export interface IUser extends Document {
  companyName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  email: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  phoneNumber: string;
  password: string;
  shipments: Types.ObjectId[]; // Array of Quote document IDs
}


const UserSchema: Schema<IUser> = new Schema({
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
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  verifyCode: {
    type: String,
    required: [true, 'Verify Code is required'],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, 'Verify Code Expiry is required'],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  shipments: [{ type: Schema.Types.ObjectId, ref: 'Shipment' }]
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User; 