import { Trim } from 'class-sanitizer';
import { IsOptional, IsString, MinLength } from 'class-validator';
export class RegistrationDTO {
	@IsString()
	@Trim()
	@MinLength(5, { message: 'FirstName should be minimum of 5 characters' })
	name: string;
	@IsEmail({}, { message: 'Provided Email is not valid' })
	@Trim()
	email: string;
	@IsString()
	@MinLength(8, { message: 'Password should be minimum of 8 characters' })
	password: string;
	@IsOptional()
	@IsString()
	userRole: string;
	@IsString()
	avatar: string;
}
