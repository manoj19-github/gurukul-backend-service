import { CourseVideosModel, CourseModel, ICourse, ICourseVideos } from './../../schema/course.schema';
import { ClientSession, ObjectId } from 'mongoose';
import { UploadCourseDto } from '../dtos/course.dto';

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
}
