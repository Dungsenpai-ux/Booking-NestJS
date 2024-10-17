import { ApiProperty } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'
import { OrderStatus } from '../entities/order.entity'

export class UpdateOrderDto {
	@IsEnum(OrderStatus)
	@ApiProperty({ enum: OrderStatus })
	status: OrderStatus
}
