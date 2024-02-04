import { NextFunction, Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { redis } from '../../config/redis.config';
import { RequestWithUser } from '../../interfaces/auth.interface';
import { HttpException } from '../exceptions/http.exceptions';
import UserModel from '../../schema/user.schema';

export class UserController {
	async registerController(req: Request, res: Response, next: NextFunction) {
		// const session = await UserModel.startSession();
		// session.startTransaction();
		try {
			// const opts = { session };
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
			const loggedInDetails = await UserService.loginService(email, password, userRole, res);
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
			if (await UserService.forgotPasswordService(email, userRole))
				return res.status(200).json({ message: 'password reset request code sent to your registered email' });
			return res.status(500).json({ message: 'something went wrong your request failed' });
		} catch (error: any) {
			next(error);
		}
	}
	async resetPassword(req: Request, res: Response, next: NextFunction) {
		try {
			const { email, password, code, userRole } = req.body;
			if (await UserService.resetPassword(email, code, password, userRole))
				return res.status(200).json({ message: 'your password reset successfull' });
			return res.status(500).json({ message: 'something went wrong your request failed' });
		} catch (error: any) {
			next(error);
		}
	}
	async changeEmailRequest(req: Request, res: Response, next: NextFunction) {
		try {
			const { email, userRole } = req.body;
			if (await UserService.changeEmailRequestService(email, userRole))
				return res.status(200).json({ message: 'your email change request sent successfull' });
			return res.status(500).json({ message: 'something went wrong your request failed' });
		} catch (error: any) {
			next(error);
		}
	}
	async resetEmailOfUser(req: Request, res: Response, next: NextFunction) {
		try {
			const { oldEmail, newEmail, userRole, code } = req.body;
			if (await UserService.resetEmailRequest(oldEmail, code, newEmail, userRole))
				return res.status(200).json({ message: 'your email changed successfully' });
			return res.status(500).json({ message: 'something went wrong your request failed' });
		} catch (error: any) {
			next(error);
		}
	}
	async validateMyEmailRequest(req: Request, res: Response, next: NextFunction) {
		try {
			const { email, userRole } = req.body;
			if (await UserService.validateEmailRequestService(email, userRole))
				return res.status(200).json({ message: 'your email verification mail sent successfully' });
			return res.status(500).json({ message: 'something went wrong your request failed' });
		} catch (error: any) {
			next(error);
		}
	}
	async validateEmail(req: Request, res: Response, next: NextFunction) {
		try {
			const { email, userRole, code } = req.body;
			if (await UserService.validateEmailService(email, userRole, code))
				return res.status(200).json({ message: 'your email verified successfully' });
			return res.status(500).json({ message: 'something went wrong your request failed' });
		} catch (error: any) {
			next(error);
		}
	}
	async logoutUser(req: RequestWithUser, res: Response, next: NextFunction) {
		try {
			res.cookie('access_token', '', { maxAge: 1 });
			res.cookie('refresh_token', '', { maxAge: 1 });
			const userId = req.user?._id || '';
			await redis.del(userId);
			return res.status(200).json({
				message: 'Logout successfully'
			});
		} catch (error: any) {
			next(error);
		}
	}
	async updateAccessToken(req: Request, res: Response, next: NextFunction) {
		try {
			const refreshToken = req.cookies?.refresh_token;
			if (!refreshToken) throw new HttpException(400, 'refresh token not found');
			const authTokenBody = await UserService.updateAccessTokenService(refreshToken, res);
			const loggedInUserBody = await UserModel.findById(authTokenBody.userId).select('-password');
			return res
				.status(200)
				.json({ token: { accessToken: authTokenBody.accessToken, refreshToken: authTokenBody.refreshToken }, user: loggedInUserBody });
		} catch (error: any) {
			console.log(error);
			next(error);
		}
	}
	async getUserByToken(req: RequestWithUser, res: Response, next: NextFunction) {
		try {
			const userId = req.user?._id;
			if (!userId) throw new HttpException(400, 'please login and try again');
			const userDetails = await UserService.getUserByTokenService(userId);
			if (!userDetails) throw new HttpException(400, 'user details not found');
			return res.status(200).json({ userDetails });
		} catch (error: any) {
			console.log(error);
			next(error);
		}
	}
	async socialLoginUser(req: RequestWithUser, res: Response, next: NextFunction) {
		// const session = await UserModel.startSession();
		// session.startTransaction();
		try {
			// const opts = { session };
			const { name, email, password, avatar, userRole } = req.body;
			const loginResponse = await UserService.socialLoginService(name, email, password, avatar, userRole, res);
			// await session.commitTransaction();
			// await session.endSession();
			return res.status(200).json({ ...loginResponse });
		} catch (error: any) {
			console.log('error : ', error);
			// await session.abortTransaction();
			// await session.endSession();
			next(error);
		}
	}
}
