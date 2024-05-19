import { Request, Response } from "express";
import { client } from "../../DB/index";
import { STATUS_CODE } from "../../utils/StatusCode";
import { UserScheme } from "../../validation/User";
import { CreateToken } from "../../utils/jwt";
import { CreateHash, VerfiyHash } from '../../utils/hashPassword'
import { OTPGenerator } from "../../utils/otpGenerater";
import { Nodemailer } from "../../Config/nodemailer";
interface UserPayload {
    email: string;
    name: string;
    password: string;
    phoneNumber: Number
}

interface LoginPayload {
    email: string;
    password: string;
}

var database = client.db(process.env.DB_Name);
var collection = database.collection("User");
const CreateUser = async (req: Request, res: Response) => {
    try {

        let Payload: UserPayload = req.body


        const { value, error } = UserScheme.validate(Payload);
        // Log value regardless of error
        // console.log("Validated data:", value);

        // If there's an error, handle it
        if (error) {
            return res.status(STATUS_CODE.badRequest).json({ error: error.details[0].message });
        }
        let newPassword = await CreateHash(Payload.password)
        Payload.password = newPassword


        const ExUser = await collection.findOne({ email: Payload.email });
        console.log(ExUser, "--------------------------");

        if (ExUser) {
            return res.status(STATUS_CODE.badRequest).send({
                message: "email already exists"
            });

        }
        const result = await collection.insertOne(Payload);
        const insertedDocument = await collection.findOne({ _id: result.insertedId });

        res.status(STATUS_CODE.created).send({
            message: "User Created Sucessfull",
            data: insertedDocument
        });
    } catch (error) {
        res.status(STATUS_CODE.badRequest).json(error);
    }
}


const UserLogin = async (req: Request, res: Response) => {
    try {

        let Payload: LoginPayload = req.body;

        const existingUser = await collection.findOne({ email: Payload.email });
        console.log(existingUser);

        if (!existingUser) {
            return res.status(STATUS_CODE.badRequest).send("Email not found");

        }
        let passwordCheck = await VerfiyHash(existingUser.password, Payload.password)

        if (!passwordCheck) {
            return res.status(STATUS_CODE.badRequest).send("Password is not valid");
        }

        delete existingUser.password
        let token = await CreateToken({
            data: existingUser
        })
        console.log(passwordCheck);
        res.status(STATUS_CODE.success).send(token);

    } catch (error) {
        res.status(STATUS_CODE.badRequest).json(error);

    }

}

const ResetPassword = async (req: Request, res: Response) => {
    try {

        let email = req.body.email;
        console.log(email);


        let User = await collection.findOne({
            email: email,
        })
        console.log(User);

        if (!User) {
            return res.status(STATUS_CODE.badRequest).send("Email not found");
        }
        const otp = await OTPGenerator()
        console.log(otp);

        console.log(otp);


        const mailOptions = {
            from: 'generateotp15@gmail.com', // sender address
            to: email, // list of receivers
            subject: 'Reset Your Password', // Subject line
            html: `  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
            <h2 style="color: #333;">Password Reset Request</h2>
            <p style="font-size: 16px; color: #555;">Hello,</p>
            <p style="font-size: 16px; color: #555;">We received a request to reset your password. Use the OTP below to reset it:</p>
            <p style="font-size: 24px; color: #2c3e50; font-weight: bold; text-align: center;">${otp}</p>
            <p style="font-size: 16px; color: #555;">This OTP is valid for the next 3 minutes. If you did not request a password reset, please ignore this email or contact our support team.</p>
            <p style="font-size: 16px; color: #555;">Thank you!</p>
            <p style="font-size: 16px; color: #555;">Best regards,<br>The Team</p>
        </div>`// plain text body
        };

        Nodemailer.sendMail(mailOptions, (err, info) => {
            if (err)
                return res.status(STATUS_CODE.badRequest).send(err);


            else
                return res.status(STATUS_CODE.success).send({ message: "OTP send to email", data: info });

        })


    } catch (error) {
        return res.status(STATUS_CODE.badRequest).send(error);

    }
}




export {
    CreateUser, UserLogin, ResetPassword
}