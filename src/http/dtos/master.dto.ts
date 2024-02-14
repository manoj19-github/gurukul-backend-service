import { Trim } from 'class-sanitizer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDTO {
	@IsString()
	@Trim()
	@IsNotEmpty()
	name?: string;
	@IsString()
	@IsOptional()
	category_id?: string;
}
export class DeleteCategoryDTO {
	@IsString()
	@IsNotEmpty()
	category_id?: string;
	@IsString()
	@IsNotEmpty()
	assignable_category_id?: string;
}

export class CreateSubCategoryDTO {
	@IsString()
	@Trim()
	@IsNotEmpty()
	name?: string;
	@IsString()
	@IsOptional()
	category?: string;
	@IsString()
	@IsOptional()
	sub_category_id?: string;
}

export class DeleteSubCategoryDTO {
	@IsString()
	@IsNotEmpty()
	sub_category_id?: string;
	@IsString()
	@IsNotEmpty()
	assignable_sub_category_id?: string;
}

export class CreateTopicsDTO {
	@IsString()
	@Trim()
	@IsNotEmpty()
	name?: string;
	@IsString()
	@IsNotEmpty()
	subCategory?: string;
	@IsString()
	@IsOptional()
	topic_id?: string;
}
export class DeleteTopicsDTO {
	@IsString()
	@IsNotEmpty()
	topic_id?: string;
}