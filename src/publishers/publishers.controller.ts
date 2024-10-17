import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, NotFoundException, UseGuards } from '@nestjs/common'
import { PublishersService } from './publishers.service'
import { CreatePublisherDto } from './dto/create-publisher.dto'
import { UpdatePublisherDto } from './dto/update-publisher.dto'
import { Publisher } from './entities/Publisher.entity'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@ApiTags('Publisher')
@ApiBearerAuth()
@Controller('publishers')
export class PublishersController {
	constructor(private readonly publishersService: PublishersService) {}

	@Post()
	@UseGuards(JwtAuthGuard)
	create(@Body() createPublisherDto: CreatePublisherDto): Promise<Publisher> {
		return this.publishersService.create(createPublisherDto)
	}

	@Get()
	async findAll(): Promise<{ data: Publisher[]; total: number }> {
		const rs: [Publisher[], number] = await this.publishersService.findAll()
		return { data: rs[0], total: rs[1] }
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number): Promise<Publisher> {
		return this.checkPublisherExist(id)
	}

	@Patch(':id')
	@UseGuards(JwtAuthGuard)
	async update(@Param('id', ParseIntPipe) id: number, @Body() updatePublisherDto: UpdatePublisherDto): Promise<Publisher> {
		await this.checkPublisherExist(id)
		return this.publishersService.update(id, updatePublisherDto)
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard)
	async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
		await this.checkPublisherExist(id)
		return this.publishersService.remove(id)
	}

	private async checkPublisherExist(id: number): Promise<Publisher> {
		const publisher = await this.publishersService.findOne(id)
		if (!publisher) {
			throw new NotFoundException('Publisher not found!')
		}
		return publisher
	}
}
