import { PartialType } from '@nestjs/swagger'
import { CreateOrderBookDto } from './create-order-book.dto'

export class UpdateOrderBookDto extends PartialType(CreateOrderBookDto) {}
