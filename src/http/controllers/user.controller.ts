import { NextFunction, Request, Response } from 'express';
import { UserService } from '../services/user.service';

export class UserController {
	async registerController(req: Request, res: Response, next: NextFunction) {
		try {
			const { name, email, password, avatar, userRole } = req.body;
			const newUser = await UserService.registerService(name, email, password, avatar, userRole);
			return res.status(200).json({
				message: 'User Successfully Registered',
				user: newUser
			});
		} catch (error: any) {
			next(error);
		}
	}
}
