import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BooksModule } from '../books/books.module'
import { CustomersModule } from '../customers/customers.module'
import { WarehousesModule } from '../warehouses/warehouses.module'
import { Order } from './entities/order.entity'
import { OrderBooksModule } from './order-books/order-books.module'
import { OrdersController } from './orders.controller'
import { OrdersService } from './orders.service'

@Module({
	imports: [TypeOrmModule.forFeature([Order]), BooksModule, OrderBooksModule, CustomersModule, WarehousesModule],
	controllers: [OrdersController],
	providers: [OrdersService],
	exports: [OrdersService]
})
export class OrdersModule {}
