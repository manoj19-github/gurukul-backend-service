import { RequestWithUser } from '../../interfaces/auth.interface';
import { NextFunction, Response, Request } from 'express';
import { MasterService } from '../services/master.service';
import { CreateCategoryDTO, CreateSubCategoryDTO, DeleteCategoryDTO, DeleteSubCategoryDTO } from '../dtos/master.dto';
import mongoose from 'mongoose';

export class MasterController {
	async createCategory(req: RequestWithUser, res: Response, next: NextFunction) {
		try {
			const body = req.body as CreateCategoryDTO;
			const categoryData = await MasterService.updateOrCreateCategoryService(String(body.name), body.category_id);
			return res.status(200).json({ message: 'Category created or updated', category: categoryData });
		} catch (error) {
			next(error);
		}
	}
	async deleteCategory(req: RequestWithUser, res: Response, next: NextFunction) {
		const session = await mongoose.startSession();
		try {
			await session.startTransaction();
			const body = req.body as DeleteCategoryDTO;
			const categoryData = await MasterService.deleteCategoryService(
				String(body.category_id),
				String(body.assignable_category_id),
				session
			);
			return res.status(200).json({ message: 'Category deleted successfully', category: categoryData });
		} catch (error: any) {
			await session.abortTransaction();
			await session.endSession();
			console.log(error);
			next(error);
		}
	}
	async getCategory(req: Request, res: Response, next: NextFunction) {
		try {
			const categoryId = req.params?.category_id;
			const categories = await MasterService.getCategoryService(categoryId);
			return res.status(200).json({ message: ' Categories found', categories });
		} catch (error) {
			console.log(error);
			next(error);
		}
	}
	async createSubCategory(req: RequestWithUser, res: Response, next: NextFunction) {
		try {
			const subCategoryPayload = req.body as CreateSubCategoryDTO;
			const subCategories = await MasterService.createSubCategory(subCategoryPayload);
			return res.status(200).json({ message: ' sub categories created', subCategories });
		} catch (error) {
			console.log('error : ', error);
			next(error);
		}
	}
	async deleteSubCategory(req: RequestWithUser, res: Response, next: NextFunction) {
		const session = await mongoose.startSession();
		try {
			await session.startTransaction();
			const body = req.body as DeleteSubCategoryDTO;
			const subCategories = await MasterService.deleteSubCategoryService(body, session);
			return res.status(200).json({ message: 'sub category deleted successfully', sub_categories: subCategories });
		} catch (error: any) {
			console.log('error : ', error);
			await session.abortTransaction();
			await session.endSession();
			next(error);
		}
	}
	async getSubCategory(req: Request, res: Response, next: NextFunction) {
		try {
			const sub_category_id = req.params?.sub_category_id;
			const sub_categories = await MasterService.getSubCategoryService(sub_category_id);
			return res.status(200).json({ message: `sub category's found`, sub_categories });
		} catch (error) {
			console.log('error : ', error);
			next(error);
		}
	}
}
