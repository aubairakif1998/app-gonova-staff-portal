import dbConnect from '@/lib/dbConnect';
import ShipperModel, { IShipper } from '@/model/Shipper';
import crypto from 'crypto';
import sendActivationEmail from '@/utils/sendActivationEmail'; // Utility to send email
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';

export async function POST(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const _user = session?.user;

    if (!session || !_user) {
        return new Response(
            JSON.stringify({ success: false, message: 'Not authenticated' }),
            { status: 401 }
        );
    }
    try {
        const { email, city, companyName, locationAddress, phoneNumber, zip } = await request.json();
        const existingShipperUser = await ShipperModel.findOne({ email });
        const details = {
            email,
            city,
            companyName,
            locationAddress,
            phoneNumber,
            zip
        };
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
        const activationUrl = `${process.env.NEXT_CUSTOMER_ACTIVATE_APP_URL}/activate/${activationToken}`;

        // Send email with activation link
        await sendActivationEmail(email, activationUrl, details);

        return NextResponse.json({ success: true, message: 'Shipper/Customer registered. Activation email sent.' }, { status: 201 });

    } catch (error) {
        console.error('Error registering user:', error);
        return NextResponse.json({ success: false, message: 'Error registering user' }, { status: 500 });
    }
}
