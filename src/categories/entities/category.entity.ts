import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	Tree,
	TreeParent,
	TreeChildren,
	ManyToMany
} from 'typeorm'
import { Book } from '../../books/entities/book.entity'

@Entity()
@Tree('closure-table')
export class Category {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ type: 'varchar', length: 255 })
	name: string

	@Column({ nullable: true })
	parentId?: number

	@TreeParent({ onDelete: 'CASCADE' })
	parent: Category

	@TreeChildren()
	children: Category[]

	@CreateDateColumn({ type: 'timestamptz' })
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz' })
	updatedAt: Date

	@ManyToMany(() => Book, book => book.categories)
	books?: Book[]
}
