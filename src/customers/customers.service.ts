import { ConflictException, Injectable } from '@nestjs/common'
import { CreateCustomerDto } from './dto/create-customer.dto'
import { UpdateCustomerDto } from './dto/update-customer.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Customer } from './entities/customer.entity'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'

@Injectable()
export class CustomersService {
	constructor(
		@InjectRepository(Customer)
		private customersRepository: Repository<Customer>
	) {}

	async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
		const { email, username } = createCustomerDto

		if (username) {
			const customerExistUserName = await this.customersRepository.findOneBy({ username })

			if (customerExistUserName) {
				throw new ConflictException(`Customer with username ${username} is already exist`)
			}
		}

		if (email) {
			const customerExistEmail = await this.customersRepository.findOneBy({ email })

			if (customerExistEmail) {
				throw new ConflictException(`Customer with email ${email} is already exist`)
			}
		}

		createCustomerDto.password = createCustomerDto.password ? await this.hashPassword(createCustomerDto.password) : null

		return this.customersRepository.save(createCustomerDto)
	}

	findAll(): Promise<[Customer[], number]> {
		return this.customersRepository.findAndCount()
	}

	findOne(id: number): Promise<Customer | null> {
		return this.customersRepository.findOneBy({ id })
	}

	async update(id: number, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
		if (updateCustomerDto.password) {
			updateCustomerDto.password = await this.hashPassword(updateCustomerDto.password)
		}

		await this.customersRepository.update(id, updateCustomerDto)
		return this.findOne(id)
	}

	async remove(id: number): Promise<void> {
		await this.customersRepository.delete(id)
	}

	async findByUsernameOrEmail(username: string): Promise<Customer | undefined> {
		// find by username or email
		const customer = await this.customersRepository.findOneBy({ username })
		if (customer) return customer
		return this.customersRepository.findOneBy({ email: username })
	}

	async hashPassword(password: string) {
		const salt = bcrypt.genSaltSync()
		password = await bcrypt.hashSync(password, salt)
		return password
	}
}
