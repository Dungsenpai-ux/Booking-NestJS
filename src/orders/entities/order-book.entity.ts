import { Order } from './order.entity'
import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column } from 'typeorm'
import { Book } from '../../books/entities/book.entity'

@Entity('order_book')
export class OrderBook {
	@PrimaryColumn({ name: 'orderId' })
	orderId: number

	@PrimaryColumn({ name: 'bookId' })
	bookId: number

	@Column({ nullable: true })
	count: number

	@ManyToOne(() => Order, order => order.books)
	@JoinColumn([{ name: 'orderId', referencedColumnName: 'id' }])
	order: Order

	@ManyToOne(() => Book, book => book.orders)
	@JoinColumn([{ name: 'bookId', referencedColumnName: 'id' }])
	book: Book
}
