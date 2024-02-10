import { Router } from 'express';
import DTOValidationMiddleware from '../http/middlewares/apiValidator.middleware';
import { Routes } from '../interfaces/routes.interface';
import AuthMiddleware from '../http/middlewares/auth.middleware';
import { UploadCourseDto } from '../http/dtos/course.dto';
import { CourseController } from '../http/controllers/course.controller';
import { IUserRole } from '../schema/user.schema';

export class CourseRoute implements Routes {
	path?: string | undefined;
	router: Router;
	courseCTRL = new CourseController();
	constructor() {
		this.router = Router();
		this.path = `/course`;
		this.initializeRoutes();
	}
	private initializeRoutes(): void {
		this.router.post(
			`${this.path}/uploadcourse`,
			DTOValidationMiddleware(UploadCourseDto),
			AuthMiddleware([IUserRole.ADMIN, IUserRole.TEACHER]),
			this.courseCTRL.uploadCourse
		);
	}
}
