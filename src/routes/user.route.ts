import {
	ChangeEmailRequestDTO,
	ForgotPasswordDTO,
	LoginDTO,
	RegistrationDTO,
	ResetEmailDTO,
	ResetPasswordDTO,
	UpdateUserProfileDTO,
	ValidateEmailDTO
} from '../http/dtos/user.dto';
import { Router } from 'express';
import { UserController } from '../http/controllers/user.controller';
import DTOValidationMiddleware from '../http/middlewares/apiValidator.middleware';
import { Routes } from '../interfaces/routes.interface';
import AuthMiddleware from '../http/middlewares/auth.middleware';

export class UserRoute implements Routes {
	path?: string | undefined;
	router: Router;
	userCTRL = new UserController();
	constructor() {
		this.router = Router();
		this.path = `/auth`;
		this.initializeRoutes();
	}
	private initializeRoutes(): void {
		this.router.post(`${this.path}/registration`, DTOValidationMiddleware(RegistrationDTO), this.userCTRL.registerController);
		this.router.post(`${this.path}/sociallogin`, DTOValidationMiddleware(RegistrationDTO), this.userCTRL.socialLoginUser);
		this.router.post(`${this.path}/login`, DTOValidationMiddleware(LoginDTO), this.userCTRL.loginController);
		this.router.post(`${this.path}/forgotpassword`, DTOValidationMiddleware(ForgotPasswordDTO), this.userCTRL.forgotPassword);
		this.router.post(`${this.path}/resetpassword`, DTOValidationMiddleware(ResetPasswordDTO), this.userCTRL.resetPassword);
		this.router.post(`${this.path}/changeemailrequest`, DTOValidationMiddleware(ChangeEmailRequestDTO), this.userCTRL.changeEmailRequest);
		this.router.post(`${this.path}/resetemail`, DTOValidationMiddleware(ResetEmailDTO), this.userCTRL.resetEmailOfUser);
		this.router.post(
			`${this.path}/validateemailrequest`,
			DTOValidationMiddleware(ChangeEmailRequestDTO),
			this.userCTRL.validateMyEmailRequest
		);
		this.router.post(
			`${this.path}/validateemail`,
			AuthMiddleware(),
			DTOValidationMiddleware(ValidateEmailDTO),
			this.userCTRL.validateEmail
		);
		this.router.post(
			`${this.path}/updateuserprofile`,
			AuthMiddleware(),
			DTOValidationMiddleware(UpdateUserProfileDTO),
			this.userCTRL.updateUserProfile
		);
		this.router.get(`${this.path}/logout`, AuthMiddleware(), this.userCTRL.logoutUser);
		this.router.get(`${this.path}/refreshtoken`, AuthMiddleware(), this.userCTRL.updateAccessToken);
		this.router.get(`${this.path}/getloggdinuser`, AuthMiddleware(), this.userCTRL.getUserByToken);


	}
}
