import { z } from 'zod';

// Error messages
const requiredMessage = 'This field is required';
const emailMessage = 'Invalid email address';
const phoneMessage = 'Invalid phone number. It must be a US phone number';
const uniqueMessage = 'This field must be unique';

const ContactSchema = z.object({
    email: z.string().email(emailMessage).nonempty({ message: requiredMessage }),
    phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, phoneMessage),
    workingHours: z.string().min(5, { message: requiredMessage }), // Assuming this represents a time range
});


const VehicleInformationSchema = z.object({
    truckNumber: z.string().min(1, { message: requiredMessage }),
    driverName: z.string().min(1, { message: requiredMessage }),
    driverContactNo: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, phoneMessage),
});

export const CarrierSchema = z.object({
    companyName: z.string().min(1, { message: requiredMessage }).refine(async (val) => {
        const isUnique = await checkUniqueCompanyName(val); // Replace with actual uniqueness check
        return isUnique;
    }, { message: uniqueMessage }),
    transportMCNumber: z.string().min(1, { message: requiredMessage }),
    dot: z.string().min(1, { message: requiredMessage }).refine(async (val) => {
        const isUnique = await checkUniqueDOT(val); // Replace with actual uniqueness check
        return isUnique;
    }, { message: uniqueMessage }),
    contacts: z.object({
        primary: ContactSchema,
        secondary: ContactSchema,
    }),
    addressZip: z.string().max(30).nonempty("Zip is required").regex(/^\d{5}(-\d{4})?$/, "Zip/postal address"),
    addressStreet: z.string().max(30).nonempty("Location Address is required"),
    addressCity: z.string().max(30).nonempty("City is required"),
    vehicleInformation: VehicleInformationSchema,
    assignedLoads: z.array(z.string().uuid()).optional(),
    supportedDocuments: z.array(z.string().url()).optional(), // List of document URLs
});

// Mock uniqueness check functions
async function checkUniqueCompanyName(companyName: string): Promise<boolean> {
    // Implement your actual database check here
    return true; // Assume it's unique for now
}

async function checkUniqueDOT(dot: string): Promise<boolean> {
    // Implement your actual database check here
    return true; // Assume it's unique for now
}
