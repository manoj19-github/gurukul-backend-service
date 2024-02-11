import { CategoriesModel } from '@/schema/master.schema';

export class MasterService {
	/**
	 * @param {string | undefined } category_id
	 * @param {string} category_name
	 *
	 * ***/
	static async updateOrCreateCategoryService(category_name: string, category_id?: string) {
		await CategoriesModel.updateOne({ _id: category_id }, { $set: { name: category_name } }, { returnDocument: 'after', upsert: true });
		return await CategoriesModel.findOne({ name: category_name });
	}
}
