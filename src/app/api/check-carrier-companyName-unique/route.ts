import dbConnect from '@/lib/dbConnect';
import { z } from 'zod';
import { companyNameValidation } from '@/schemas/signUpSchema';
import CarrierModel from '@/model/Carrier';

const CompanynameQuerySchema = z.object({
    companyName: companyNameValidation,
});

export async function GET(request: Request) {
    await dbConnect();

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

        const existingCarrier = await CarrierModel.findOne({
            companyName,
        });

        if (existingCarrier) {
            return Response.json(
                {
                    success: false,
                    message: 'Companyname is already taken',
                },
                { status: 400 }
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
