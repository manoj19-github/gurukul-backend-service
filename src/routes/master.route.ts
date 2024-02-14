import { Router } from 'express';
import DTOValidationMiddleware from '../http/middlewares/apiValidator.middleware';
import { Routes } from '../interfaces/routes.interface';
import AuthMiddleware from '../http/middlewares/auth.middleware';
import { UploadCourseDto } from '../http/dtos/course.dto';
import { CourseController } from '../http/controllers/course.controller';
import { IUserRole } from '../schema/user.schema';
import {
	CreateCategoryDTO,
	CreateSubCategoryDTO,
	CreateTopicsDTO,
	DeleteCategoryDTO,
	DeleteSubCategoryDTO,
	DeleteTopicsDTO
} from '../http/dtos/master.dto';
import { MasterController } from '../http/controllers/master.controller';

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
			`${this.path}/category`,
			DTOValidationMiddleware(CreateCategoryDTO),
			AuthMiddleware(IUserRole.ADMIN),
			this.masterCTRL.createCategory
		);
		this.router.delete(
			`${this.path}/category`,
			DTOValidationMiddleware(DeleteCategoryDTO),
			AuthMiddleware(IUserRole.ADMIN),
			this.masterCTRL.deleteCategory
		);
		this.router.get(`${this.path}/category/:category_id?`, this.masterCTRL.getCategory);
		this.router.post(
			`${this.path}/subcategory`,
			DTOValidationMiddleware(CreateSubCategoryDTO),
			AuthMiddleware(IUserRole.ADMIN),
			this.masterCTRL.createSubCategory
		);
		this.router.get(`${this.path}/subcategory/:sub_category_id?`, this.masterCTRL.getSubCategory);
		this.router.delete(
			`${this.path}/subcategory`,
			DTOValidationMiddleware(DeleteSubCategoryDTO),
			AuthMiddleware(IUserRole.ADMIN),
			this.masterCTRL.deleteSubCategory
		);
		this.router.post(
			`${this.path}/topics`,
			DTOValidationMiddleware(CreateTopicsDTO),
			AuthMiddleware(IUserRole.ADMIN),
			this.masterCTRL.createTopics
		);
		this.router.get(`${this.path}/topics/:topic_id?`, this.masterCTRL.getTopics);
		this.router.delete(
			`${this.path}/topics`,
			DTOValidationMiddleware(DeleteTopicsDTO),
			AuthMiddleware(IUserRole.ADMIN),
			this.masterCTRL.deleteTopics
		);
		this.router.get(`${this.path}/masterhierarchy`, this.masterCTRL.getMasterHierarchy);

	}
}
