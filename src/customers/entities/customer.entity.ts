import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { Order } from '../../orders/entities/order.entity'
import { Comment } from '../../comments/entities/comment.entity'

@Entity()
export class Customer {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ type: 'varchar', length: 255, nullable: true, unique: true })
	email: string

	@Column({ type: 'varchar', length: 255 })
	firstName: string

	@Column({ type: 'varchar', length: 255 })
	lastName: string

	@Column({ type: 'varchar', length: 255, nullable: true, unique: true })
	username: string

	@Column({ type: 'varchar', length: 255, nullable: true })
	password: string

	@Column({ type: 'varchar', length: 255 })
	phone: string

	@Column({ type: 'varchar', length: 255 })
	address: string

	@Column({ type: 'varchar', length: 255, nullable: true })
	province: string

	@Column({ type: 'varchar', length: 255, nullable: true })
	district: string

	@Column({ type: 'varchar', length: 255, nullable: true })
	street: string

	@Column({ nullable: true })
	zipCode: number

	@CreateDateColumn({ type: 'timestamptz' })
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz' })
	updatedAt: Date

	@OneToMany(() => Order, order => order.customer)
	orders: Order[]

	@OneToMany(() => Comment, comment => comment.customer)
	comments: Comment[]

	toJSON() {
		const { password, ...self } = this
		return self
	}

	validPassword(password: string) {
		return bcrypt.compareSync(password, this.password)
	}
}
