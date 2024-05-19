import multer from 'multer';
import express from 'express';
import { uploadImage } from '../controller/General/index'; // Assuming CreateUser is exported from the correct path
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', upload.single("image"), uploadImage)

export default router