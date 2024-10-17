import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm'
import { Book } from '../../books/entities/book.entity'
import { Customer } from '../../customers/entities/customer.entity'

@Entity()
export class Comment {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ type: 'varchar', length: 255 })
	content: string

	@ManyToOne(() => Book, book => book.comments)
	book: Book

	@ManyToOne(() => Customer, customer => customer.comments)
	customer: Customer

	@CreateDateColumn({ type: 'timestamptz' })
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz' })
	updatedAt: Date
}
