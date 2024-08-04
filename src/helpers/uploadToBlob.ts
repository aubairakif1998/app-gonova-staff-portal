// utils/uploadToBlob.ts
export const uploadToBlob = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload-file-vercelblob', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to upload file');
    }

    const data = await response.json();
    return data.url; // Assuming the API returns a JSON object with the file URL
};
