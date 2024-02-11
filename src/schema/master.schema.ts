import { ObjectType } from './../../node_modules/typescript/lib/typescript.d';
import { Document, Model, Mongoose, Schema, model } from 'mongoose';
export interface ICategories extends Document {
	name: string;
}
export interface ISubCategories extends Document {
	name: string;
	category: ICategories;
}
export interface ITopics extends Document {
	name: string;
	subCategories: ISubCategories[];
}
export interface ILevel extends Document {
	name: string;
}

export const categoriesSchema: Schema<ICategories> = new Schema({
	name: {
		type: String,
		required: true,
		trim: true,
		unique: true
	}
});

export const subCategoriesSchema: Schema<ISubCategories> = new Schema({
	name: {
		type: String,
		required: true,
		trim: true,
		unique: true
	},
	category: {
		type: Schema.Types.ObjectId,
		ref: 'Categories'
	}
});

export const topicsSchema: Schema<ITopics> = new Schema({
	name: {
		type: String,
		required: true,
		trim: true
	},
	subCategories: [
		{
			type: Schema.Types.ObjectId,
			ref: 'SubCategories'
		}
	]
});

export const LevelSchema: Schema<ILevel> = new Schema({
	name: {
		type: String,
		required: true,
		trim: true,
		unique: true
	}
});

export const CategoriesModel: Model<ICategories> = model('Categories', categoriesSchema);
export const SubCategoriesModel: Model<ISubCategories> = model('SubCategories', subCategoriesSchema);
export const TopicsModel: Model<ITopics> = model('Topics', topicsSchema);
export const LevelModel: Model<ILevel> = model('Level', LevelSchema);
