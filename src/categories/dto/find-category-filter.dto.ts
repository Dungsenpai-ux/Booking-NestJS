import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Expose, Transform } from 'class-transformer'
import { IsArray, IsNumber, IsObject, IsOptional, IsString } from 'class-validator'
import { transformArrayNumberToArray, transformArrayStringToArray } from 'src/commons/class-transformer'

export class FindCategoryFilterDto {
	@ApiPropertyOptional()
	@Expose()
	// @Is()
	// @IsArray()
	// @IsString({ each: true })
	@IsOptional()
	// @Transform(transformArrayNumberToArray)
	filter?: any

	@ApiPropertyOptional({ type: String })
	@Expose()
	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	@Transform(transformArrayStringToArray)
	name?: string[]

	@ApiPropertyOptional()
	@Expose()
	@IsNumber()
	// @IsArray()
	// @IsString({ each: true })
	@IsOptional()
	// @Transform(transformArrayNumberToArray)
	parentId?: number
}
