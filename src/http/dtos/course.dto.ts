import { Trim } from 'class-sanitizer';
import { Type } from 'class-transformer';
import {
	IsArray,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsPositive,
	IsString,
	Max,
	MaxLength,
	Min,
	MinLength,
	ValidateNested
} from 'class-validator';

export class UploadCourseDto {
	@IsString()
	@IsNotEmpty()
	@MaxLength(40)
	@MinLength(5)
	name: string | undefined;
	@IsString()
	@IsNotEmpty()
	@MaxLength(1000)
	@MinLength(10)
	description: string | undefined;
	@IsNumber()
	@IsPositive()
	@Max(10000)
	@Min(300)
	price?: number;
	@IsNumber()
	@IsPositive()
	estimatedPrice?: number;
	@IsString()
	@IsNotEmpty()
	category?: string;
	@IsString()
	@IsNotEmpty()
	subCategory?: string;
	@IsString()
	@IsNotEmpty()
	topic?: string;
	@IsString()
	@IsNotEmpty()
	thumbnail?: string;
	@IsString()
	@IsNotEmpty()
	tags?: string;
	@IsString()
	@IsNotEmpty()
	level?: string;
	@IsString()
	@IsNotEmpty()
	demoUrl?: string;
	@IsArray()
	@IsNotEmpty()
	benefits?: { title: string }[];
	@IsArray()
	@IsNotEmpty()
	prerequists?: { title: string }[];
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CourseVideosDTO)
	courseVideos?: CourseVideosDTO[];
}

export class CourseVideosDTO {
	@IsString()
	@IsNotEmpty()
	@MaxLength(100)
	@MinLength(5)
	title?: string;
	@IsString()
	@IsNotEmpty()
	videoURL?: string;
	@IsString()
	@IsNotEmpty()
	videoThumbnail?: string;
	@IsString()
	@IsNotEmpty()
	@MaxLength(100)
	@MinLength(5)
	videoSection?: string;
	@IsString()
	@IsNotEmpty()
	@MaxLength(100)
	@MinLength(5)
	videoPlayer?: string;
	@IsString()
	@IsNotEmpty()
	videoLength?: string;
	@IsString()
	@IsOptional()
	courseId?: string;
	@IsString()
	@IsOptional()
	courseVideoId?: string;
}


export class DeleteCourseVideoDTO {
	@IsString()
	@IsNotEmpty()
	courseId?: string;
	@IsString()
	@IsNotEmpty()
	courseVideoId?: string;
}

export class EditCourseMeataDetailsDTO {
	@IsString()
	@IsNotEmpty()
	@MaxLength(40)
	@MinLength(5)
	name: string | undefined;
	@IsString()
	@IsNotEmpty()
	@MaxLength(1000)
	@MinLength(10)
	description: string | undefined;
	@IsNumber()
	@IsPositive()
	@Max(10000)
	@Min(300)
	price?: number;
	@IsNumber()
	@IsPositive()
	estimatedPrice?: number;
	@IsString()
	@IsNotEmpty()
	category?: string;
	@IsString()
	@IsNotEmpty()
	subCategory?: string;
	@IsString()
	@IsNotEmpty()
	topic?: string;
	@IsString()
	@IsNotEmpty()
	thumbnail?: string;
	@IsString()
	@IsNotEmpty()
	tags?: string;
	@IsString()
	@IsNotEmpty()
	level?: string;
	@IsString()
	@IsNotEmpty()
	demoUrl?: string;
	@IsArray()
	@IsNotEmpty()
	benefits?: { title: string }[];
	@IsArray()
	@IsNotEmpty()
	prerequists?: { title: string }[];
	@IsString()
	@IsNotEmpty()
	courseId?: string;
}