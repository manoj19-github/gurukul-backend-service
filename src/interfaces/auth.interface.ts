import { IUserRole } from '../schema/user.schema';
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
export interface IUserBody {
	_id: string;
	email: string;
	role: IUserRole;
}

export interface RequestWithUser extends Request {
	user?: IUserBody;
	body: any;
	headers: any;
}

export interface AuthJWTPayload extends JwtPayload {
	expiration: Date;
	_id: string;
	email: string;
	role: IUserRole;
}
