// 'use client';

// import { ApiResponse } from '@/types/ApiResponse';
// import { zodResolver } from '@hookform/resolvers/zod';
// import Link from 'next/link';
// import { useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { useDebounce } from 'usehooks-ts';
// import * as z from 'zod';
// import InputMask from 'react-input-mask';
// import { Button } from '@/components/ui/button';
// import {
//   Form,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import { useToast } from '@/components/ui/use-toast';
// import axios, { AxiosError } from 'axios';
// import { Loader2 } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import { signUpSchema } from '@/schemas/signUpSchema';

// export default function SignUpForm() {
//   const [username, setUsername] = useState('');
//   const [usernameMessage, setUsernameMessage] = useState('');
//   const [isCheckingUsername, setIsCheckingUsername] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const debouncedUsername = useDebounce(username, 300);

//   const router = useRouter();
//   const { toast } = useToast();

//   const form = useForm<z.infer<typeof signUpSchema>>({
//     resolver: zodResolver(signUpSchema),
//     defaultValues: {
//       username: '',
//       email: '',
//       password: '',
//       phoneNumber: '',
//       companyName: '',
//       address: '',
//       confirmPassword: '',
//     },
//   });

//   useEffect(() => {
//     const checkUsernameUnique = async () => {
//       if (debouncedUsername) {
//         setIsCheckingUsername(true);
//         setUsernameMessage(''); // Reset message
//         try {
//           const response = await axios.get<ApiResponse>(
//             `/api/check-username-unique?username=${debouncedUsername}`
//           );
//           setUsernameMessage(response.data.message);
//         } catch (error) {
//           const axiosError = error as AxiosError<ApiResponse>;
//           setUsernameMessage(
//             axiosError.response?.data.message ?? 'Error checking username'
//           );
//         } finally {
//           setIsCheckingUsername(false);
//         }
//       }
//     };
//     checkUsernameUnique();
//   }, [debouncedUsername]);

//   const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
//     setIsSubmitting(true);
//     try {
//       const response = await axios.post<ApiResponse>('/api/sign-up', data);

//       toast({
//         title: 'Success',
//         description: response.data.message,
//       });

//       router.replace(`/verify/${username}`);

//       setIsSubmitting(false);
//     } catch (error) {
//       console.error('Error during sign-up:', error);

//       const axiosError = error as AxiosError<ApiResponse>;

//       // Default error message
//       let errorMessage = axiosError.response?.data.message ?? 'There was a problem with your sign-up. Please try again.';

//       toast({
//         title: 'Sign Up Failed',
//         description: errorMessage,
//         variant: 'destructive',
//       });

//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-800">
//       <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
//         <div className="text-center">
//           <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
//             NOVA Freight
//           </h1>
//           <p className="mb-4">We provide brokerage services</p>
//         </div>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//             <FormField
//               name="username"
//               control={form.control}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Username</FormLabel>
//                   <Input
//                     {...field}
//                     onChange={(e) => {
//                       field.onChange(e);
//                       setUsername(e.target.value);
//                     }}
//                   />
//                   {isCheckingUsername && <Loader2 className="animate-spin" />}
//                   {!isCheckingUsername && usernameMessage && (
//                     <p
//                       className={`text-sm ${usernameMessage === 'Username is unique'
//                         ? 'text-green-500'
//                         : 'text-red-500'
//                         }`}
//                     >
//                       {usernameMessage}
//                     </p>
//                   )}
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               name="email"
//               control={form.control}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Email</FormLabel>
//                   <Input {...field} name="email" />
//                   <p className='text-muted text-gray-400 text-sm'>We will send you a verification code</p>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               name="phoneNumber"
//               control={form.control}
//               render={({ field, formState }) => (
//                 <FormItem>
//                   <FormLabel>Phone Number (US)</FormLabel>
//                   <InputMask
//                     mask="(999) 999-9999"
//                     id="phoneNumber"
//                     {...field}

//                     className={`w-full px-4 py-2 border ${formState.errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-blue-600 transition duration-300`}
//                   />
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               name="companyName"
//               control={form.control}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Company Name</FormLabel>
//                   <Input {...field} name="companyName" />
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               name="address"
//               control={form.control}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Address</FormLabel>
//                   <Input {...field} name="address" />
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               name="password"
//               control={form.control}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Password</FormLabel>
//                   <Input type="password" {...field} name="password" />
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               name="confirmPassword"
//               control={form.control}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Confirm Password</FormLabel>
//                   <Input type="password" {...field} name="confirmPassword" />
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <Button type="submit" className='w-full' disabled={isSubmitting}>
// {isSubmitting ? (
//   <>
//     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//     Please wait
//   </>
// ) : (
//   'Sign Up'
// )}
//             </Button>
//           </form>
//         </Form>
{/* <div className="text-center mt-4">
  <p>
    Already a member?{' '}
    <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
      Sign in
    </Link>
  </p>
</div> */}
//       </div>
//     </div>
//   );
// }

import SignupForm from '@/components/SignupForm'
import React from 'react'

function page() {
  return (
    <section className='py-24'>
      <div className='container'>
        <SignupForm />
      </div>
    </section>
  )
}

export default page

