import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Expose, Transform } from 'class-transformer'
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator'
import { transformArrayNumberToArray, transformArrayStringToArray } from 'src/commons/class-transformer'

export class FindBookFilterDto {
	@ApiPropertyOptional({ type: String })
	@Expose()
	@IsString()
	@IsOptional()
	q?: string

	@ApiPropertyOptional({ type: String })
	@Expose()
	@IsString()
	@IsOptional()
	title?: string

	@ApiPropertyOptional({ type: String })
	@Expose()
	@IsString()
	@IsOptional()
	author?: string

	@ApiPropertyOptional({ type: String })
	@Expose()
	// @IsArray()
	@IsString()
	@IsOptional()
	// @Transform(transformArrayStringToArray)
	isbn?: string

	@ApiPropertyOptional({ type: String })
	@Expose()
	// @IsArray()
	// @IsString({ each: true })
	@IsNumber()
	@IsOptional()
	// @Transform(transformArrayNumberToArray)
	categoryIds?: number

	@ApiPropertyOptional({ type: Number })
	@Expose()
	@IsNumber()
	@IsOptional()
	authorId?: number

	@ApiPropertyOptional({ type: Number })
	@Expose()
	@IsNumber()
	@IsOptional()
	publisherId?: number
}
