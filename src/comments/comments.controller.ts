import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	ParseIntPipe,
	NotFoundException,
	UseGuards,
	Req
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CommentsService } from './comments.service'
import { Comment } from './entities/comment.entity'
import { CreateCommentDto } from './dto/create-comment.dto'
import { UpdateCommentDto } from './dto/update-comment.dto'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { CustomersService } from '../customers/customers.service'

@ApiTags('Comment')
@Controller('comments')
@ApiBearerAuth()
export class CommentsController {
	constructor(private readonly commentsService: CommentsService, private readonly customersService: CustomersService) {}

	@Post()
	@UseGuards(JwtAuthGuard)
	async create(@Body() createCommentDto: CreateCommentDto, @Req() request: any) {
		const customer = request.user
		const isLoginAsCustomer = await this.customersService.findOne(customer.id)

		if (!isLoginAsCustomer) {
			throw new NotFoundException('Must be login as customer to create comment!')
		}

		return this.commentsService.create(createCommentDto, customer)
	}

	@Get()
	async findAll(): Promise<{ data: Comment[]; total: number }> {
		const rs: [Comment[], number] = await this.commentsService.findAll()
		return { data: rs[0], total: rs[1] }
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number): Promise<Comment> {
		return this.checkCommentExist(id)
	}

	@Patch(':id')
	@UseGuards(JwtAuthGuard)
	async update(@Param('id', ParseIntPipe) id: number, @Body() updateCommentDto: UpdateCommentDto): Promise<Comment> {
		await this.checkCommentExist(id)
		return this.commentsService.update(id, updateCommentDto)
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard)
	async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
		await this.checkCommentExist(id)
		return this.commentsService.remove(id)
	}

	private async checkCommentExist(id: number): Promise<Comment> {
		const customer = await this.commentsService.findOne(id)
		if (!customer) {
			throw new NotFoundException('Comment not found!')
		}
		return customer
	}
}
