import { RequestWithUser } from '@/interfaces/auth.interface';
import { NextFunction, Response } from 'express';
import { MasterService } from '../services/master.service';
import { CreateCategoryDTO } from '../dtos/master.dto';

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
}
