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
	async loginController(req: Request, res: Response, next: NextFunction) {
		try {
			const { email, password, userRole } = req.body;
			const loggedInDetails = await UserService.loginService(email, password, userRole);
			return res.status(200).json({
				message: 'User Successfully logged in',
				data: loggedInDetails
			});
		} catch (error: any) {
			next(error);
		}
	}
	async forgotPassword(req: Request, res: Response, next: NextFunction) {
		try {
			const { email, userRole } = req.body;
			const forgotPasswordRes = await UserService.forgotPasswordService(email, userRole);
			if (forgotPasswordRes) {
				return res.status(200).json({ message: 'password reset request code sent to your registered email' });
			}
			return res.status(500).json({ message: 'something went wrong your request failed' });
		} catch (error: any) {
			next(error);
		}
	}
	async resetPassword(req: Request, res: Response, next: NextFunction) {
		try {
			const { email, password, code, userRole } = req.body;
			if (await UserService.resetPassword(email, code, password, userRole)) {
				return res.status(200).json({ message: 'your password reset successfull' });
			}
			return res.status(500).json({ message: 'something went wrong your request failed' });
		} catch (error: any) {
			next(error);
		}
	}
	async changeEmailRequest(req: Request, res: Response, next: NextFunction) {
		try {
			const { email, userRole } = req.body;
			if (await UserService.changeEmailRequestService(email, userRole)) {
				return res.status(200).json({ message: 'your email change request sent successfull' });
			}
			return res.status(500).json({ message: 'something went wrong your request failed' });
		} catch (error: any) {
			next(error);
		}
	}
	async resetEmailOfUser(req: Request, res: Response, next: NextFunction) {
		try {
			const { oldEmail, newEmail, userRole, code } = req.body;
			if (await UserService.resetEmailRequest(oldEmail, code, newEmail, userRole)) {
				return res.status(200).json({ message: 'your email changed successfully' });
			}
			return res.status(500).json({ message: 'something went wrong your request failed' });
		} catch (error: any) {
			next(error);
		}
	}
}
