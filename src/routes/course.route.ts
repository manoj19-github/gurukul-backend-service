import { Router } from 'express';
import DTOValidationMiddleware from '../http/middlewares/apiValidator.middleware';
import { Routes } from '../interfaces/routes.interface';
import AuthMiddleware from '../http/middlewares/auth.middleware';
import { CourseVideosDTO, DeleteCourseVideoDTO, EditCourseMeataDetailsDTO, UploadCourseDto } from '../http/dtos/course.dto';
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
		this.router.post(
			`${this.path}/assignvideos`,
			DTOValidationMiddleware(CourseVideosDTO),
			AuthMiddleware([IUserRole.ADMIN, IUserRole.TEACHER]),
			this.courseCTRL.assignCourseVideos
		);
		this.router.delete(
			`${this.path}/deletecoursevideos`,
			DTOValidationMiddleware(DeleteCourseVideoDTO),
			AuthMiddleware([IUserRole.ADMIN, IUserRole.TEACHER]),
			this.courseCTRL.deleteCourseVideos
		);
		this.router.post(
			`${this.path}/editcourse`,
			DTOValidationMiddleware(EditCourseMeataDetailsDTO),
			AuthMiddleware([IUserRole.ADMIN, IUserRole.TEACHER]),
			this.courseCTRL.editCourseMetaDetails
		);
		this.router.get(`${this.path}/coursewithoutpurchasing/:courseId?`, this.courseCTRL.getCourseWithoutPurchasing);

	}
}
