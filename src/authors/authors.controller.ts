import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, NotFoundException, UseGuards } from '@nestjs/common'
import { AuthorsService } from './authors.service'
import { CreateAuthorDto } from './dto/create-author.dto'
import { UpdateAuthorDto } from './dto/update-author.dto'
import { Author } from './entities/author.entity'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@ApiTags('Author')
@ApiBearerAuth()
@Controller('authors')
export class AuthorsController {
	constructor(private readonly authorsService: AuthorsService) {}

	@Post()
	@UseGuards(JwtAuthGuard)
	create(@Body() createAuthorDto: CreateAuthorDto): Promise<Author> {
		return this.authorsService.create(createAuthorDto)
	}

	@Get()
	async findAll(): Promise<{ data: Author[]; total: number }> {
		const rs: [Author[], number] = await this.authorsService.findAll()
		return { data: rs[0], total: rs[1] }
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number): Promise<Author> {
		return this.checkAuthorExist(id)
	}

	@Patch(':id')
	@UseGuards(JwtAuthGuard)
	async update(@Param('id', ParseIntPipe) id: number, @Body() updateAuthorDto: UpdateAuthorDto): Promise<Author> {
		await this.checkAuthorExist(id)
		return this.authorsService.update(id, updateAuthorDto)
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard)
	async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
		await this.checkAuthorExist(id)
		return this.authorsService.remove(id)
	}

	private async checkAuthorExist(id: number): Promise<Author> {
		const author = await this.authorsService.findOne(id)
		if (!author) {
			throw new NotFoundException('Author not found!')
		}
		return author
	}
}
