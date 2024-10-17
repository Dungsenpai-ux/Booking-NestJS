import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Category } from './entities/category.entity'
import { In, Repository } from 'typeorm'
import { FindCategoryQueryDto } from './dto/find-category-query.dto'
import { Book } from '../books/entities/book.entity'

@Injectable()
export class CategoriesService {
	constructor(
		@InjectRepository(Category)
		private categoriesRepository: Repository<Category>
	) {}

	async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
		const { name, parentId } = createCategoryDto

		const newCategory = this.categoriesRepository.create({ name })

		if (parentId) {
			const existingParent = await this.findOne(parentId)

			if (!existingParent) throw new NotFoundException('Parent category not found!')

			newCategory.parent = existingParent
		}

		return this.categoriesRepository.save(newCategory)
	}

	async findAllTree(findCategoryQueryDto: FindCategoryQueryDto): Promise<Category[]> {
		// TODO Later: update filter utils
		let parentId = 0
		if (findCategoryQueryDto.parentId) {
			parentId = parseInt(findCategoryQueryDto.parentId as any)
		}
		if (parentId) {
			return this.categoriesRepository.findBy({ parentId: 1 })
		}

		const rootCategories = await this.categoriesRepository.manager.getTreeRepository(Category).findTrees({ relations: ['books'] })

		await this.calculateAmountBooksForAllCategories(rootCategories)

		return rootCategories
	}

	calculateAmountBooks(category: any): number {
		let totalBooks = category.books ? category.books.length : 0

		for (const child of category.children) {
			totalBooks += this.calculateAmountBooks(child)
		}

		category.amountBook = totalBooks
		return totalBooks
	}

	async calculateAmountBooksForAllCategories(rootCategories: Category[]): Promise<void> {
		for (const rootCategory of rootCategories) {
			this.calculateAmountBooks(rootCategory)
		}
	}

	findOne(id: number): Promise<Category | null> {
		return this.categoriesRepository.findOneBy({ id })
	}

	async findOneTree(category: Category): Promise<Category | null> {
		return this.categoriesRepository.manager.getTreeRepository(Category).findDescendantsTree(category)
	}

	async update(category: Category, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
		const updatedCategory: any = updateCategoryDto
		const parentId = updateCategoryDto.parentId
		if (parentId) {
			const existingParent = await this.findOne(parentId)

			if (!existingParent) throw new NotFoundException('Parent category not found!')

			updatedCategory.parent = existingParent
		}
		this.categoriesRepository.merge(category, updatedCategory)
		await this.categoriesRepository.save(updatedCategory)
		return this.findOneTree(category)
	}

	async remove(id: number): Promise<void> {
		await this.categoriesRepository.delete(id)
	}

	async findAllByIds(ids: number[]): Promise<Category[]> {
		return this.categoriesRepository.find({
			where: { id: In(ids) }
		})
	}
}
