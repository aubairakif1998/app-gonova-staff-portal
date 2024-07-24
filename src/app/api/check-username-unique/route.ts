// import dbConnect from '@/lib/dbConnect';
// import UserModel from '@/model/User';
// import { z } from 'zod';
// import { usernameValidation } from '@/schemas/signUpSchema';

// const UsernameQuerySchema = z.object({
//   username: usernameValidation,
// });

// export async function GET(request: Request) {
//   await dbConnect();

//   try {
//     const { searchParams } = new URL(request.url);
//     const queryParams = {
//       username: searchParams.get('username'),
//     };

//     const result = UsernameQuerySchema.safeParse(queryParams);

//     if (!result.success) {
//       const usernameErrors = result.error.format().username?._errors || [];
//       return Response.json(
//         {
//           success: false,
//           message:
//             usernameErrors?.length > 0
//               ? usernameErrors.join(', ')
//               : 'Invalid query parameters',
//         },
//         { status: 400 }
//       );
//     }

//     const { username } = result.data;

//     const existingVerifiedUser = await UserModel.findOne({
//       username,
//       isVerified: true,
//     });

//     if (existingVerifiedUser) {
//       return Response.json(
//         {
//           success: false,
//           message: 'Username is already taken',
//         },
//         { status: 200 }
//       );
//     }

//     return Response.json(
//       {
//         success: true,
//         message: 'Username is unique',
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Error checking username:', error);
//     return Response.json(
//       {
//         success: false,
//         message: 'Error checking username',
//       },
//       { status: 500 }
//     );
//   }
// }





import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { z } from 'zod';
import { companyNameValidation } from '@/schemas/signUpSchema';

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

    const existingVerifiedUser = await UserModel.findOne({
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
