import {
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	JoinTable,
	ManyToMany,
	BeforeInsert,
	ManyToOne,
	Entity,
	OneToMany
} from 'typeorm'
import { Book } from '../../books/entities/book.entity'
import { Customer } from '../../customers/entities/customer.entity'
import { OrderBook } from './order-book.entity'

export enum PaymentType {
	CASH = 'cash',
	CREDIT_CARD = 'credit_card',
	DEBIT_CARD = 'debit_card',
	TRANSFER = 'transfer'
}

export enum OrderStatus {
	NEW = 'new',
	PENDING = 'pending',
	COMPLETED = 'completed',
	CANCELLED = 'cancelled'
}

@Entity()
export class Order {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ type: 'varchar', length: 255 })
	code: string

	@Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.NEW })
	status: OrderStatus

	@Column()
	total: number

	@Column({ type: 'enum', enum: PaymentType, default: PaymentType.CASH })
	paymentType: PaymentType

	@Column({ type: 'varchar', length: 255, nullable: true })
	note: string

	@ManyToOne(() => Customer, customer => customer.orders)
	customer: Customer

	@Column({ type: 'jsonb', nullable: true })
	deliveryAddress: {
		province: string
		district: string
		street: string
		address: string
		zipCode: number
	}

	@CreateDateColumn({ type: 'timestamptz' })
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz' })
	updatedAt: Date

	@BeforeInsert()
	generateCode() {
		this.code = '#' + Math.floor(Math.random() * 1000000000)
	}

	@ManyToMany(() => Book, book => book.orders)
	@JoinTable({
		name: 'order_book',
		joinColumn: {
			name: 'orderId',
			referencedColumnName: 'id'
		},
		inverseJoinColumn: {
			name: 'bookId',
			referencedColumnName: 'id'
		}
	})
	books?: Book[]

	@OneToMany(() => OrderBook, orderBook => orderBook.order)
	orderBooks?: OrderBook[]
}
