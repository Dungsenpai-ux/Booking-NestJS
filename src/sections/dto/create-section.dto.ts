import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export class CreateSectionDto {
	@ApiPropertyOptional({ type: Boolean })
	@IsOptional()
	active?: boolean

	@IsString({ message: 'Name must be a string' })
	@MinLength(3)
	@MaxLength(255)
	@ApiProperty()
	title: string

	@IsString({ message: 'Description must be a string' })
	@ApiProperty()
	description: string

	@IsString({ message: 'Image must be a string' })
	@ApiProperty()
	image: string

	@IsNumber({}, { message: 'Order must be a number' })
	@ApiProperty()
	order: number

	@IsString({ message: 'Name must be a string' })
	@ApiProperty()
	type: string
}
