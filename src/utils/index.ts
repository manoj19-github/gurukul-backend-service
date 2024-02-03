import JWT from 'jsonwebtoken';
import { createTransport, SendMailOptions } from 'nodemailer';
export class UtilsMain {
	static validateEmail(email: string) {
		// tslint:disable-next-line:max-line-length
		const expression: RegExp =
			/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
		return expression.test(email);
	}
	static async JWTSignup({ email, role, _id }: { email: string; role: string; _id: any }): Promise<string> {
		const expiresIn: any = process.env.JWT_EXPIRES;
		const expiration = new Date();
		expiration.setTime(expiration.getTime() + expiresIn * 1000);
		return await JWT.sign({ email, role, _id, expiration }, process.env.JWT_SECRET!);
	}

	static async sendMailMethod(mailOptions: SendMailOptions): Promise<boolean> {
		const transporter = createTransport({
			//@ts-ignore
			host: 'smtp.gmail.com',
			secureConnection: false, // TLS requires secureConnection to be false
			port: 465,
			secure: true,
			auth: {
				user: process.env.EMAIL_USERNAME,
				pass: process.env.EMAIL_PASSWORD
			},
			tls: {
				rejectUnAuthorized: true
			}
		});
		return new Promise((resolve, reject) => {
			transporter.sendMail(mailOptions, (error, _) => {
				console.log('error: ', error);
				if (error) return reject(false);
				return resolve(true);
			});
		});
	}
}
