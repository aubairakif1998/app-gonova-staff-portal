import { z } from 'zod';
const ShipmentFormDataSchema = z.object({
    serviceType: z.enum(["LTL", "Full Truckload", "Small Shipments"], {
        errorMap: () => ({ message: 'Service type is required' })
    }),
    // truckloadType: z.enum(["Dry Van", "FlatBed", "Temperature Controlled"]).optional(),
    // traps: z.enum(["No Trap", "4ft", "6ft", "8ft"]).optional(),
    // minTemp: z.number().optional(),
    // maxTemp: z.number().optional(),
    requestingLoadingDate: z.string().nonempty("Requesting loading date is required"),
    arrivalDate: z.string().nonempty("Arrival date is required"),
    pickupLocationZip: z.string().max(30).nonempty("Pickup zip/postal code is required").regex(/^\d{5}(-\d{4})?$/, "Invalid zip/postal address"),
    pickupLocationState: z.string().max(30).nonempty("Pickup State is required"),
    pickupLocationCity: z.string().max(30).nonempty("Pickup City is required"),
    pickupLocationStreet: z.string().max(30).nonempty("Pickup Street is required"),

    deliveryLocationZip: z.string().max(30).nonempty("Delivery zip/postal code is required").regex(/^\d{5}(-\d{4})?$/, "Invalid zip/postal address"),
    deliveryLocationState: z.string().max(30).nonempty("Delivery State is required"),
    deliveryLocationCity: z.string().max(30).nonempty("Delivery City is required"),
    deliveryLocationStreet: z.string().max(30).nonempty("Delivery Street is required"),

    shipmentContainAlcohol: z.enum(["true", "false"], {
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
});

export { ShipmentFormDataSchema };
