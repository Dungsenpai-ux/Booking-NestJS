import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm'
import { Category } from '../../categories/entities/category.entity'
import { Book } from './book.entity'

@Entity('book_category')
export class BookCategory {
	@PrimaryColumn({ name: 'bookId' })
	bookId: number

	@PrimaryColumn({ name: 'categoryId' })
	categoryId: number

	@ManyToOne(() => Book, { createForeignKeyConstraints: false })
	@JoinColumn([{ name: 'bookId', referencedColumnName: 'id' }])
	books: Book[]

	@ManyToOne(() => Category, { createForeignKeyConstraints: false })
	@JoinColumn([{ name: 'categoryId', referencedColumnName: 'id' }])
	categories: Category[]
}
