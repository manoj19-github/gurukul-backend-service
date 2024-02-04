import { Trim } from 'class-sanitizer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
export class LoginDTO {
	@IsEmail({}, { message: 'Provided Email is not valid' })
	@IsNotEmpty()
	@Trim()
	email: string | undefined;
	@IsString()
	@IsNotEmpty()
	@MinLength(8, { message: 'Password should be minimum of 8 characters' })
	password: string | undefined;
	@IsOptional()
	@IsString()
	userRole: string | undefined;
}

export class RegistrationDTO {
	@IsString()
	@Trim()
	@IsNotEmpty()
	@MinLength(5, { message: 'FirstName should be minimum of 5 characters' })
	name: string | undefined;
	@IsEmail({}, { message: 'Provided Email is not valid' })
	@IsNotEmpty()
	@Trim()
	email: string | undefined;
	@IsString()
	@IsNotEmpty()
	@MinLength(8, { message: 'Password should be minimum of 8 characters' })
	password: string | undefined;
	@IsOptional()
	@IsString()
	userRole: string | undefined;
	@IsString()
	@IsNotEmpty()
	avatar: string | undefined;
}

export class ForgotPasswordDTO {
	@IsEmail({}, { message: 'Provided Email is not valid' })
	@IsNotEmpty()
	@Trim()
	email: string | undefined;
	@IsOptional()
	@IsString()
	userRole: string | undefined;
}

export class ResetPasswordDTO {
	@IsEmail({}, { message: 'Provided Email is not valid' })
	@IsNotEmpty()
	@Trim()
	email: string | undefined;
	@IsString()
	@IsNotEmpty()
	@MinLength(8, { message: 'Password should be minimum of 8 characters' })
	password: string | undefined;
	@IsString()
	@IsNotEmpty()
	code: string | undefined;
	@IsOptional()
	@IsString()
	userRole: string | undefined;
}

export class ChangeEmailRequestDTO {
	@IsEmail({}, { message: 'Provided Email is not valid' })
	@IsNotEmpty()
	@Trim()
	email: string | undefined;
	@IsOptional()
	@IsString()
	userRole: string | undefined;
}

export class ValidateEmailDTO {
	@IsEmail({}, { message: 'Provided Email is not valid' })
	@IsNotEmpty()
	@Trim()
	email: string | undefined;
	@IsOptional()
	@IsString()
	userRole: string | undefined;
	@IsString()
	@IsNotEmpty()
	code: string | undefined;
}

export class ResetEmailDTO {
	@IsEmail({}, { message: 'Provided Email is not valid' })
	@IsNotEmpty()
	@Trim()
	oldEmail: string | undefined;
	@IsEmail({}, { message: 'Provided Email is not valid' })
	@IsNotEmpty()
	@Trim()
	newEmail: string | undefined;
	@IsOptional()
	@IsString()
	userRole: string | undefined;
	@IsString()
	@IsNotEmpty()
	code: string | undefined;
}

