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
