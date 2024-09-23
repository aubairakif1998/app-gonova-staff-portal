import dbConnect from '@/lib/dbConnect';
import CarrierModel from '@/model/Carrier';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';
import { z } from 'zod';
const transportMCNumberValidation = z
    .string()
    .min(3, 'MC number must be at least 3 characters')
    .regex(/^MC\d{1,7}$/, 'MC number must be in the format MC followed by 1 to 7 digits');
const transportMCNumberQuerySchema = z.object({
    transportMCNumber: transportMCNumberValidation,
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
            transportMCNumber: searchParams.get('transportMCNumber'),
        };

        const result = transportMCNumberQuerySchema.safeParse(queryParams);

        if (!result.success) {
            const transportMCNumberErrors = result.error.format().transportMCNumber?._errors || [];
            return Response.json(
                {
                    success: false,
                    message:
                        transportMCNumberErrors?.length > 0
                            ? transportMCNumberErrors.join(', ')
                            : 'Invalid query parameters',
                },
                { status: 400 }
            );
        }

        const { transportMCNumber } = result.data;

        const existingCarrier = await CarrierModel.findOne({
            transportMCNumber,
        });

        if (existingCarrier) {
            return Response.json(
                {
                    success: false,
                    message: 'MCNumber is already taken',
                },
                { status: 400 }
            );
        }

        return Response.json(
            {
                success: true,
                message: 'MCNumber is unique',
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error checking MCNumber:', error);
        return Response.json(
            {
                success: false,
                message: 'Error checking MCNumber',
            },
            { status: 500 }
        );
    }
}
