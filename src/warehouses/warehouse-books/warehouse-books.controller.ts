import { Controller, Get, Post, Body, Delete, ParseIntPipe, NotFoundException, Query, Patch } from '@nestjs/common'
import { WarehouseBooksService } from './warehouse-books.service'
import { WarehouseBook } from '../entities/warehouse-book.entity'

@Controller('warehouse-books')
export class WarehouseBooksController {
	constructor(private readonly warehouseBooksService: WarehouseBooksService) {}

	@Post()
	async createStock(@Body() warehouseBook: WarehouseBook): Promise<WarehouseBook> {
		// check warehouse book existed
		const rs = await this.warehouseBooksService.searchStocks(warehouseBook.warehouseId, warehouseBook.bookId)
		if (rs[0].length) {
			throw new NotFoundException('WarehouseBook existed')
		}

		return this.warehouseBooksService.createStock(warehouseBook)
	}

	@Get()
	async search(
		@Query('warehouseId', ParseIntPipe) warehouseId?: number,
		@Query('bookId', ParseIntPipe) bookId?: number
	): Promise<{ data: WarehouseBook[]; total: number }> {
		const rs: [WarehouseBook[], number] = await this.checkWarehouseBookExist(warehouseId, bookId)
		return { data: rs[0], total: rs[1] }
	}

	@Patch()
	async updateCount(@Body() warehouseBook: WarehouseBook): Promise<WarehouseBook> {
		await this.checkWarehouseBookExist(warehouseBook.warehouseId, warehouseBook.bookId)
		return this.warehouseBooksService.updateCount(warehouseBook)
	}

	@Delete('warehouseId/:warehouseId/bookId/:bookId')
	async removeStock(
		@Query('warehouseId', ParseIntPipe) warehouseId: number,
		@Query('bookId', ParseIntPipe) bookId: number
	): Promise<void> {
		await this.checkWarehouseBookExist(warehouseId, bookId)
		return this.warehouseBooksService.removeStock(warehouseId, bookId)
	}

	private async checkWarehouseBookExist(warehouseId: number, bookId: number): Promise<[WarehouseBook[], number]> {
		const rs = await this.warehouseBooksService.searchStocks(warehouseId, bookId)
		if (!rs[0].length) {
			throw new NotFoundException('WarehouseBook not found')
		}

		return rs
	}
}
