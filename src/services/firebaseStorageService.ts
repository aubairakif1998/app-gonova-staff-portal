// <>
//             <h1 className="text-xl font-bold mb-4">Load Details</h1>
//             <div className="flex bg-gray-50  ">

//                 <div className="flex justify-start w-full max-w-md h-[10px] mb-4">
//                     <Button className="mr-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-100" onClick={handleRefresh} >Refresh Data</Button>
//                     <Button className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-100" onClick={() => setIsDialogOpen(true)}>View Audit History</Button>
//                     <AuditHistoryDialog
//                         open={isDialogOpen}
//                         onClose={() => setIsDialogOpen(false)}
//                         loadId={id}
//                     />
//                 </div>
//                 <div className="bg-white shadow-md rounded-md border border-gray-200 p-4">
//                     <div className="flex justify-between items-center mb-2">
//                         <h2 className="text-lg font-semibold">Status</h2>
//                         {selectedStatus && (
//                             <span
//                                 className={`px-2 py-1 rounded-full text-xs font-semibold ${selectedStatus === 'Completed' ? 'bg-green-500 text-white' :
//                                     selectedStatus === 'InTransit' ? 'bg-blue-500 text-white' :
//                                         selectedStatus === 'Cancelled' ? 'bg-red-500 text-white' :
//                                             selectedStatus === 'Upcoming' ? 'bg-gray-500 text-gray-100' :
//                                                 ''
//                                     }`}
//                             >
//                                 {selectedStatus}
//                             </span>
//                         )}
//                     </div>
//                     <select
//                         value={selectedStatus || ''}
//                         onChange={(e) => handleStatusChange(e.target.value)}
//                         disabled={!carrierData}
//                         className="p-2 border border-gray-300 rounded-md w-full"
//                     >
//                         <option value="">Select Status</option>
//                         {statusOptions.map((status) => (
//                             <option key={status} value={status}>{status}</option>
//                         ))}
//                     </select>
//                 </div>
//             </div>


//             <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
//                 <div className="bg-white shadow-md rounded-md border border-gray-200 p-4">
//                     <h2 className="text-lg font-semibold mb-2">Shipment Info</h2>
//                     <p><strong>Shippent Id:</strong> {shipmentData?.shipmentID}</p>
//                     <p><strong>Service Type:</strong> {shipmentData?.serviceType}</p>

//                 </div>

//                 <div className="bg-white shadow-md rounded-md border border-gray-200 p-4">
//                     <h2 className="text-lg font-semibold mb-2">Carrier Info</h2>
//                     {isCarrierEditing ? (
//                         <>
//                             {carrierLoadable.state === 'loading' && (
//                                 <div className="text-center">
//                                     <ClipLoader color="#000" loading={true} size={50} />
//                                 </div>
//                             )}
//                             {carrierLoadable.state === 'hasError' && (
//                                 <p className="text-red-500">Error loading carriers.</p>
//                             )}
//                             {carrierLoadable.state === 'hasValue' && (
//                                 <>
//                                     <CarrierDropdown carriers={carrierLoadable.contents} />
//                                     <div className="flex justify-end space-x-4 mt-4">
//                                         <Button variant="outline" onClick={() => setIsCarrierEditing(false)}>Cancel</Button>
//                                         <Button onClick={handleSaveCarrierEditing}>Save</Button>
//                                     </div>
//                                 </>
//                             )}
//                         </>
//                     ) : (
//                         <>
//                             {carrierData ? (
//                                 <>
//                                     <p><strong>Company Name:</strong> {carrierData.companyName}</p>
//                                     <p><strong>MC Number:</strong> {carrierData.transportMCNumber}</p>
//                                     <Button className="mt-2" onClick={handleCarrierEditing}>Edit Carrier</Button>
//                                 </>
//                             ) : (
//                                 <>
//                                     <p>No Carrier assigned yet</p>
//                                     <Button className="mt-2" onClick={handleCarrierEditing}>Assign Carrier</Button>
//                                 </>
//                             )}
//                         </>
//                     )}
//                 </div>





