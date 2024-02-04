import { AuthJWTPayload, IUserBody, RequestWithUser } from '../../interfaces/auth.interface';
import UserModel, { IUserRole } from '../../schema/user.schema';
import { NextFunction, Response } from 'express';
import JWT from 'jsonwebtoken';
const AuthMiddleware = (userRole?: IUserRole | IUserRole[]) => async (req: RequestWithUser, res: Response, next: NextFunction) => {
	if (
		!!req.cookies.access_token ||
		(req.headers.authorization && req.headers.authorization.startsWith('Bearer') && req.headers.authorization.split(' ').length > 1)
	) {
		try {
			const userToken = req.cookies.access_token || req.headers.authorization.split(' ')[1];
			if (userToken) {
				const decoded = JWT.verify(userToken, process.env.JWT_SECRET!) as AuthJWTPayload;
				if (!decoded)
					return res.status(403).json({
						message: 'access token is not valid '
					});

				// authorization check
				if (
					(!!userRole && !Array.isArray(userRole) && userRole !== decoded.role) ||
					(!!userRole && Array.isArray(userRole) && !userRole.includes(decoded.role))
				)
					return res.status(403).json({
						message: 'Authrization Error occured for this user'
					});
				req.user = (await UserModel.findById(decoded._id).select('-password')) as unknown as IUserBody;
				next();
			} else {
				return res.status(403).json({
					message: 'Please login and try again'
				});
			}
		} catch (err) {
			console.log(`signin jsonwebtoken error :`, err);
			return res.status(500).json({
				message: 'internal server error'
			});
		}
	} else {
		return res.status(403).json({
			message: 'Authentication error occured'
		});
	}
};

export default AuthMiddleware;
