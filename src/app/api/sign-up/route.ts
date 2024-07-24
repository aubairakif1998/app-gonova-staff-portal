import dbConnect from '@/lib/dbConnect';
import UserModel, { IUser } from '@/model/User';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';

export async function POST(request: Request) {
  await dbConnect();


  try {
    const { email, password, companyName, phoneNumber, street, city, state, zip } = await request.json();

    // Check if username or email already exist
    const existingUser = await UserModel.findOne({ $or: [{ companyName }, { email }, { phoneNumber }] });

    if (existingUser) {
      if (existingUser.email === email) {
        return Response.json({ success: false, message: 'User already exists with this email' }, { status: 400 });
      } else if (existingUser.companyName === companyName) {
        return Response.json({ success: false, message: 'Company name is already taken' }, { status: 400 });
      }
      else {
        return Response.json({ success: false, message: 'Phone Number is already taken' }, { status: 400 });
      }
    }

    // Generate verification code
    // const verifyCode =Math.floor(100000 + Math.random() * 900000).toString();
    const verifyCode = '123456';

    const hashedPassword = await bcrypt.hash(password, 10);
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    // Create new user
    const newUser: IUser = new UserModel({
      email,
      password: hashedPassword,
      verifyCode,
      verifyCodeExpiry: expiryDate,
      companyName, // Add other mandatory fields as needed
      street,
      city,
      state,
      zip,
      phoneNumber,
      isVerified: false,
      shipments: []
    });

    await newUser.save();

    // Send verification email
    const emailResponse = await sendVerificationEmail(email, companyName, verifyCode);
    if (!emailResponse.success) {
      return Response.json({ success: false, message: emailResponse.message }, { status: 500 });
    }

    return Response.json({ success: true, message: 'User registered successfully. Please verify your account.' }, { status: 201 });

  } catch (error) {
    console.error('Error registering user:', error);
    return Response.json({ success: false, message: 'Error registering user' }, { status: 500 });
  }
}
