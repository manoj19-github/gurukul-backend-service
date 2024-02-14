import { CreateTopicsDTO, LevelDTO } from './../dtos/master.dto';
import { ICategories, ISubCategories, SubCategoriesModel, TopicsModel, ITopics, ILevel, LevelModel } from './../../schema/master.schema';
import { CategoriesModel } from '../../schema/master.schema';
import { CreateSubCategoryDTO, DeleteSubCategoryDTO } from '../dtos/master.dto';
import { ClientSession } from 'mongoose';
import { HttpException } from '../exceptions/http.exceptions';

export class MasterService {
	/**
	 * get  levels
	 * @param {string | undefined} levelId
	 * @returns {ILevel[] | ILevel}
	 * @memberof MasterService
	 *
	 * ***/
	static async getLevelsService(levelId?: string) {
		if (levelId) return await LevelModel.findById(levelId);
		return await LevelModel.find();
	}

	/**
	 * delete level by id
	 * @param {string} levelId
	 * @returns {ILevel[]}
	 * @memberof MasterService
	 * ***/
	static async deleteLevelService(levelId: string) {
		if (!levelId || levelId.trim() === '') throw new HttpException(400, 'level Id not found');
		await LevelModel.deleteOne({ _id: levelId });
		return await MasterService.getLevelsService();
	}

	/**
	 * create/ edit level
	 * @param {LevelDTO} levelPayload
	 * @returns {ILevel[]}
	 * @memberof MasterService
	 * ***/
	static async createLevelService(levelPayload: LevelDTO) {
		if (levelPayload?.level_id) {
			await LevelModel.updateOne({ _id: levelPayload.level_id }, { $set: { name: levelPayload.name } });
		} else {
			await LevelModel.create({ ...levelPayload });
		}
		return await LevelModel.find();
	}

	/**
	 * Create or Edit category
	 * @param {string | undefined } category_id
	 * @param {string} category_name
	 * @memberof MasterService
	 *
	 * ***/
	static async updateOrCreateCategoryService(category_name: string, category_id?: string) {
		if (!!category_id) {
			await CategoriesModel.updateOne({ _id: category_id }, { $set: { name: category_name } });
		} else {
			await CategoriesModel.create({ name: category_name });
		}

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
		if (!!subCategoryPayload.sub_category_id) {
			const updatedSubCategories = await SubCategoriesModel.updateOne(
				{ _id: subCategoryPayload.sub_category_id },
				{ $set: { ...payload } },
				{ returnDocument: 'after' }
			);
			console.log('updatedSubCategories: ', updatedSubCategories);
		} else {
			await SubCategoriesModel.create({ ...payload });
		}
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
		// replace topics which are attached with this deleted sub category to any other sub category
		await TopicsModel.updateMany(
			{ subCategories: subCategoryPayload.sub_category_id },
			{ $set: { subCategories: subCategoryPayload.assignable_sub_category_id } },
			{ session }
		);
		await SubCategoriesModel.deleteOne({ _id: subCategoryPayload.sub_category_id }, { session });

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
	/**
	 * create topics
	 * @param {CreateTopicsDTO} topicsPayload
	 * @return {ITopics[]}
	 * @memberof MasterService
	 * **/
	static async createTopicService(topicsPayload: CreateTopicsDTO) {
		const payload: any = { name: topicsPayload.name };
		if (topicsPayload.subCategory) {
			payload.subCategories = topicsPayload.subCategory;
		}
		if (topicsPayload.topic_id) {
			await TopicsModel.updateOne({ _id: topicsPayload.topic_id }, { ...payload });
		} else {
			await TopicsModel.create({ ...payload });
		}
		return TopicsModel.find().populate({
			path: 'subCategories',
			model: 'SubCategories',
			populate: { path: 'category', model: 'Categories' }
		});
	}
	/**
	 * delete topic
	 * @param {string} topic_id
	 * @return {ITopics[]}
	 * @memberof MasterService
	 * **/
	static async deleteTopicService(topic_id: string) {
		await TopicsModel.deleteOne({ _id: topic_id });
		return TopicsModel.find().populate({
			path: 'subCategories',
			model: 'SubCategories',
			populate: { path: 'category', model: 'Categories' }
		});
	}

	/**
	 * get topic
	 * @param {string | undefined} topic_id
	 * @return {ITopics[] | ITopics}
	 * @memberof MasterService
	 * **/
	static async getTopics(topic_id?: string) {
		if (!!topic_id) {
			return await TopicsModel.findById(topic_id).populate({
				path: 'subCategories',
				model: 'SubCategories',
				populate: { path: 'category', model: 'Categories' }
			});
		}
		return await TopicsModel.find().populate({
			path: 'subCategories',
			model: 'SubCategories',
			populate: { path: 'category', model: 'Categories' }
		});
	}

	/**
	 * get category, sub category and topics
	 * @memberof MasterService
	 * **/
	static async getMasterDetailsHierachyService() {
		const categories = await CategoriesModel.find();
		const subCategories = await SubCategoriesModel.find();
		const topics = await TopicsModel.find();
		const categoriesWithSubCategories = categories.map((category: any) => {
			const subCategoriesWithTopics = subCategories.map((subCategory: any) => {
				const details = JSON.parse(JSON.stringify(subCategory));
				details.topics = topics.filter((self) => self.subCategories.map(String).includes(String(subCategory._id)));
				return details;
			});
			const catDetails = JSON.parse(JSON.stringify(category));
			catDetails.subCategory = subCategoriesWithTopics.find((self) => String(self.category) === String(category._id));
			return catDetails;
		});
		return categoriesWithSubCategories;
	}
}
