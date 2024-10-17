import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Brackets, In, Repository } from 'typeorm'
import { CategoriesService } from '../categories/categories.service'
import { PublishersService } from '../publishers/publishers.service'
import { AuthorsService } from './../authors/authors.service'
import { CreateBookDto } from './dto/create-book.dto'
import { FindBookQueryDto } from './dto/find-book-query.dto'
import { UpdateBookDto } from './dto/update-book.dto'
import { BookCategory } from './entities/book-category.entity'
import { Book } from './entities/book.entity'

@Injectable()
export class BooksService {
	constructor(
		@InjectRepository(Book) private booksRepository: Repository<Book>,
		@InjectRepository(BookCategory) private bookCategoryRepository: Repository<BookCategory>,
		private categoriesService: CategoriesService,
		private authorsService: AuthorsService,
		private publishersService: PublishersService
	) {}

	async create(createBookDto: CreateBookDto): Promise<Book> {
		try {
			const { categoryIds, authorId, publisherId, ...bookAbridged } = createBookDto

			// check author and publisher exist
			const author = await this.authorsService.findOne(authorId)
			if (!author) {
				throw new NotFoundException(`Author with id ${authorId} not found`)
			}
			const publisher = await this.publishersService.findOne(publisherId)
			if (!publisher) {
				throw new NotFoundException(`Publisher with id ${publisherId} not found`)
			}

			const newBook = this.booksRepository.create(bookAbridged)

			newBook.author = author
			newBook.publisher = publisher

			const book = await this.booksRepository.save(newBook)

			if (categoryIds.length > 0) {
				// check category exist by id and throw error by id
				const categoriesExist = await this.categoriesService.findAllByIds(categoryIds)
				const categoryNotFound = categoryIds.find(
					categoryId => !categoriesExist.find(categoryExist => categoryExist.id === categoryId)
				)
				if (categoryNotFound) throw new NotFoundException(`Category ${categoryNotFound} not found!`)

				const bookCategories = categoryIds.map(id => {
					return { bookId: book.id, categoryId: id }
				})
				await this.bookCategoryRepository.save(bookCategories)
			}

			return book
		} catch (error) {
			throw new BadRequestException(`Error creating book: ${error}`)
		}
	}

	async findAll(findBookQueryDto: FindBookQueryDto): Promise<[Book[], number]> {
		try {
			const { q, title, author, isbn, categoryIds, authorId, publisherId, orders, limit, page } = findBookQueryDto

			const queryBuilder = this.booksRepository
				.createQueryBuilder('book')
				.leftJoinAndSelect('book.categories', 'category')
				.leftJoinAndSelect('book.warehouses', 'warehouse')
				.leftJoinAndSelect('book.author', 'author')
				.leftJoinAndSelect('book.publisher', 'publisher')

			if (q) {
				const searchTerm = q.toLowerCase()
				const fieldsToSearch = ['book.isbn', 'book.title', 'book.description']

				queryBuilder.andWhere(
					new Brackets(qb => {
						fieldsToSearch.forEach((field, index) => {
							if (index > 0) {
								qb.orWhere(`LOWER(${field}) LIKE :searchTerm`, { searchTerm: `%${searchTerm}%` })
							} else {
								qb.where(`LOWER(${field}) LIKE :searchTerm`, { searchTerm: `%${searchTerm}%` })
							}
						})

						// Search author by name
						qb.orWhere(`LOWER(author.name) LIKE :searchTerm`, { searchTerm: `%${searchTerm}%` })
					})
				)
			}

			if (title) {
				const titleSearchTerm = title.toLowerCase()
				queryBuilder.andWhere(`LOWER(book.title) LIKE :titleSearchTerm`, { titleSearchTerm: `%${titleSearchTerm}%` })
			}

			if (author) {
				const authorSearchTerm = author.toLowerCase()
				queryBuilder.andWhere(`LOWER(author.name) LIKE :authorSearchTerm`, { authorSearchTerm: `%${authorSearchTerm}%` })
			}

			if (isbn) {
				const isbnSearchTerm = isbn.toLowerCase()
				queryBuilder.andWhere(`LOWER(book.isbn) LIKE :isbnSearchTerm`, { isbnSearchTerm: `%${isbnSearchTerm}%` })
			}

			if (categoryIds) {
				queryBuilder.andWhere(`category.id IN (:categoryIds)`, { categoryIds })
			}

			if (authorId) {
				queryBuilder.andWhere(`author.id = :authorId`, { authorId })
			}

			if (publisherId) {
				queryBuilder.andWhere(`publisher.id = :publisherId`, { publisherId })
			}

			if (orders) {
				const order = Object.keys(orders).reduce((prevObj, currentKey) => {
					return {
						...prevObj,
						[`book.${currentKey}`]: orders[currentKey]
					}
				}, {})
				queryBuilder.orderBy(order)
			}

			queryBuilder.take(limit).skip((page - 1) * limit)

			// query builder return data and count
			const rs = await queryBuilder.getManyAndCount()

			return rs
		} catch (error) {
			throw new BadRequestException(`Error finding books: ${error}`)
		}
	}

