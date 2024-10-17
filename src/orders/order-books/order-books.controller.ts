import { Body, Controller, Delete, Get, NotFoundException, ParseIntPipe, Patch, Post, Query } from '@nestjs/common'
import { CreateOrderBookDto } from '../dto/create-order-book.dto'
import { UpdateOrderBookDto } from '../dto/update-order-book.dto'
import { OrderBook } from '../entities/order-book.entity'
import { OrderBooksService } from './order-books.service'

@Controller('order-books')
export class OrderBooksController {
	constructor(private readonly orderBooksService: OrderBooksService) {}

	@Post()
	createCart(@Body() createOrderBookDto: CreateOrderBookDto): Promise<OrderBook> {
		return this.orderBooksService.createCart(createOrderBookDto)
	}

	@Get()
	async search(
		@Query('orderId', ParseIntPipe) orderId?: number,
		@Query('bookId', ParseIntPipe) bookId?: number
	): Promise<{ data: OrderBook[]; total: number }> {
		const rs: [OrderBook[], number] = await this.checkOrderBookExist(orderId, bookId)
		return { data: rs[0], total: rs[1] }
	}

	@Patch()
	async updateCount(@Body() updateOrderBookDto: UpdateOrderBookDto): Promise<UpdateOrderBookDto> {
		await this.checkOrderBookExist(updateOrderBookDto.orderId, updateOrderBookDto.bookId)
		return this.orderBooksService.updateCount(updateOrderBookDto)
	}

	@Delete('orderId/:orderId/bookId/:bookId')
	async removeCart(
		@Query('orderId', ParseIntPipe) orderId: number,
		@Query('bookId', ParseIntPipe) bookId: number
	): Promise<void> {
		await this.checkOrderBookExist(orderId, bookId)
		return this.orderBooksService.removeCart(orderId, bookId)
	}

	private async checkOrderBookExist(orderId: number, bookId: number): Promise<[OrderBook[], number]> {
		const rs = await this.orderBooksService.searchCarts(orderId, bookId)
		if (!rs[0].length) {
			throw new NotFoundException('OrderBook not found')
		}

		return rs
	}
}
