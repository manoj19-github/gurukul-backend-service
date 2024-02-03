import { ChangeEmailRequestDTO, ForgotPasswordDTO, LoginDTO, RegistrationDTO, ResetEmailDTO, ResetPasswordDTO } from '@/http/dtos/user.dto';
import { Router } from 'express';
import { UserController } from '../http/controllers/user.controller';
import DTOValidationMiddleware from '../http/middlewares/apiValidator.middleware';
import { Routes } from '../interfaces/routes.interface';

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
		this.router.post(`${this.path}/login`, DTOValidationMiddleware(LoginDTO), this.userCTRL.loginController);
		this.router.post(`${this.path}/forgotpassword`, DTOValidationMiddleware(ForgotPasswordDTO), this.userCTRL.forgotPassword);
		this.router.post(`${this.path}/resetpassword`, DTOValidationMiddleware(ResetPasswordDTO), this.userCTRL.resetPassword);
		this.router.post(`${this.path}/changeemailrequest`, DTOValidationMiddleware(ChangeEmailRequestDTO), this.userCTRL.changeEmailRequest);
		this.router.post(`${this.path}/resetemail`, DTOValidationMiddleware(ResetEmailDTO), this.userCTRL.resetEmailOfUser);
	}
}