//                 {
//                     isPickDropEditing ? <>
//                         <div className="bg-white shadow-md rounded-md border border-gray-200 p-4">
//                             <Label>Pickup Location:</Label>
//                             <Input
//                                 type="text"
//                                 value={loadData?.pickupLocation || ''}
//                                 onChange={(e) => setLoadData(prev => ({ ...prev!, pickupLocation: e.target.value }))}
//                             />

//                             <Label>DropOff  Location:</Label>
//                             <Input
//                                 type="text"
//                                 value={loadData?.deliveryLocation || ''}
//                                 onChange={(e) => setLoadData(prev => ({ ...prev!, deliveryLocation: e.target.value }))}
//                             />
//                             <Label>Pickup Date:</Label>
//                             <Input
//                                 type="date"
//                                 value={loadData?.pickupDate || ''}
//                                 onChange={(e) => setLoadData(prev => ({ ...prev!, pickupDate: e.target.value }))}
//                             />
//                             <Label>DropOff Date:</Label>
//                             <Input
//                                 type="date"
//                                 value={loadData?.dropOffDate || ''}
//                                 onChange={(e) => setLoadData(prev => ({ ...prev!, dropOffDate: e.target.value }))}
//                             />

//                             <Button variant="outline" onClick={() => setIsPickDropEditing(false)}>Cancel</Button>
//                             <Button onClick={handleSavePickupDropOff}>Save</Button></div>
//                     </>
//                         : <div className="bg-white shadow-md rounded-md border border-gray-200 p-4">
//                             <h2 className="text-lg font-semibold mb-2">Pickup and DropOff Info</h2>
//                             <p><strong>Pickup Date:</strong> {loadData?.pickupDate ? formatDate(loadData.pickupDate) : 'N/A'}</p>
//                             <p><strong>Pickup Location:</strong> {loadData?.pickupLocation || 'N/A'}</p>
//                             <p><strong>DropOff Date:</strong> {loadData?.dropOffDate ? formatDate(loadData.dropOffDate) : 'N/A'}</p>
//                             <p><strong>DropOff Location:</strong> {loadData?.deliveryLocation || 'N/A'}</p>
//                             <Button className="mt-2" onClick={handlePickDropEditing}>Edit Info</Button>
//                         </div>

//                 }
//                 <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
//                     <FileUpload onChange={handleFileUpload} />

//                     {files.length > 0 && (
//                         <div className="mt-4">
//                             <Button
//                                 className="text-white px-4 py-2 rounded"
//                                 onClick={uploadFilesToFirebase}
//                             // disabled={uploading}
//                             >
//                                 {uploading ? "Uploading..." : `Upload Files For Load ${id}`}
//                             </Button>
//                         </div>
//                     )}

//                     {/* {uploadedUrls.length > 0 && (
//                     <div className="mt-4">
//                         <h3>Uploaded Files:</h3>
//                         <ul>
//                             {uploadedUrls.map((url, idx) => (
//                                 <li key={idx}>
//                                     <a href={url} target="_blank" rel="noopener noreferrer">
//                                         {url}
//                                     </a>
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>
//                 )} */}
//                 </div>

//                 <div className="md:col-span-2 bg-white shadow-md rounded-md border border-gray-200 p-4">
//                     <CommentSection />
//                 </div>
//             </div>

//         </>



import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebaseConfig";

// Upload a single file to a directory based on ID, and optionally a custom path
export const uploadFileToFirebase = async (file: File, id: string | string[], customPath: string): Promise<string> => {
    try {
        // Use either the customPath or default to `loadAssets/{id}/`
        const directoryPath = customPath;
        const fileRef = ref(storage, `${directoryPath}/${file.name}`);
        await uploadBytes(fileRef, file);
        const downloadURL = await getDownloadURL(fileRef);
        return downloadURL;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
};

// Upload multiple files to a directory based on ID, and optionally a custom path
export const uploadMultipleFilesToFirebase = async (files: File[], id: string | string[], customPath: string): Promise<string[]> => {
    const uploadedFileUrls: string[] = [];
    try {
        for (const file of files) {
            const url = await uploadFileToFirebase(file, id, customPath);
            uploadedFileUrls.push(url);
        }
        return uploadedFileUrls;
    } catch (error) {
        console.error("Error uploading multiple files:", error);
        throw error;
    }
};
