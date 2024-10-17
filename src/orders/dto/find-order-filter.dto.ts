import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Expose, Transform } from 'class-transformer'
import { IsArray, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { transformArrayNumberToArray, transformArrayStringToArray } from 'src/commons/class-transformer'
import { OrderStatus } from '../entities/order.entity'

export class FindOrderFilterDto {
	// @ApiPropertyOptional({ type: String })
	// @Expose()
	// @IsString()
	// @IsOptional()
	// q?: string

	@ApiPropertyOptional({ type: String })
	@Expose()
	@IsString()
	@IsOptional()
	code?: string

	// status type is enum OrderStatus
	@ApiPropertyOptional({ enum: OrderStatus })
	@IsEnum(OrderStatus, { message: `status must be one of the following values: ${Object.values(OrderStatus)}` })
	@Expose()
	@IsOptional()
	status?: OrderStatus
}
