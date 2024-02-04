import { AuthToken, ITokenOptions } from '../interfaces/auth.interface';
import JWT from 'jsonwebtoken';
import { createTransport, SendMailOptions } from 'nodemailer';
import moment from 'moment';
import { Response } from 'express';
import { redis } from '../config/redis.config';
export class UtilsMain {
	static validateEmail(email: string) {
		// tslint:disable-next-line:max-line-length
		const expression: RegExp =
			/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
		return expression.test(email);
	}
	static async JWTSignup({ res, email, role, _id }: { res: Response; email: string; role: string; _id: any }): Promise<AuthToken> {
		const accessTokenExpiresIn: any = process.env.JWT_ACCESS_TOKEN_EXPIRES || '5d';
		const refreshTokenExpiresIn: any = process.env.JWT_REFRESH_TOKEN_EXPIRES || '365d';
		const accessToken = await JWT.sign({ email, role, _id }, process.env.JWT_SECRET!, { expiresIn: accessTokenExpiresIn });
		const refreshToken = await JWT.sign({ email, role, _id }, process.env.JWT_SECRET!, {
			expiresIn: refreshTokenExpiresIn
		});
		const accessTimeDays = String(accessTokenExpiresIn)
			.split('')
			.filter((self) => Number.isInteger(Number(self)))
			.join('');
		const refreshTimeDays = String(refreshTokenExpiresIn)
			.split('')
			.filter((self) => Number.isInteger(Number(self)))
			.join('');
		const accessTokenExpiresDate = new Date(moment().add(accessTimeDays, 'days').format('YYYY-MM-DD')).getTime();
		const refreshTokenExpiresDate = new Date(moment().add(refreshTimeDays, 'days').format('YYYY-MM-DD')).getTime();
		const accessTokenOptions: ITokenOptions = {
			expires: new Date(Date.now() + accessTokenExpiresDate + 2000),
			maxAge: accessTokenExpiresDate,
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production'
		};
		const refreshTokenOptions: ITokenOptions = {
			expires: new Date(Date.now() + refreshTokenExpiresDate + 2000),
			maxAge: refreshTokenExpiresDate,
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production'
		};
		res.cookie('access_token', accessToken, accessTokenOptions);
		res.cookie('refresh_token', refreshToken, refreshTokenOptions);
		// UPLOAD TOKEN TO REDIS
		redis.set(_id, JSON.stringify({ email, role }));
		return { accessToken, refreshToken };
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
