import dbConnect from '@/lib/dbConnect';
import CarrierModel from '@/model/Carrier';
import { z } from 'zod';
const dotValidation = z
    .string()
    .regex(/^\d{4,7}$/, 'DOT number must be between 4 and 7 digits');
const usdotNumberValidation = z
    .string()
    .min(1, 'USDOT number must be at least 1 digit')
    .max(8, 'USDOT number must be no more than 8 digits')
    .regex(/^\d{1,8}$/, 'USDOT number must be a numeric value between 1 and 8 digits');
const dotQuerySchema = z.object({
    dot: usdotNumberValidation,
});

export async function GET(request: Request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const queryParams = {
            dot: searchParams.get('dot'),
        };

        const result = dotQuerySchema.safeParse(queryParams);

        if (!result.success) {
            const dotErrors = result.error.format().dot?._errors || [];
            return Response.json(
                {
                    success: false,
                    message:
                        dotErrors?.length > 0
                            ? dotErrors.join(', ')
                            : 'Invalid query parameters',
                },
                { status: 400 }
            );
        }

        const { dot } = result.data;

        const existingCarrier = await CarrierModel.findOne({
            dot,
        });

        if (existingCarrier) {
            return Response.json(
                {
                    success: false,
                    message: 'USDOT number is already taken',
                },
                { status: 400 }
            );
        }

        return Response.json(
            {
                success: true,
                message: 'USDOT number is unique',
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error checking USDOT number:', error);
        return Response.json(
            {
                success: false,
                message: 'Error checking USDOT number',
            },
            { status: 500 }
        );
    }
}
