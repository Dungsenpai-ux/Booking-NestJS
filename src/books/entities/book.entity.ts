import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	JoinTable,
	ManyToMany,
	OneToMany,
	ManyToOne
} from 'typeorm'
import { Category } from '../../categories/entities/category.entity'
import { Order } from '../../orders/entities/order.entity'
import { Warehouse } from '../../warehouses/entities/warehouse.entity'
import { Comment } from '../../comments/entities/comment.entity'
import { Author } from '../../authors/entities/author.entity'
import { Publisher } from '../../publishers/entities/publisher.entity'
import { OrderBook } from '../../orders/entities/order-book.entity'

@Entity()
export class Book {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ type: 'varchar', length: 255 })
	title: string

	@Column()
	price: number

	@Column()
	year: number

	@Column({ type: 'varchar', length: 255 })
	isbn: string

	@ManyToOne(() => Author, author => author.books)
	author: Author

	@ManyToOne(() => Publisher, publisher => publisher.books)
	publisher: Publisher

	@Column()
	description: string

	@Column({ nullable: true })
	thumbnail: string

	@Column({ nullable: true })
	images: string

	@Column({ nullable: true })
	pdf: string

	@CreateDateColumn({ type: 'timestamptz' })
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz' })
	updatedAt: Date

	@ManyToMany(() => Category, category => category.books)
	@JoinTable({
		name: 'book_category',
		joinColumn: {
			name: 'bookId',
			referencedColumnName: 'id'
		},
		inverseJoinColumn: {
			name: 'categoryId',
			referencedColumnName: 'id'
		}
	})
	categories?: Category[]

	@ManyToMany(() => Order, order => order.books)
	@JoinTable({
		name: 'order_book',
		joinColumn: {
			name: 'bookId',
			referencedColumnName: 'id'
		},
		inverseJoinColumn: {
			name: 'orderId',
			referencedColumnName: 'id'
		}
	})
	orders?: Order[]

	@OneToMany(() => OrderBook, orderBook => orderBook.book)
	orderBooks?: OrderBook[]

	@ManyToMany(() => Warehouse, warehouse => warehouse.books)
	warehouses?: Warehouse[]

	@OneToMany(() => Comment, comment => comment.book)
	comments: Comment[]
}
