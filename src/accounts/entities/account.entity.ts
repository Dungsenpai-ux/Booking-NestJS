import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import * as bcrypt from 'bcrypt'

@Entity()
export class Account {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ type: 'varchar', length: 255 })
	email: string

	@Column({ type: 'varchar', length: 255 })
	firstName: string

	@Column({ type: 'varchar', length: 255 })
	lastName: string

	@Column({ type: 'varchar', length: 255 })
	username: string

	@Column({ type: 'varchar', length: 255 })
	password: string

	@Column({ type: 'varchar', length: 255 })
	phone: string

	// @Column()
	// roleId?: number

	@CreateDateColumn({ type: 'timestamptz' })
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamptz' })
	updatedAt: Date

	toJSON() {
		const { password, ...self } = this
		return self
	}

	validPassword(password: string) {
		return bcrypt.compareSync(password, this.password)
	}
}