	async findBookStatic() {
		const bookPopular = await this.booksRepository.find({
			select: {
				id: true,
				title: true,
				price: true,
				year: true,
				isbn: true,
				images: true,
				thumbnail: true
				// author: true,
				// publisher: true
			},
			take: 4,
			skip: 0
		})
		const bookTrending = await this.booksRepository.find({
			select: {
				id: true,
				title: true,
				price: true,
				year: true,
				isbn: true,
				images: true,
				thumbnail: true
				// author: true,
				// publisher: true
			},
			take: 4,
			skip: 4
		})
		const bookExplore = await this.booksRepository.find({
			select: {
				id: true,
				title: true,
				price: true,
				year: true,
				isbn: true,
				images: true,
				thumbnail: true
				// author: true,
				// publisher: true
			},
			take: 4,
			skip: 8
		})
		return {
			bookPopular: bookPopular,
			bookTrending: bookTrending,
			bookExplore: bookExplore
		}
	}

	async findBookSuggestion(findBookQueryDto: FindBookQueryDto) {
		console.log('findBookQueryDto :>> ', findBookQueryDto)
		return this.booksRepository.find({
			select: {
				id: true,
				title: true,
				price: true,
				year: true,
				isbn: true,
				images: true,
				thumbnail: true
				// author: true,
				// publisher: true
			},
			where: {
				categories: {
					id: In([findBookQueryDto.categoryIds])
				}
			},
			take: 4,
			skip: 0
		})
	}

	async findOne(id: number): Promise<Book | null> {
		const rs: any = await this.booksRepository.findOne({
			where: { id },
			relations: {
				categories: true,
				warehouses: true,
				author: true,
				publisher: true
			}
		})
		if (rs && rs.categories) {
			rs.categoryIds = (rs.categories || []).map((category: any) => category.id)
		}
		return rs
	}

	async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
		try {
			const { categoryIds, authorId, publisherId, ...bookAbridged } = updateBookDto

			// check author and publisher exist
			const author = await this.authorsService.findOne(authorId)
			if (!author) {
				throw new NotFoundException(`Author with id ${authorId} not found`)
			}
			const publisher = await this.publishersService.findOne(publisherId)
			if (!publisher) {
				throw new NotFoundException(`Publisher with id ${publisherId} not found`)
			}

			// update book
			await this.booksRepository.update({ id }, { ...bookAbridged, author, publisher })

			// update book category
			if (categoryIds.length > 0) {
				// check category exist by id and throw error by id
				const categoriesExist = await this.categoriesService.findAllByIds(categoryIds)
				const categoryNotFound = categoryIds.find(
					categoryId => !categoriesExist.find(categoryExist => categoryExist.id === categoryId)
				)
				if (categoryNotFound) throw new NotFoundException(`Category ${categoryNotFound} not found!`)

				// remove all book category
				await this.bookCategoryRepository.delete({ bookId: id })

				const bookCategories = categoryIds.map(categoryId => {
					return { bookId: id, categoryId: categoryId }
				})
				await this.bookCategoryRepository.save(bookCategories)
			}

			return this.findOne(id)
		} catch (error) {
			throw new BadRequestException(`Error updating book: ${error}`)
		}
	}

	async remove(id: number): Promise<void> {
		await this.booksRepository.delete(id)
	}

	async uploadFileToFolder(fileName: string, fileStream: Buffer): Promise<{ message: string; url: string }> {
		try {
			const fs = require('fs')
			const url = `/uploads/${fileName}`
			const path = `.${url}`

			fs.writeFileSync(path, fileStream)

			return {
				message: 'File uploaded successfully',
				url
			}
		} catch (error) {
			throw new BadRequestException(`Error uploading file: ${error}`)
		}
	}

	async findAllByIds(ids: number[]): Promise<Book[]> {
		return this.booksRepository.find({
			where: { id: In(ids) },
			relations: {
				categories: true
			}
		})
	}
}
