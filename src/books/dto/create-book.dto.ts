import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { MinLength, MaxLength, Min, IsNumber, IsOptional, IsString, IsArray, ArrayMinSize, ValidateNested } from 'class-validator'

export class CreateBookDto {
	@IsString()
	@MinLength(3)
	@MaxLength(255)
	@ApiProperty()
	title: string

	@Min(1000)
	@ApiProperty()
	@IsNumber()
	price: number

	@ApiProperty()
	@IsNumber()
	year: number

	@MinLength(3)
	@MaxLength(255)
	@ApiProperty()
	isbn: string

	@ApiProperty()
	@IsNumber()
	authorId: number

	@ApiProperty()
	@IsNumber()
	publisherId: number

	@ApiProperty()
	@IsString()
	description: string

	@ApiProperty()
	@IsString()
	@IsOptional()
	thumbnail: string

	@ApiProperty()
	@IsString()
	@IsOptional()
	images: string

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	pdf: string

	@ApiPropertyOptional({ type: [Number] })
	@IsArray()
	@IsOptional()
	@ArrayMinSize(1)
	@Type(() => Number)
	categoryIds?: number[]
}
