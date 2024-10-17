import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsPositive } from 'class-validator'

export class CreateOrderBookDto {
	@IsNumber()
	@ApiProperty()
	orderId: number

	@IsNumber()
	@ApiProperty()
	bookId: number

	@IsNumber()
	@IsPositive()
	@ApiProperty()
	count: number
}
