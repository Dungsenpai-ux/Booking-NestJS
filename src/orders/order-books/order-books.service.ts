import { Injectable } from '@nestjs/common'
import { OrderBook } from '../entities/order-book.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateOrderBookDto } from '../dto/create-order-book.dto'
import { UpdateOrderBookDto } from '../dto/update-order-book.dto'

@Injectable()
export class OrderBooksService {
	constructor(
		@InjectRepository(OrderBook)
		private orderBookRepository: Repository<OrderBook>
	) {}

	createCart(createOrderBookDto: CreateOrderBookDto) {
		const newOrderBook = this.orderBookRepository.create(createOrderBookDto)
		return this.orderBookRepository.save(newOrderBook)
	}

	searchCarts(orderId: number, bookId: number): Promise<[OrderBook[], number]> {
		return this.orderBookRepository.findAndCountBy({ orderId, bookId })
	}

	async updateCount(updateOrderBookDto: UpdateOrderBookDto): Promise<UpdateOrderBookDto> {
		await this.orderBookRepository.update(
			{ orderId: updateOrderBookDto.orderId, bookId: updateOrderBookDto.bookId },
			{ count: updateOrderBookDto.count }
		)
		return updateOrderBookDto
	}

	async removeCart(orderId: number, bookId: number): Promise<void> {
		await this.orderBookRepository.delete({ orderId, bookId })
	}

	// remove all cart by orderId
	async removeAllCart(orderId: number): Promise<void> {
		await this.orderBookRepository.delete({ orderId })
	}
}
