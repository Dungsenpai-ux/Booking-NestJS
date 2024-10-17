import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNotEmptyObject, IsNumber } from 'class-validator'

export class FindResultDto {
	@ApiProperty({ type: Number })
	@IsNumber()
	total: number

	@ApiProperty()
	@IsArray()
	@IsNotEmptyObject({ nullable: false }, { each: true })
	data: unknown[]
}
