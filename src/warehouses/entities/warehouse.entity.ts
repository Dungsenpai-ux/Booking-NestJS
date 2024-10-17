import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Book } from '../../books/entities/book.entity'

@Entity()
export class Warehouse {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ type: 'varchar', length: 255 })
	name: string

	@Column({ type: 'varchar', length: 255 })
	phone: string

	@Column({ type: 'varchar', length: 255 })
	code: string

	@Column({ type: 'varchar', length: 255 })
	address: string

	@CreateDateColumn({ type: 'timestamptz' })
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz' })
	updatedAt: Date

	@ManyToMany(() => Book, book => book.warehouses)
	@JoinTable({
		name: 'warehouse_book',
		joinColumn: {
			name: 'warehouseId',
			referencedColumnName: 'id'
		},
		inverseJoinColumn: {
			name: 'bookId',
			referencedColumnName: 'id'
		}
	})
	books?: Book[]
}
