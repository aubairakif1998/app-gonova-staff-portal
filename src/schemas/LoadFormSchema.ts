import { z } from 'zod';

const formSchema = z.object({
    pickupDate: z.string().nonempty("Pickup date is required"),
    dropOffDate: z.string().nonempty("Drop-off date is required"),
    pickupLocation: z.string().nonempty("Pickup location is required"),
    dropOffLocation: z.string().nonempty("Drop-off location is required"),
    shipmentRequirement: z.string().nonempty("Shipment requirement is required"),
    agentStaffMemberName: z.string().nonempty("Agent staff member name is required"),
    //supportedDocuments: z.string().nonempty("supportedDocuments is required"),
    supportedDocuments: z.array(z.instanceof(File)).min(1, "At least one supported document is required"),

    status: z.enum(["Upcoming", "InTransit", "Completed", "Cancelled"])
}); 