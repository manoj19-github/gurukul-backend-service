import { Document, Model, Mongoose, Schema, model } from 'mongoose';
import { IUserSchema } from './user.schema';
import { ICategories, ILevel, ISubCategories, ITopics } from './master.schema';

export interface IComments extends Document {
	user: object;
	rating: number;
	comment: string;
	commentReplies: IComments[];
	course: object;
}
export interface IReview extends Document {
	user: object;
	rating: number;
	course: object;
}
export interface ILink extends Document {
	title: string;
	url: string;
}
export interface ICourseVideos extends Document {
	title: string;
	description: string;
	videoURL: string;
	videoThumbnail: string;
	videoSection: string;
	videoLength: string;
	videoPlayer: string;
	links: ILink[];
	suggestion: string;
	questions: IComments[];
	courseData: ICourse | object;
}

export interface ICourse extends Document {
	name: string;
	description?: string;
	price: number;
	estimatedPrice: number;
	thumbnail: string;
	tags: string;
	level: ILevel;
	demoUrl: string;
	benefits: { title: string }[];
	reviews: IReview[];
	courseVideos: ICourseVideos[];
	ratings: number;
	purchased?: number;
	prerequists: { title: string }[];
	creator?: IUserSchema;
	category: ICategories;
	subCategory: ISubCategories;
	topics: ITopics;
}
export const reviewSchema: Schema<IReview> = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	course: {
		type: Schema.Types.ObjectId,
		ref: 'Course'
	},
	rating: {
		type: Number,
		default: 0
	}
});

export const linkSchema: Schema<ILink> = new Schema({
	title: String,
	url: String
});

export const commentSchema: Schema<IComments> = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	comment: String,
	course: {
		type: Schema.Types.ObjectId,
		ref: 'Course'
	},
	commentReplies: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Comment'
		}
	]
});
export const CourseVideosSchema: Schema<ICourseVideos> = new Schema({
	videoURL: String,
	videoThumbnail: String,
	title: String,
	videoSection: String,
	description: String,
	videoPlayer: String,
	videoLength: String,
	courseData: {
		type: Schema.Types.ObjectId,
		ref: 'Course'
	},
	links: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Link'
		}
	],
	suggestion: String,
	questions: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Comment'
		}
	]
});

export const courseSchema: Schema<ICourse> = new Schema({
	name: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	estimatedPrice: Number,
	thumbnail: {
		type: String,
		required: true
	},
	tags: {
		type: String,
		required: true
	},
	level: {
		type: Schema.Types.ObjectId,
		ref: 'Level'
	},
	demoUrl: {
		type: String,
		required: true
	},
	benefits: [{ title: String }],
	prerequists: [{ title: String }],
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Review'
		}
	],
	courseVideos: [
		{
			type: Schema.Types.ObjectId,
			ref: 'CourseVideos'
		}
	],
	ratings: {
		type: Number,
		default: 0
	},
	purchased: {
		type: Number,
		default: 0
	},
	creator: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	category: {
		type: Schema.Types.ObjectId,
		ref: 'Categories'
	},
	subCategory: {
		type: Schema.Types.ObjectId,
		ref: 'SubCategories'
	},
	topics: {
		type: Schema.Types.ObjectId,
		ref: 'Topics'
	}
});

export const CourseModel: Model<ICourse> = model('Course', courseSchema);
export const CourseVideosModel: Model<ICourseVideos> = model('CourseVideos', CourseVideosSchema);
export const ReviewModel: Model<IReview> = model('Review', reviewSchema);
export const LinkModel: Model<ILink> = model('Link', linkSchema);
export const CommentSchema: Model<IComments> = model('Comment', commentSchema);
