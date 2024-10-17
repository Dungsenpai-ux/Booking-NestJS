import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Section {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ type: 'boolean', default: false })
	active: boolean

	@Column()
	title: string

	@Column()
	description: string

	@Column()
	image: string

	@Column()
	order: number

	@Column()
	type: string
}
