import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { SendMailOptions } from 'nodemailer';
import UserModel, { IUserRole, IUserSchema } from '../../schema/user.schema';
import { UtilsMain } from '../../utils';
import { HttpException } from '../exceptions/http.exceptions';
export class UserService {
	/***
	 * Register service of user
	 * @param {string} usertype
	 * @returns
	 * @memberof UserService
	 **/

	static async registerService(name: string, email: string, password: string, avatar: string, userRole: IUserRole): Promise<IUserSchema> {
		const isEmailExists = await UserModel.findOne({ email, userRole });
		//  email duplication check
		if (!!isEmailExists) throw new HttpException(400, 'Email already exists');
		const newRegistrationUser = await UserModel.create({ name, email, password, avatar, userRole, isRegistered: true });
		const mailOptions: SendMailOptions = {
			from: process.env.EMAIL_USERNAME!,
			to: email,
			subject: `Welcome To Gurukul`,
			html: `

              <h1 style="text-align:center">GuruKul</h1>
              <p style="text-align:center"> <small>Your Future, Our Commitment</small></p>
              <p></p>
              <p></p>
              <p></p>
              <p style="text-align:justify">Hi ${name}, Welcome to Gurukul
              </p>
              <p style="text-align:justify">Your login Email : ${email}</p>
              <p style="text-align:justify"> Your password is :  ${password}</p>
      `
		};
		try {
			await UtilsMain.sendMailMethod(mailOptions);
		} catch (error) {
			console.log('error : ', error);
		}
		return newRegistrationUser;
	}

