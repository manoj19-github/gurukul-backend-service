import UserModel from '@/schema/user.schema';
import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../exceptions/http.exceptions';

export class UserController {
	async registerController(req: Request, res: Response, next: NextFunction) {
		try {
			const { name, email, password, avatar, userRole } = req.body;
			const isEmailExists = await UserModel.findOne({ email });
			if (!!isEmailExists) throw new HttpException(400, 'Email already exists');
		} catch (error: any) {}
	}
}
