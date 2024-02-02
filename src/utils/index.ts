import { IUserRole } from '@/schema/user.schema';
import JWT from 'jsonwebtoken';
import { ObjectId } from 'mongoose';
export class UtilsMain {
	static validateEmail(email: string) {
		// tslint:disable-next-line:max-line-length
		const expression: RegExp =
			/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
		return expression.test(email);
	}
	static async JWTSignup({ email, role, _id }: { email: string; role: IUserRole; _id: ObjectId }): Promise<string> {
		return await JWT.sign({ email, role, _id }, process.env.JWT_SECRET!);
	}
}
