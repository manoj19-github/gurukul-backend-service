import { AuthJWTPayload, IUserBody, RequestWithUser } from '@/interfaces/auth.interface';
import UserModel, { IUserRole } from '@/schema/user.schema';
import { NextFunction, Response } from 'express';
import JWT from 'jsonwebtoken';
const AuthMiddleware = (userRole: IUserRole[]) => async (req: RequestWithUser, res: Response, next: NextFunction) => {
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		try {
			const userToken = req.headers.authorization.split(' ')[1];
			if (userToken) {
				const decoded = JWT.verify(userToken, process.env.JWT_SECRET!) as AuthJWTPayload;
				// token expiration check
				if (new Date().getTime() > new Date(decoded.expiration).getTime())
					return res.status(403).json({
						status: false,
						message: 'Token expired'
					});

				// authorization check
				if (userRole.includes(decoded.role))
					return res.status(403).json({
						status: false,
						message: 'Authrization Error occured'
					});
				req.user = (await UserModel.findById(decoded._id).select('-password')) as unknown as IUserBody;
				next();
			} else {
				return res.status(403).json({
					status: false,
					message: 'Please login and try again'
				});
			}
		} catch (err) {
			console.log(`signin jsonwebtoken error :`);
			return res.status(500).json({
				status: false,
				message: 'internal server error'
			});
		}
	} else {
		return res.status(500).json({
			status: false,
			message: 'Authentication error occured'
		});
	}
};

export default AuthMiddleware;
