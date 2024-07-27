import dbConnect from '@/lib/dbConnect';
import StaffUser, { IStaffUser } from '@/model/StaffUser';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email, accessType, password } = await request.json();
    const existingStaffUser = await StaffUser.findOne({ email });

    if (existingStaffUser) {
      return new Response(JSON.stringify({ success: false, message: 'Staff user already exists with this email' }), { status: 400 });
    }

    // Hash the password provided by the user
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser: IStaffUser = new StaffUser({
      email,
      password: hashedPassword,
      accessType,
      isVerified: false,
    });

    await newUser.save();

    // Respond with success
    return new Response(JSON.stringify({ success: true, message: 'Staff User registered successfully' }), { status: 201 });

  } catch (error) {
    console.error('Error registering user:', error);
    return new Response(JSON.stringify({ success: false, message: 'Error registering user' }), { status: 500 });
  }
}
