import { IUserRole } from '@/schema/user.schema';
export interface IUserBody {
	_id: string;
	email: string;
	role: IUserRole;
}

export interface RequestWithUser extends Request {
	user: IUserBody;
	body: any;
}
