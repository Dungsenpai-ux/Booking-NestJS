import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, NotFoundException, UseGuards } from '@nestjs/common'
import { CustomersService } from './customers.service'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Customer } from './entities/customer.entity'
import { CreateCustomerDto } from './dto/create-customer.dto'
import { UpdateCustomerDto } from './dto/update-customer.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@ApiTags('Customer')
@Controller('customers')
@ApiBearerAuth()
export class CustomersController {
	constructor(private readonly customersService: CustomersService) {}

	@Post()
	create(@Body() createCustomerDto: CreateCustomerDto): Promise<Customer> {
		return this.customersService.create(createCustomerDto)
	}

	@Get()
	async findAll(): Promise<{ data: Customer[]; total: number }> {
		const rs: [Customer[], number] = await this.customersService.findAll()
		return { data: rs[0], total: rs[1] }
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number): Promise<Customer> {
		return this.checkCustomerExist(id)
	}

	@Patch(':id')
	@UseGuards(JwtAuthGuard)
	async update(@Param('id', ParseIntPipe) id: number, @Body() updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
		await this.checkCustomerExist(id)
		return this.customersService.update(id, updateCustomerDto)
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard)
	async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
		await this.checkCustomerExist(id)
		return this.customersService.remove(id)
	}

	private async checkCustomerExist(id: number): Promise<Customer> {
		const customer = await this.customersService.findOne(id)
		if (!customer) {
			throw new NotFoundException('Customer not found!')
		}
		return customer
	}
}
