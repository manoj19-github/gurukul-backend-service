import { ObjectType } from './../../node_modules/typescript/lib/typescript.d';
import { Document, Model, Mongoose, Schema, model } from 'mongoose';

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
export interface ICourseData extends Document {
	title: string;
	description: string;
	videoURL: string;
	videoThumbnail: string;
	videoSection: string;
	videoLength: number;
	videoPlayer: string;
	links: ILink[];
	suggestion: string;
	questions: IComments[];
}

export interface ICourse extends Document {
	name: string;
	description?: string;
	price: number;
	estimatedPrice: number;
	thumbnail: string;
	tags: string;
	level: string;
	demoUrl: string;
	benefits: { title: string }[];
	reviews: IReview[];
	courseData: ICourseData[];
	ratings: number;
	purchased?: number;
	prerequisites: { title: string }[];
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
export const courseDataSchema: Schema<ICourseData> = new Schema({
	videoURL: String,
	videoThumbnail: String,
	title: String,
	videoSection: String,
	description: String,
	videoPlayer: String,
	videoLength: Number,
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
		type: String,
		required: true
	},
	demoUrl: {
		type: String,
		required: true
	},
	benefits: [{ title: String }],
	prerequisites: [{ title: String }],
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Review'
		}
	],
	courseData: [
		{
			type: Schema.Types.ObjectId,
			ref: 'CourseData'
		}
	],
	ratings: {
		type: Number,
		default: 0
	},
	purchased: {
		type: Number,
		default: 0
	}
});

export const CourseModel: Model<ICourse> = model('Course', courseSchema);
export const CourseDataModel: Model<ICourseData> = model('CourseData', courseDataSchema);
export const ReviewModel: Model<IReview> = model('Review', reviewSchema);
export const LinkModel: Model<ILink> = model('Link', linkSchema);
export const CommentSchema: Model<IComments> = model('Comment', commentSchema);