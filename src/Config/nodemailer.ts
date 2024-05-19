import nodemailer from 'nodemailer';



export const Nodemailer = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'generateotp15@gmail.com',
        pass: 'jcujacggepnyaqhk'
    }
});