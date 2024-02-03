import UserModel, { IUserRole, IUserSchema } from '@/schema/user.schema';
import { UtilsMain } from '@/utils';
import { SendMailOptions } from 'nodemailer';
import { HttpException } from '../exceptions/http.exceptions';

export class UserService {
	/***
	 * Register service of user
	 * @param {string} usertype
	 * @returns
	 * @memberof UserService
	 **/
	static async registerService(name: string, email: string, password: string, avatar: string, userRole: IUserRole): Promise<IUserSchema> {
		const isEmailExists = await UserModel.findOne({ email });
		//  email duplication check
		if (!!isEmailExists) throw new HttpException(400, 'Email already exists');
		const newRegistrationUser = await UserModel.create({ name, email, password, avatar, userRole, isRegistered: true });
		const mailOptions: SendMailOptions = {
			from: process.env.EMAIL_USERNAME!,
			to: email,
			subject: `Welcome To Gurukul`,
			html: `
      
              <h1 style="text-align:center">GuruKul</h1><br/>
              <p style="text-align:center"> <small>Your Future, Our Commitment</small></p>
              <p></p>
              <p style="text-align:center">Hi ${name}, Welcome to Gurukul<br/><small> Your login Email : ${email} and password is :  ${password}</small></p>
      `
		};
		UtilsMain.sendMailMethod(mailOptions).catch(() => {
			throw new HttpException(500, 'User successfully registered but confirmation email not sent');
		});
		return newRegistrationUser;
	}
}
