import { Shipper } from '@/Interfaces/Shipper';
import { z } from 'zod';
const MAX_UPLOAD_SIZE = 1024 * 1024 * 3; // 3MB

const StandAloneLoadFormDataSchema = z.object({
    shipper: z.string().nonempty("shipper company name is required"),
    serviceType: z.enum(["LTL", "Full Truckload", "Small Shipments"], {
        errorMap: () => ({ message: 'Service type is required' })
    }),
    pickupDate: z.string().nonempty("Pickup Date is required"),
    dropOffDate: z.string().nonempty("DropOff Date is required"),
    pickupLocationZip: z.string().max(30).nonempty("Pickup zip/postal code is required").regex(/^\d{5}(-\d{4})?$/, "Invalid zip/postal address"),
    pickupLocationCity: z.string().max(30).nonempty("Pickup City is required"),
    pickupLocationAddress: z.string().max(30).nonempty("Pickup Address is required"),
    deliveryLocationZip: z.string().max(30).nonempty("Delivery zip/postal code is required").regex(/^\d{5}(-\d{4})?$/, "Invalid zip/postal address"),
    deliveryLocationCity: z.string().max(30).nonempty("Delivery City is required"),
    deliveryLocationAddress: z.string().max(30).nonempty("Delivery Address is required"),
    loadContainAlcohol: z.enum(["true", "false"], {
        errorMap: () => ({ message: 'Shipment contain alcohol is required' })
    }),
    hazardousMaterial: z.enum(["true", "false"], {
        errorMap: () => ({ message: 'Shipment contain Hazardous Material is required' })
    }),
    itemDescription: z.string().nonempty("Item description is required"),
    packaging: z.enum(["Pallet", "Box", "Crate", "Bundle", "Drum", "Roll", "Bale"], {
        errorMap: () => ({ message: 'Packaging is required' })
    }),
    dimensions: z.object({
        length: z.number().nonnegative("Length must be a positive number").nullable(),
        width: z.number().nonnegative("Width must be a positive number").nullable(),
        height: z.number().nonnegative("Height must be a positive number").nullable(),
    }).refine(data => data.length !== null && data.width !== null && data.height !== null, {
        message: "All dimensions (Length, Width, Height) are required",
        path: ["dimensions"]
    }),
    weight: z.number().positive("Weight must be a positive number"),
    quantity: z.number().positive("Quantity must be a positive number"),
    carrier: z.string().optional(),
    supportedDocuments: z.array(z.instanceof(File).refine((file) => file.size <= MAX_UPLOAD_SIZE, 'File size must be less than 3MB')).optional(),
    shipmentRequirement: z.string().nonempty("Shipment requirement is required"),
});

export { StandAloneLoadFormDataSchema };
