import express from 'express';
import { CreateUser, ResetPassword, UserLogin } from '../controller/User/index'; // Assuming CreateUser is exported from the correct path
const router = express.Router();

router.post("/CreateUser", CreateUser);
router.post("/UserLogin", UserLogin);
router.post("/resetPassword", ResetPassword);

export default router;
