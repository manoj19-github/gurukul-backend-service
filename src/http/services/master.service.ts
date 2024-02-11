import { ICategories, ISubCategories, SubCategoriesModel, TopicsModel } from './../../schema/master.schema';
import { CategoriesModel } from '../../schema/master.schema';
import { CreateSubCategoryDTO, DeleteSubCategoryDTO } from '../dtos/master.dto';
import { ClientSession } from 'mongoose';

export class MasterService {
	/**
	 * Create or Edit category
	 * @param {string | undefined } category_id
	 * @param {string} category_name
	 * @memberof MasterService
	 *
	 * ***/
	static async updateOrCreateCategoryService(category_name: string, category_id?: string) {
		await CategoriesModel.updateOne({ _id: category_id }, { $set: { name: category_name } }, { returnDocument: 'after', upsert: true });
		return await CategoriesModel.find();
	}
	/**
	 * Delete Category
	 * @param {string} category_id
	 * @param {string} assignable_category_id
	 * @param {ClientSession} session
	 * @memberof MasterService
	 * ***/
	static async deleteCategoryService(category_id: string, assignable_category_id: string, session: ClientSession) {
		await CategoriesModel.deleteOne({ _id: category_id }, { session });
		// replace sub category which are attached with this deleted category to any other category
		await SubCategoriesModel.updateMany({ category: category_id }, { $set: { category: assignable_category_id } }, { session });
		await session.commitTransaction();
		await session.endSession();
		return await CategoriesModel.find();
	}
	/**
	 * get category service
	 * @param {string | undefined} category_id
	 * @return {ICategories[] | ICategories}
	 * @memberof MasterService
	 * **/
	static async getCategoryService(category_id?: string) {
		if (!!category_id) return await CategoriesModel.findById(category_id);
		return await CategoriesModel.find();
	}
	/**
	 * create update Sub category service
	 * @param {CreateSubCategoryDTO} subCategoryPayload
	 * @return {ISubCategories[]}
	 * @memberof MasterService
	 * **/
	static async createSubCategory(subCategoryPayload: CreateSubCategoryDTO) {
		const payload: any = { name: subCategoryPayload.name };
		if (subCategoryPayload.category) payload.category = subCategoryPayload.category;
		await SubCategoriesModel.updateOne({ _id: subCategoryPayload.sub_category_id }, { $set: { ...payload } }, { upsert: true });
		return await SubCategoriesModel.find().populate('category');
	}

	/**
	 * delete sub category
	 * @param {DeleteSubCategoryDTO} subCategoryPayload
	 * @param {ClientSession} session
	 * @return {ISubCategories[]}
	 * @memberof MasterService
	 * **/
	static async deleteSubCategoryService(subCategoryPayload: DeleteSubCategoryDTO, session: ClientSession) {
		await SubCategoriesModel.deleteOne({ _id: subCategoryPayload.sub_category_id }, { session });
		// replace topics which are attached with this deleted sub category to any other sub category
		await TopicsModel.updateMany(
			{ subCategories: subCategoryPayload.sub_category_id },
			{ $set: { subCategories: subCategoryPayload.assignable_sub_category_id } },
			{ session }
		);
		await session.commitTransaction();
		await session.endSession();
		return await SubCategoriesModel.find().populate('category');
	}
	/**
	 * get sub category
	 * @param {string | undefined} sub_category_id
	 * @return {ISubCategories[] | ISubCategories}
	 * @memberof MasterService
	 * **/
	static async getSubCategoryService(sub_category_id?: string) {
		if (!!sub_category_id) {
			return await SubCategoriesModel.findById(sub_category_id).populate('category');
		}
		return await SubCategoriesModel.find().populate('category');
	}
}
