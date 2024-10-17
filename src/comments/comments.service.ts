import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateCommentDto } from './dto/create-comment.dto'
import { UpdateCommentDto } from './dto/update-comment.dto'
import { Comment } from './entities/comment.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BooksService } from '../books/books.service'
import { Customer } from '../customers/entities/customer.entity'

@Injectable()
export class CommentsService {
	constructor(
		@InjectRepository(Comment)
		private commentsRepository: Repository<Comment>,
		private booksService: BooksService
	) {}

	async create(createCommentDto: CreateCommentDto, customer: Customer): Promise<Comment> {
		try {
			const { bookId, ...commentAbridged } = createCommentDto

			// check if book exist
			const book = await this.booksService.findOne(bookId)
			if (!book) throw `Book with id ${bookId} not found`

			const newComment = this.commentsRepository.create({
				...commentAbridged,
				customer,
				book
			})
			return this.commentsRepository.save(newComment)
		} catch (error) {
			throw new BadRequestException(`Error creating comment: ${error}`)
		}
	}

	findAll(): Promise<[Comment[], number]> {
		return this.commentsRepository.findAndCount({
			relations: {
				book: true,
				customer: true
			}
		})
	}

	findOne(id: number): Promise<Comment | null> {
		return this.commentsRepository.findOne({
			where: { id },
			relations: {
				book: true,
				customer: true
			}
		})
	}

	async update(id: number, updateCommentDto: UpdateCommentDto): Promise<Comment> {
		try {
			// can't update customer and book
			delete updateCommentDto.bookId

			await this.commentsRepository.update(id, updateCommentDto)
			return this.findOne(id)
		} catch (error) {
			throw new BadRequestException(`Error creating comment: ${error}`)
		}
	}

	async remove(id: number): Promise<void> {
		await this.commentsRepository.delete(id)
	}
}
