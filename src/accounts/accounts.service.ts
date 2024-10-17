import { ConflictException, Injectable } from '@nestjs/common'
import { CreateAccountDto } from './dto/create-account.dto'
import { UpdateAccountDto } from './dto/update-account.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Account } from './entities/account.entity'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AccountsService {
	constructor(
		@InjectRepository(Account)
		private accountsRepository: Repository<Account>
	) {}

	async create(createAccountDto: CreateAccountDto): Promise<Account> {
		const { email } = createAccountDto
		const customerExist = await this.accountsRepository.findOneBy({ email })
		if (customerExist) {
			throw new ConflictException(`Account with email ${email} is already exist`)
		}
		createAccountDto.password = await this.hashPassword(createAccountDto.password)
		return this.accountsRepository.save(createAccountDto)
	}

	findAll(): Promise<[Account[], number]> {
		return this.accountsRepository.findAndCount()
	}

	findOne(id: number): Promise<Account | null> {
		return this.accountsRepository.findOneBy({ id })
	}

	async update(id: number, updateAccountDto: UpdateAccountDto): Promise<Account> {
		updateAccountDto.password = await this.hashPassword(updateAccountDto.password)
		await this.accountsRepository.update(id, updateAccountDto)
		return this.findOne(id)
	}

	async remove(id: number): Promise<void> {
		await this.accountsRepository.delete(id)
	}

	async findByUsernameOrEmail(username: string): Promise<Account | undefined> {
		// find by username or email
		const account = await this.accountsRepository.findOneBy({ username })
		if (account) return account
		return this.accountsRepository.findOneBy({ email: username })
	}

	async hashPassword(password: string) {
		const salt = bcrypt.genSaltSync()
		password = await bcrypt.hashSync(password, salt)
		return password
	}
}
