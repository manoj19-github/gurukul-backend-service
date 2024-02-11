import { UploadCourseDto } from './../dtos/course.dto';
import { IUploadCourse } from '../../interfaces/course.interface';
import { Request, Response, NextFunction } from 'express';
import { CourseService } from '../services/course.service';
import { RequestWithUser } from '../../interfaces/auth.interface';
import mongoose from 'mongoose';
import { HttpException } from '../exceptions/http.exceptions';

export class CourseController {
	async uploadCourse(req: RequestWithUser, res: Response, next: NextFunction) {
		const session = await mongoose.startSession();
		try {
			session.startTransaction();
			const body = req.body as UploadCourseDto;
			const userId = req?.user?._id || '';
			if (!userId) throw new HttpException(403, 'You are not logged in'); // double check this service is completely for authenticate user
			const courseResponse = await CourseService.UploadCourseService(body, userId, session);
			await session.commitTransaction();
			await session.endSession();
			return res.status(200).json({
				message: 'new Course uploaded successfully',
				...courseResponse
			});
		} catch (error: any) {
			console.log('error : ', error);
			await session.abortTransaction();
			await session.endSession();
			next(error);
		}
	}
}