import { Router } from 'express';
import DTOValidationMiddleware from '../http/middlewares/apiValidator.middleware';
import { Routes } from '../interfaces/routes.interface';
import AuthMiddleware from '../http/middlewares/auth.middleware';
import { UploadCourseDto } from '../http/dtos/course.dto';
import { CourseController } from '../http/controllers/course.controller';
import { IUserRole } from '../schema/user.schema';
import { CreateCategoryDTO } from '@/http/dtos/master.dto';
import { MasterController } from '@/http/controllers/master.controller';

export class MasterRoute implements Routes {
	path?: string | undefined;
	router: Router;
	masterCTRL = new MasterController();
	constructor() {
		this.router = Router();
		this.path = `/master`;
		this.initializeRoutes();
	}
	private initializeRoutes(): void {
		this.router.post(
			`${this.path}/upsertcategory`,
			DTOValidationMiddleware(CreateCategoryDTO),
			AuthMiddleware(IUserRole.ADMIN),
			this.masterCTRL.createCategory
		);
	}
}
