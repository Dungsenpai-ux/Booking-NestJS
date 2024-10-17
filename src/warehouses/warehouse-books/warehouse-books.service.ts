import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { WarehouseBook } from '../entities/warehouse-book.entity'

@Injectable()
export class WarehouseBooksService {
	constructor(
		@InjectRepository(WarehouseBook)
		private warehouseBookRepository: Repository<WarehouseBook>
	) {}

	createStock(warehouseBook: WarehouseBook) {
		const newWarehouseBook = this.warehouseBookRepository.create(warehouseBook)
		return this.warehouseBookRepository.save(newWarehouseBook)
	}

	searchStocks(warehouseId: number, bookId: number): Promise<[WarehouseBook[], number]> {
		return this.warehouseBookRepository.findAndCountBy({ warehouseId, bookId })
	}

	async updateCount(warehouseBook: WarehouseBook): Promise<WarehouseBook> {
		await this.warehouseBookRepository.update(
			{ warehouseId: warehouseBook.warehouseId, bookId: warehouseBook.bookId },
			{ count: warehouseBook.count }
		)
		return warehouseBook
	}

	async removeStock(warehouseId: number, bookId: number): Promise<void> {
		await this.warehouseBookRepository.delete({ warehouseId, bookId })
	}
}
