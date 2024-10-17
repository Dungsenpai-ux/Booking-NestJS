import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, NotFoundException, UseGuards } from '@nestjs/common'
import { SectionsService } from './sections.service'
import { CreateSectionDto } from './dto/create-section.dto'
import { UpdateSectionDto } from './dto/update-section.dto'
import { Section } from './entities/section.entity'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@ApiTags('Section')
@ApiBearerAuth()
@Controller('sections')
export class SectionsController {
	constructor(private readonly sectionsService: SectionsService) {}

	@Post()
	@UseGuards(JwtAuthGuard)
	create(@Body() createSectionDto: CreateSectionDto): Promise<Section> {
		return this.sectionsService.create(createSectionDto)
	}

	@Get()
	async findAll(): Promise<{ data: Section[]; total: number }> {
		const rs: [Section[], number] = await this.sectionsService.findAll()
		return { data: rs[0], total: rs[1] }
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number): Promise<Section> {
		return this.checkSectionExist(id)
	}

	@Patch(':id')
	@UseGuards(JwtAuthGuard)
	async update(@Param('id', ParseIntPipe) id: number, @Body() updateSectionDto: UpdateSectionDto): Promise<Section> {
		await this.checkSectionExist(id)
		return this.sectionsService.update(id, updateSectionDto)
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard)
	async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
		await this.checkSectionExist(id)
		return this.sectionsService.remove(id)
	}

	private async checkSectionExist(id: number): Promise<Section> {
		const section = await this.sectionsService.findOne(id)
		if (!section) {
			throw new NotFoundException('Section not found!')
		}
		return section
	}
}
