import dbConnect from '@/lib/dbConnect';
import ShipperModel, { IShipper } from '@/model/Shipper';
import crypto from 'crypto';
import sendActivationEmail from '@/utils/sendActivationEmail'; // Utility to send email
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { email, city, companyName, locationAddress, phoneNumber, zip } = await request.json();
        const existingShipperUser = await ShipperModel.findOne({ email });

        if (existingShipperUser) {
            return NextResponse.json({ success: false, message: 'Shipper/Customer already exists with this email' }, { status: 400 });
        }

        // Generate token
        const activationToken = crypto.randomBytes(32).toString('hex');
        const activationTokenExpire = Date.now() + 3600000 * 24; // Token expires in 24 hours

        // Create new shipper/customer
        const newShipper: IShipper = new ShipperModel({
            email,
            city,
            companyName,
            locationAddress,
            phoneNumber,
            zip,
            activationToken,
            activationTokenExpire,
            password: "@!@default",
            isVerified: false,
        });

        await newShipper.save();

        // Generate the URL for activation
        const activationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/activate/${activationToken}`;

        // Send email with activation link
        await sendActivationEmail(email, activationUrl);

        return NextResponse.json({ success: true, message: 'Shipper/Customer registered. Activation email sent.' }, { status: 201 });

    } catch (error) {
        console.error('Error registering user:', error);
        return NextResponse.json({ success: false, message: 'Error registering user' }, { status: 500 });
    }
}
