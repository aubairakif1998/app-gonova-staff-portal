// pages/api/upload.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { file } = req.body;
        // Perform the upload to Vercel Blob here
        // You will need to use a Vercel Blob API or a third-party service like AWS S3

        // Example:
        // const fileUrl = await uploadFileToBlob(file);

        // Return the URL of the uploaded file
        res.status(200).json({ url: 'fileUrl' });
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
