import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import { UtilsMain } from '../utils';
export enum IUserRole {
	STUDENT = 'STUDENT',
	TEACHER = 'TEACHER',
	ADMIN = 'ADMIN'
}
export interface TokenVerification {
	token: string;
	expiration: Date;
}
export interface IUserSchema {
	name: string;
	email: string;
	userRole: string;
	password: string;
	avatar: string;
	courses: string[];
	resetPasswordVerification?: TokenVerification;
	isEmailVerified: boolean;
	resetEmailVerification?: TokenVerification;
	emailVerication?: TokenVerification;
	isRegistered: boolean;
	enabled: boolean;

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
			minlength: 6
		},
		avatar: {
			type: String
		},
		userRole: {
			type: String,
			default: IUserRole.STUDENT
		},
		courses: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Courses'
			}
		],
		resetPasswordVerification: {
			type: {
				token: String,
				expiration: Date
			}
		},
		isEmailVerified: {
			type: Boolean,
			default: false
		},
		resetEmailVerification: {
			type: {
				token: String,
				expiration: Date
			}
		},
		emailVerication: {
			type: {
				token: String,
				expiration: Date
			}
		},
		isRegistered: {
			type: Boolean,
			default: false
		},
		enabled: {
			type: Boolean,
			default: false
		}
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
