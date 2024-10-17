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
	Query
} from '@nestjs/common'
import { CategoriesService } from './categories.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { Category } from './entities/category.entity'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { FindCategoryQueryDto } from './dto/find-category-query.dto'

@ApiTags('Category')
@Controller('categories')
@ApiBearerAuth()
export class CategoriesController {
	constructor(private readonly categoriesService: CategoriesService) {}

	@Post()
	@UseGuards(JwtAuthGuard)
	create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
		return this.categoriesService.create(createCategoryDto)
	}

	@Get()
	async findAll(@Query() findCategoryQueryDto: FindCategoryQueryDto): Promise<{ data: Category[]; total: number }> {
		const rs: Category[] = await this.categoriesService.findAllTree(findCategoryQueryDto)
		return { data: rs, total: rs.length }
	}

	@Get(':id')
	async findOne(@Param('id', ParseIntPipe) id: number): Promise<Category> {
		const category = await this.checkCategoryExist(id)
		return this.categoriesService.findOneTree(category)
	}

	@Patch(':id')
	@UseGuards(JwtAuthGuard)
	async update(@Param('id', ParseIntPipe) id: number, @Body() updateCategoryDto: UpdateCategoryDto): Promise<Category> {
		const category = await this.checkCategoryExist(id)
		return this.categoriesService.update(category, updateCategoryDto)
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard)
	async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
		await this.checkCategoryExist(id)
		return this.categoriesService.remove(id)
	}

	private async checkCategoryExist(id: number): Promise<Category> {
		const category = await this.categoriesService.findOne(id)
		if (!category) {
			throw new NotFoundException('Category not found!')
		}
		return category
	}
}
