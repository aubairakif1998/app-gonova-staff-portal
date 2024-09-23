import { z } from 'zod';


export const companyNameValidation = z
    .string()
    .min(2, 'Company Name must be at least 2 characters')
    .max(20, 'Company Name  must be no more than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username must not contain special characters');

export const customerOnBoradingSchema = z.object({
    email: z.string().nonempty("Email is required").email({ message: 'Invalid email address' }),
    phoneNumber: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, "Invalid phone number"),
    companyName: companyNameValidation,
    locationAddress: z.string().max(30).nonempty("Location Address is required"),
    city: z.string().max(30).nonempty("City is required"),
    zip: z.string().max(30).nonempty("Zip/Postal address is required").regex(/^\d{5}(-\d{4})?$/, "Invalid postal address"),

});