import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CustomersService } from '../customers/customers.service'
import { BooksService } from './../books/books.service'
import { CreateOrderDto } from './dto/create-order.dto'
import { FindOrderQueryDto } from './dto/find-order-query.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import { Order } from './entities/order.entity'
import { OrderBooksService } from './order-books/order-books.service'

@Injectable()
export class OrdersService {
	constructor(
		@InjectRepository(Order) private ordersRepository: Repository<Order>,
		private booksService: BooksService,
		private orderBooksService: OrderBooksService,
		private readonly customersService: CustomersService
	) {}

	async create(createOrderDto: CreateOrderDto, isCreateNewCustomer: boolean): Promise<Order> {
		try {
			let { customer, books, deliveryAddress, ...orderAbridged } = createOrderDto

			// check books exist by id and throw error by id
			const bookIds = books.map(book => book.bookId)
			const booksExist = await this.booksService.findAllByIds(bookIds)
			const bookNotFound = books.find(book => !booksExist.find(bookExist => bookExist.id === book.bookId))
			if (bookNotFound) throw new NotFoundException(`Book ${bookNotFound.bookId} not found!`)

			// check book quantity and throw error by id
			// const warehouseBooks = await this.warehouseBooksRepository.find({
			// 	where: {
			// 		bookId: In(bookIds)
			// 	}
			// })
			// const bookNotEnough = books.find(
			// 	book => warehouseBooks.find(warehouseBook => warehouseBook.bookId === book.bookId)?.count < book.quantity
			// )
			// if (bookNotEnough) throw new BadRequestException(`Book ${bookNotEnough.bookId} not enough quantity in warehouse!`)

			// if (isCreateNewCustomer) {
			// check customer by email if exist take it else create new customer
			const customerExist = await this.customersService.findByUsernameOrEmail(customer.email)
			if (customerExist) {
				customer = customerExist
			} else {
				customer = await this.customersService.create({
					...deliveryAddress,
					...customer
				})
			}
			// }

			const totalPrice = books.reduce((total, book) => {
				const bookExist = booksExist.find(bookExist => bookExist.id === book.bookId)
				return total + book.count * bookExist.price
			}, 0)

			if (!customer) throw 'Customer do not have enough information to create order!'

			const newOrder = this.ordersRepository.create({ customer, total: totalPrice, deliveryAddress, ...orderAbridged })
			const order = await this.ordersRepository.save(newOrder)

			const orderBooks = books.map(book => {
				return {
					orderId: order.id,
					bookId: book.bookId,
					count: book.count
				}
			})

			await Promise.all(
				orderBooks.map((orderBook: any) => {
					return this.orderBooksService.createCart(orderBook)
				})
			)

			return order
		} catch (error) {
			throw new BadRequestException(error.message)
		}
	}

	async findAll(findOrderQueryDto: FindOrderQueryDto): Promise<[Order[], number]> {
		try {
			const { code, status, orders, limit, page } = findOrderQueryDto

			const queryBuilder = this.ordersRepository
				.createQueryBuilder('order')
				.leftJoinAndSelect('order.customer', 'customer')
				.leftJoinAndSelect('order.books', 'book')
				.leftJoinAndSelect('book.orderBooks', 'orderBook', 'orderBook.orderId = order.id')

			if (code) {
				const codeSearchTerm = code.toLowerCase()
				queryBuilder.andWhere(`LOWER(order.code) LIKE :codeSearchTerm`, { codeSearchTerm: `%${codeSearchTerm}%` })
			}

			if (status) {
				queryBuilder.andWhere(`order.status = :status`, { status })
			}

			if (orders) {
				const order = Object.keys(orders).reduce((prevObj, currentKey) => {
					return {
						...prevObj,
						[`order.${currentKey}`]: orders[currentKey]
					}
				}, {})
				queryBuilder.orderBy(order)
			}

			queryBuilder.take(limit).skip((page - 1) * limit)

			// query builder return data and count
			const rs = await queryBuilder.getManyAndCount()

			const transformedResponse = rs[0].map(order => {
				return {
					...order,
					books: (order.books || []).map(book => {
						const cart = book.orderBooks
						delete book.orderBooks
						return {
							...book,
							count: cart[0].count || 0
						}
					})
				}
			})

			return [JSON.parse(JSON.stringify(transformedResponse)), rs[1]]
		} catch (error) {
			throw new BadRequestException(`Error finding orders: ${error}`)
		}
	}

	async findOne(id: number): Promise<Order | null> {
		// use query builder to get order and customer
		const rs = await this.ordersRepository
			.createQueryBuilder('order')
			.leftJoinAndSelect('order.customer', 'customer')
			.leftJoinAndSelect('order.books', 'book')
			.leftJoinAndSelect('book.orderBooks', 'orderBook', 'orderBook.orderId = order.id')
			.where('order.id = :id', { id })
			.getOne()

		const transformedResponse = {
			...rs,
			books: (rs.books || []).map(book => {
				const cart = book.orderBooks
				delete book.orderBooks
				return {
					...book,
					count: cart[0].count || 0
				}
			})
		}

		return JSON.parse(JSON.stringify(transformedResponse))
	}

	async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
		await this.ordersRepository.update(id, updateOrderDto)
		return this.findOne(id)
	}

	async remove(id: number): Promise<void> {
		await Promise.all([this.orderBooksService.removeAllCart(id), this.ordersRepository.delete(id)])
	}
}
