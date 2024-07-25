import dbConnect from '@/lib/dbConnect';
import StaffUser, { IStaffUser } from '@/model/StaffUser';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email, accessType } = await request.json();

    // Check if email already exists
    const existingStaffUser = await StaffUser.findOne({ email });

    if (existingStaffUser) {
      return new Response(JSON.stringify({ success: false, message: 'Staff user already exists with this email' }), { status: 400 });
    }

    // Generate a random password
    const generatedPassword = Math.random().toString(36).slice(-8); // Generates a random password of length 8

    // Hash the password
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    // Create new user
    const newUser: IStaffUser = new StaffUser({
      email,
      password: hashedPassword,
      accessType,
      // isVerified: false, // Assuming you have an isVerified field
    });

    await newUser.save();

    // Respond with success and the generated password
    return new Response(JSON.stringify({ success: true, message: 'User registered successfully', password: generatedPassword }), { status: 201 });

  } catch (error) {
    console.error('Error registering user:', error);
    return new Response(JSON.stringify({ success: false, message: 'Error registering user' }), { status: 500 });
  }
}
