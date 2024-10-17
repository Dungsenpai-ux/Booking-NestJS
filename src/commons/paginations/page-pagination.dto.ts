import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, IsOptional, Max, Min } from 'class-validator'

export class PagePaginationDto {
	@ApiPropertyOptional({
		minimum: 1,
		default: 1
	})
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@IsOptional()
	readonly page?: number = 1

	@ApiPropertyOptional({
		minimum: 1,
		maximum: 100,
		default: 10
	})
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(50)
	@IsOptional()
	readonly limit?: number
}