	/***
	 * Login service of user
	 * @param {string} email
	 * @param {string} password
	 * @param {string} userRole
	 * @memberof UserService
	 **/
	static async loginService(email: string, password: string, userRole: string) {
		const isUserExists = await UserModel.findOne({ email, userRole });
		if (!isUserExists) throw new HttpException(400, 'Email not exists');
		const passwordValid = await bcrypt.compare(password, isUserExists.password);
		if (!!passwordValid) {
			const userToken = await UtilsMain.JWTSignup({ email: isUserExists.email, role: isUserExists.userRole, _id: isUserExists._id });
			console.log('userToken: ', userToken);
			let userDetails: any = JSON.parse(JSON.stringify(isUserExists));
			delete userDetails.password;

			return { token: userToken, user: userDetails };
		} else throw new HttpException(400, 'password not valid');
	}
	/***
	 * forgot password service
	 * @param {string} email
	 * @param {string} password
	 * @param {string} userRole
	 * @memberof UserService
	 **/
	static async forgotPasswordService(email: string, userRole: string): Promise<boolean> {
		const isUserExists = await UserModel.findOne({ email, userRole });
		if (!isUserExists) throw new HttpException(400, 'user not  exists');
		const expiresIn: any = process.env.JWT_EXPIRES;
		const expiration = new Date();
		expiration.setTime(expiration.getTime() + expiresIn * 1000);
		const token = randomBytes(3).toString('hex');
		const mailOptions: SendMailOptions = {
			from: process.env.EMAIL_USERNAME!,
			to: email,
			subject: `Welcome To Gurukul`,
			html: `

              <h1 style="text-align:center">GuruKul</h1>
              <p style="text-align:center"> <small>Your Future, Our Commitment</small></p>
              <p></p>
              <p></p>
              <p></p>
              <p style="text-align:center">${isUserExists.name}, Replace your password with this : ${token} <br/><small> please note this token is invalid after 24 hours of generate</small> </p>
      `
		};
		return new Promise((resolve, reject) => {
			return UtilsMain.sendMailMethod(mailOptions)
				.then((res) => {
					UserModel.updateOne({ _id: isUserExists._id }, { $set: { resetPasswordVerification: { token, expiration } } })
						.then(() => resolve(true))
						.catch(() => reject(false));
				})
				.catch(() => reject(false));
		});
	}
	/***
	 * reset password service
	 * @param {string} email
	 * @param {string} code
	 * @param {string} password
	 * @param {string} userRole
	 * @memberof UserService
	 **/
	static async resetPassword(email: string, code: string, password: string, userRole: string): Promise<boolean> {
		const userDetails = await UserModel.findOne({ email, userRole });
		if (!!userDetails && userDetails?.resetPasswordVerification && userDetails.enabled !== false) {
			if (new Date().getTime() > new Date(userDetails.resetPasswordVerification.expiration).getTime())
				throw new HttpException(400, 'token expired');
			if (userDetails.resetPasswordVerification.token === code) {
				await UserModel.updateOne({ _id: userDetails._id }, { $set: { password, resetPasswordVerification: undefined } });
				return true;
			} else throw new HttpException(400, 'invalid token');
		}
		return false;
	}
	/***
	 * change email request service
	 * @param {string} email
	 * @param {string} userRole
	 * @memberof UserService
	 **/
	static async changeEmailRequestService(email: string, userRole: string): Promise<boolean> {
		const isUserExists = await UserModel.findOne({ email, userRole });
		if (!isUserExists) throw new HttpException(400, 'user not  exists');
		const expiresIn: any = process.env.JWT_EXPIRES;
		const expiration = new Date();
		expiration.setTime(expiration.getTime() + expiresIn * 1000);
		const token = randomBytes(3).toString('hex');
		const mailOptions: SendMailOptions = {
			from: process.env.EMAIL_USERNAME!,
			to: email,
			subject: `Change Email Request`,
			html: `

              <h1 style="text-align:center">GuruKul</h1>
              <p style="text-align:center"> <small>Your Future, Our Commitment</small></p>
              <p></p>
              <p></p>
              <p></p>
              <p style="text-align:center">${isUserExists.name}, Replace your password with this : ${token} <br/><small> please note this token is invalid after 24 hours of generate</small> </p>
      `
		};
		return new Promise((resolve, reject) => {
			return UtilsMain.sendMailMethod(mailOptions)
				.then((res) => {
					UserModel.updateOne({ _id: isUserExists._id }, { $set: { resetEmailVerification: { token, expiration } } })
						.then(() => resolve(true))
						.catch(() => reject(false));
				})
				.catch(() => reject(false));
		});
	}
	/***
	 * reset email service
	 * @param {string} email
	 * @param {string} userRole
	 * @returns {Promise<boolean>}
	 * @memberof UserService
	 **/
	static async resetEmailRequest(oldEmail: string, code: string, newEmail: string, userRole: string): Promise<boolean> {
		const userDetails = await UserModel.findOne({ email: oldEmail, userRole });
		if (!!userDetails && userDetails?.resetEmailVerification && userDetails.enabled !== false) {
			if (new Date().getTime() > new Date(userDetails.resetEmailVerification.expiration).getTime())
				throw new HttpException(400, 'token expired');
			if (userDetails.resetEmailVerification.token === code) {
				await UserModel.updateOne({ _id: userDetails._id }, { $set: { email: newEmail, resetEmailVerification: undefined } });
				return true;
			} else throw new HttpException(400, 'invalid token');
		}
		return false;
	}
	/***
	 * validate  email request service
	 * @param {string} email
	 * @param {string} userRole
	 * @returns {Promise<boolean>}
	 * @memberof UserService
	 **/
	static async validateEmailRequestService(email: string, userRole: string): Promise<boolean> {
		const token = randomBytes(3).toString('hex');
		const isUserExists = await UserModel.findOne({ email, userRole }).select('-password');
		if (!isUserExists) throw new HttpException(400, 'Email is not found');
		const expiresIn: any = process.env.JWT_EXPIRES;
		const expiration = new Date();
		expiration.setTime(expiration.getTime() + expiresIn * 1000);
		const mailOptions: SendMailOptions = {
			from: process.env.EMAIL_USERNAME!,
			to: email,
			subject: `Validate Email Request`,
			html: `

              <h1 style="text-align:center">GuruKul</h1>
              <p style="text-align:center"> <small>Your Future, Our Commitment</small></p>
              <p></p>
              <p></p>
              <p></p>
              <p style="text-align:center">${isUserExists.name}, Validate your password with this : ${token} <br/><small> please note this token is invalid after 24 hours of generate</small> </p>
      `
		};
		return new Promise((resolve, reject) => {
			return UtilsMain.sendMailMethod(mailOptions)
				.then((res) => {
					UserModel.updateOne({ _id: isUserExists._id }, { $set: { emailVerication: { token, expiration } } })
						.then(() => resolve(true))
						.catch(() => reject(false));
				})
				.catch(() => reject(false));
		});
	}

	/***
	 * validate email service
	 * @param {string} email
	 * @param {string} userRole
	 * @param {string} code
	 * @returns {Promise<boolean>}
	 * @memberof UserService
	 **/
	static async validateEmailService(email: string, userRole: string, code: string): Promise<boolean> {
		const isUserExists = await UserModel.findOne({ email, userRole }).select('-password');
		if (!isUserExists) throw new HttpException(400, 'Email is not found');
		if (!!isUserExists && isUserExists?.emailVerication && isUserExists.enabled !== false) {
			if (new Date().getTime() > new Date(isUserExists.emailVerication.expiration).getTime()) throw new HttpException(400, 'token expired');
			if (isUserExists.emailVerication.token === code) {
				await UserModel.updateOne({ _id: isUserExists._id }, { $set: { emailVerication: undefined, isEmailVerified: true } });
				return true;
			} else throw new HttpException(400, 'invalid token');
		}
		return false;
	}
}
