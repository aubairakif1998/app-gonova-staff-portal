import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import ShipperModel from '@/model/Shipper';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { token, password } = await request.json();

        // Find the user by token
        const user = await ShipperModel.findOne({
            activationToken: token,
            // activationTokenExpire: { $gt: Date.now() }, // Ensure token hasn't expired
        });

        // If user not found or token is expired
        if (!user) {
            return NextResponse.json({ success: false, message: 'Invalid or expired token' }, { status: 400 });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the user fields
        user.password = hashedPassword;
        user.isVerified = true;
        user.activationToken = undefined; // Clear the token
        user.activationTokenExpire = undefined; // Clear token expiry

        // Save the user
        await user.save();

        return NextResponse.json({ success: true, message: 'Account activated successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error activating account:', error);
        return NextResponse.json({ success: false, message: 'Error activating account' }, { status: 500 });
    }
}
