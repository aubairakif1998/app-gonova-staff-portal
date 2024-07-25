import mongoose, { Schema, Document, Model, Types } from 'mongoose';


export interface IStaffUser extends Document {
  email: string;
  // verifyCode: string;
  // verifyCodeExpiry: Date;
  // isVerified: boolean;
  password: string;
  accessType: string;
}


const StaffUserSchema: Schema<IStaffUser> = new Schema({

  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/\S+@\S+\.\S+/, "Invalid email address"],
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  // verifyCode: {
  //   type: String,
  //   required: [true, 'Verify Code is required'],
  // },
  // verifyCodeExpiry: {
  //   type: Date,
  //   required: [true, 'Verify Code Expiry is required'],
  // },
  // isVerified: {
  //   type: Boolean,
  //   default: false,
  // },
  accessType: {
    type: String,
    required: [true, 'AccessType is required'],
  },
});

const StaffUser: Model<IStaffUser> = mongoose.models.StaffUser || mongoose.model<IStaffUser>('StaffUser', StaffUserSchema);

export default StaffUser; 