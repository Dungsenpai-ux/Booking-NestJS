import { Module } from '@nestjs/common'
import { OrderBooksService } from './order-books.service'
import { OrderBooksController } from './order-books.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OrderBook } from '../entities/order-book.entity'

@Module({
	imports: [TypeOrmModule.forFeature([OrderBook])],
	controllers: [OrderBooksController],
	providers: [OrderBooksService],
	exports: [OrderBooksService]
})
export class OrderBooksModule {}
