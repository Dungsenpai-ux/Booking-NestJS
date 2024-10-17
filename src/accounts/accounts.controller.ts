import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, NotFoundException, UseGuards } from '@nestjs/common'
import { AccountsService } from './accounts.service'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Account } from './entities/account.entity'
import { CreateAccountDto } from './dto/create-account.dto'
import { UpdateAccountDto } from './dto/update-account.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@ApiTags('Account')
@Controller('accounts')
@ApiBearerAuth()
export class AccountsController {
	constructor(private readonly accountsService: AccountsService) {}

	@Post()
	// @UseGuards(JwtAuthGuard)
	create(@Body() createAccountDto: CreateAccountDto): Promise<Account> {
		return this.accountsService.create(createAccountDto)
	}

	@Get()
	async findAll(): Promise<{ data: Account[]; total: number }> {
		const rs: [Account[], number] = await this.accountsService.findAll()
		return { data: rs[0], total: rs[1] }
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number): Promise<Account> {
		return this.checkAccountExist(id)
	}

	@Patch(':id')
	@UseGuards(JwtAuthGuard)
	async update(@Param('id', ParseIntPipe) id: number, @Body() updateAccountDto: UpdateAccountDto): Promise<Account> {
		await this.checkAccountExist(id)
		return this.accountsService.update(id, updateAccountDto)
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard)
	async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
		await this.checkAccountExist(id)
		return this.accountsService.remove(id)
	}

	private async checkAccountExist(id: number): Promise<Account> {
		const account = await this.accountsService.findOne(id)
		if (!account) {
			throw new NotFoundException('Account not found!')
		}
		return account
	}
}
