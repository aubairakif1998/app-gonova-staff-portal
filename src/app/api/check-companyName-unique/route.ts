import dbConnect from '@/lib/dbConnect';
import ShipperModel from '@/model/Shipper';
import { z } from 'zod';
import { companyNameValidation } from '@/schemas/customerOnBoradingSchema';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';

const CompanynameQuerySchema = z.object({
    companyName: companyNameValidation,
});

export async function GET(request: Request) {
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
        const { searchParams } = new URL(request.url);
        const queryParams = {
            companyName: searchParams.get('companyName'),
        };

        const result = CompanynameQuerySchema.safeParse(queryParams);

        if (!result.success) {
            const companyNameErrors = result.error.format().companyName?._errors || [];
            return Response.json(
                {
                    success: false,
                    message:
                        companyNameErrors?.length > 0
                            ? companyNameErrors.join(', ')
                            : 'Invalid query parameters',
                },
                { status: 400 }
            );
        }

        const { companyName } = result.data;

        const existingVerifiedUser = await ShipperModel.findOne({
            companyName,
            isVerified: true,
        });

        if (existingVerifiedUser) {
            return Response.json(
                {
                    success: false,
                    message: 'Companyname is already taken',
                },
                { status: 200 }
            );
        }

        return Response.json(
            {
                success: true,
                message: 'Companyname is unique',
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error checking companyName:', error);
        return Response.json(
            {
                success: false,
                message: 'Error checking companyName',
            },
            { status: 500 }
        );
    }
}
