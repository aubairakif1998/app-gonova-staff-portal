

interface Contact {
    email: string;
    phone: string;
    workingHours: string;
}
interface VehicleInformation {
    truckNumber: string;
    driverName: string;
    driverContactNo: string;
}
export interface Carrier {
    _id: string;
    companyName: string;
    transportMCNumber: string;
    dot: string;
    contacts: {
        primary: Contact;
        secondary: Contact;
    };
    address: string;
    vehicleInformation: VehicleInformation;
    assignedLoads: string[];
}