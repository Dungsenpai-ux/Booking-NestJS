import { Module } from '@nestjs/common'
import { WarehouseBooksService } from './warehouse-books.service'
import { WarehouseBooksController } from './warehouse-books.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { WarehouseBook } from '../entities/warehouse-book.entity'

@Module({
	imports: [TypeOrmModule.forFeature([WarehouseBook])],
	controllers: [WarehouseBooksController],
	providers: [WarehouseBooksService],
	exports: [WarehouseBooksService]
})
export class WarehouseBooksModule {}
