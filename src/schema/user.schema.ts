import { UtilsMain } from '@/utils';
import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
export enum IUserRole {
	STUDENT = 'STUDENT',
	TEACHER = 'TEACHER',
	ADMIN = 'ADMIN'
}
export interface IUserSchema {
	name: string;
	email: string;
	userRole: string;
	password: string;
	avatar: string;
	isVerified: boolean;
	courses: string[];
	comparePassword: (password: string) => Promise<boolean>;
}

export const UserSchema: Schema<IUserSchema> = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true
		},
		email: {
			type: String,
			required: true,
			validate: {
				validator: (val: string) => {
					return UtilsMain.validateEmail(val);
				}
			}
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
			select: false
		},
		avatar: {
			type: String
		},
		userRole: {
			type: String,
			default: IUserRole.STUDENT
		},
		isVerified: {
			type: Boolean,
			default: false
		},
		courses: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Courses'
			}
		]
	},
	{ timestamps: true }
);

UserSchema.pre('save', async function (next) {
	if (!this.isModified) next();
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});
UserSchema.methods = {
	authenticate: async function (password: string) {
		return await bcrypt.compare(password, this.password);
	}
};
const UserModel = model('User', UserSchema);
export default UserModel;
