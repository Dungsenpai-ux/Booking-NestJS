import { ApiProperty } from '@nestjs/swagger'
import { MinLength, MaxLength, IsOptional, IsNumber } from 'class-validator'

export class CreateCategoryDto {
	@MinLength(3)
	@MaxLength(255)
	@ApiProperty()
	name: string

	@ApiProperty()
	@IsOptional()
	@IsNumber()
	parentId?: number
}
