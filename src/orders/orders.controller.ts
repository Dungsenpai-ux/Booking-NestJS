import {
	Body,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query,
	Req,
	UseGuards
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { OptionalJwtAuthGuard } from '../auth/jwt-auth.guard'
import { CustomersService } from '../customers/customers.service'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import { Order } from './entities/order.entity'
import { OrdersService } from './orders.service'
import { FindOrderQueryDto } from './dto/find-order-query.dto'

@ApiTags('Order')
@Controller('orders')
export class OrdersController {
	constructor(private readonly ordersService: OrdersService, private readonly customersService: CustomersService) {}

	@Post()
	@ApiBearerAuth()
	@UseGuards(OptionalJwtAuthGuard)
	async create(@Body() createOrderDto: CreateOrderDto, @Req() request?: any): Promise<Order> {
		let isCreateNewCustomer: boolean = true
		// if (request.user) {
		// 	const customer = request.user
		// const isLoginAsCustomer = await this.customersService.findOne(customer.id)

		// if (!isLoginAsCustomer) {
		// 	throw new NotFoundException('Must be login as customer to create order!')
		// }

		// 	createOrderDto.customer = customer
		// 	isCreateNewCustomer = false
		// }

		return this.ordersService.create(createOrderDto, isCreateNewCustomer)
	}

	@Get()
	async findAll(@Query() findOrderQueryDto: FindOrderQueryDto): Promise<{ data: Order[]; total: number }> {
		const rs: [Order[], number] = await this.ordersService.findAll(findOrderQueryDto)
		return { data: rs[0], total: rs[1] }
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number): Promise<Order> {
		return this.checkOrderExist(id)
	}

	@Patch(':id')
	async update(@Param('id', ParseIntPipe) id: number, @Body() updateOrderDto: UpdateOrderDto): Promise<Order> {
		await this.checkOrderExist(id)
		return this.ordersService.update(id, updateOrderDto)
	}

	@Delete(':id')
	async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
		await this.checkOrderExist(id)
		return this.ordersService.remove(id)
	}

	private async checkOrderExist(id: number): Promise<Order> {
		const order = await this.ordersService.findOne(id)
		if (!order) {
			throw new NotFoundException('Order not found!')
		}
		return order
	}
}
