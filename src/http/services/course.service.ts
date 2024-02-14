import { EditCourseMeataDetailsDTO } from './../dtos/course.dto';
import { CourseVideosModel, CourseModel, ICourse, ICourseVideos } from './../../schema/course.schema';
import { ClientSession, ObjectId } from 'mongoose';
import { CourseVideosDTO, DeleteCourseVideoDTO, UploadCourseDto } from '../dtos/course.dto';
import { HttpException } from '../exceptions/http.exceptions';
import { redis } from '../../config/redis.config';

export class CourseService {
	/***
	* upload course service
	* @param {UploadCourseDto} uploadCoursePayload
	  @param {ClientSession} session
	* @returns
	* @memberof CourseService

	**/
	static async UploadCourseService(
		uploadCousePayload: UploadCourseDto,
		userId: string,
		session: ClientSession
	): Promise<{ courseData: any; courseVideos: ICourseVideos[] }> {
		const { name, description, price, estimatedPrice, thumbnail, tags, level, demoUrl, benefits, prerequists, courseVideos } =
			uploadCousePayload;
		const newCourse = await CourseModel.create(
			[
				{
					name,
					description,
					price,
					estimatedPrice,
					thumbnail,
					tags,
					demoUrl,
					benefits,
					prerequists,
					level,
					creator: userId
				}
			],
			{ session }
		);
		if (!courseVideos || courseVideos.length === 0) return { courseData: newCourse, courseVideos: [] };
		const courseVideoLists = courseVideos.map((self) => ({ ...self, courseData: Array.isArray(newCourse) ? newCourse[0]._id : undefined }));
		const newCourseVideoLists = await CourseVideosModel.insertMany([...courseVideoLists], { session });
		const courseVideoIds = newCourseVideoLists.map((self) => self._id);
		await CourseModel.updateOne(
			{ _id: Array.isArray(newCourse) ? newCourse[0]._id : '' },
			{ $push: { courseVideos: courseVideoIds } },
			{ returnDocument: 'after', session }
		);
		return { courseData: newCourse, courseVideos: newCourseVideoLists };
	}

	/***
	* assign videos to  courses
	* @param {CourseVideosDTO} courseVideosPayload
	  @param {ClientSession} session
	* @returns
	* @memberof CourseService
	**/
	static async assignVideosToCourse({ courseVideosPayload, session }: { courseVideosPayload: CourseVideosDTO; session: ClientSession }) {
		if (!courseVideosPayload?.courseId) throw new HttpException(400, 'Course Id not found');
		const payload: any = JSON.parse(JSON.stringify(courseVideosPayload));
		if (courseVideosPayload.courseVideoId) {
			if (payload?.courseId) {
				delete payload.courseId;
			}
			if (payload?.courseVideoId) {
				delete payload.courseVideoId;
			}
			await CourseVideosModel.updateOne({ _id: courseVideosPayload.courseVideoId }, { $set: { ...payload } }, { session });
		} else {
			const newCourseVideos = await CourseVideosModel.create({ ...payload }, { session });
			await CourseModel.updateOne(
				{ _id: courseVideosPayload.courseId },
				{ $push: { courseVideos: Array.isArray(newCourseVideos) ? newCourseVideos[0]._id : null } },
				{ returnDocument: 'after', session }
			);
		}
		return await CourseModel.findById(courseVideosPayload.courseId).populate('courseVideos');
	}
	/***
	* delete  videos of  course
	* @param {DeleteCourseVideoDTO} deleteCourseVideoPayload
	  @param {ClientSession} session
	* @memberof CourseService
	**/
	static async deleteVideosOfCourse({
		deleteCourseVideoPayload,
		session
	}: {
		deleteCourseVideoPayload: DeleteCourseVideoDTO;
		session: ClientSession;
	}) {
		await CourseModel.updateOne(
			{ _id: deleteCourseVideoPayload.courseId },
			{ $pull: { courseVideos: { $eq: deleteCourseVideoPayload.courseVideoId } } },
			{ session }
		);
		await CourseVideosModel.deleteOne({ _id: deleteCourseVideoPayload.courseVideoId }, { session });
		return await CourseModel.findById(deleteCourseVideoPayload.courseId).populate('courseVideos');
	}
	/***
	* edit course meta details
	* @param {EditCourseMeataDetailsDTO} editCourseVideoPayload
	  @memberof CourseService
	**/
	static async editCourseMetadataService(editCourseMetaDetails: EditCourseMeataDetailsDTO) {
		const payload: any = JSON.parse(JSON.stringify(editCourseMetaDetails));
		if (payload?.courseId) delete payload.courseId;
		await CourseModel.updateOne({ _id: editCourseMetaDetails.courseId }, { $set: { ...payload } });
		const courseDetails = await CourseModel.findById(editCourseMetaDetails.courseId).select('-courseVideos');
		await redis.set(String(editCourseMetaDetails.courseId), JSON.stringify(courseDetails));
		return await CourseModel.findById(editCourseMetaDetails.courseId).populate('courseVideos');
	}
	/***
	* Get course  by id without purchasing
	* @param {string | undefined} courseId
	  @memberof CourseService
	**/
	static async getCourseByIdWithoutPurchasing(courseId?: string) {
		if (courseId) {
			const isRedisCacheExists = await redis.get(courseId);
			if (!!isRedisCacheExists) return JSON.parse(isRedisCacheExists);
			const courseDetails = await CourseModel.findById(courseId).select('-courseVideos');
			await redis.set(courseId, JSON.stringify(courseDetails));
			return courseDetails;
		}

		const isCoursesCacheExists = await redis.get('allCourses');
		if (!!isCoursesCacheExists) return JSON.parse(isCoursesCacheExists);

		const courses = await CourseModel.find().select('-courseVideos');
		await redis.set('allCourses', JSON.stringify(courses), 'EX', 120); // redis stores courses for 120 seconds
		return courses;
	}
}
