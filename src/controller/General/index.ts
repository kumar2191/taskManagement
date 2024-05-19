import { Request, Response } from 'express';
import cloudinary from '../../Config/cloudinary';
import { STATUS_CODE } from '../../utils/StatusCode';

const uploadImage = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log('File:', req.file);

        if (!req.file) {
            res.status(STATUS_CODE.badRequest).send('No file uploaded.');
            return;
        }

        const stream = cloudinary.uploader.upload_stream((error, result) => {
            if (error) {
                console.error('Upload Error:', error);
                res.status(STATUS_CODE.badRequest).send(error);
                return;
            }

            console.log('Upload Result:', result);

            if (!result) {
                res.status(STATUS_CODE.badRequest).send('Empty response from Cloudinary.');
                return;
            }

            res.status(STATUS_CODE.success).json(result);
        });

        stream.end(req.file.buffer);

    } catch (error) {
        console.error('Catch Error:', error);
        res.status(STATUS_CODE.badRequest).send(error);
    }
}

export { uploadImage };
