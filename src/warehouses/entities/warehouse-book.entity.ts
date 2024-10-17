import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column } from 'typeorm'
import { Book } from '../../books/entities/book.entity'
import { Warehouse } from './warehouse.entity'

@Entity('warehouse_book')
export class WarehouseBook {
	@PrimaryColumn({ name: 'warehouseId' })
	warehouseId: number

	@PrimaryColumn({ name: 'bookId' })
	bookId: number

	@Column()
	count: number

	@ManyToOne(() => Warehouse)
	@JoinColumn([{ name: 'warehouseId', referencedColumnName: 'id' }])
	warehouses: Warehouse[]

	@ManyToOne(() => Book)
	@JoinColumn([{ name: 'bookId', referencedColumnName: 'id' }])
	books: Book[]
}
