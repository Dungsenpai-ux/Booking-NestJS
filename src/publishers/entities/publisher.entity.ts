import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Book } from '../../books/entities/book.entity'

@Entity()
export class Publisher {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ type: 'varchar', length: 255 })
	name: string

	@Column()
	description: string

	@OneToMany(() => Book, book => book.publisher)
	books: Book[]
}
