import { Injectable } from '@nestjs/common'
import { CreateSectionDto } from './dto/create-section.dto'
import { UpdateSectionDto } from './dto/update-section.dto'
import { Section } from './entities/section.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class SectionsService {
	constructor(@InjectRepository(Section) private sectionsRepository: Repository<Section>) {}

	create(createSectionDto: CreateSectionDto): Promise<Section> {
		const newSection = this.sectionsRepository.create(createSectionDto)
		return this.sectionsRepository.save(newSection)
	}

	findAll(): Promise<[Section[], number]> {
		return this.sectionsRepository.findAndCount()
	}

	findOne(id: number): Promise<Section> {
		return this.sectionsRepository.findOneBy({ id })
	}

	async update(id: number, updateSectionDto: UpdateSectionDto): Promise<Section> {
		await this.sectionsRepository.update(id, updateSectionDto)
		return this.findOne(id)
	}

	async remove(id: number): Promise<void> {
		await this.sectionsRepository.delete(id)
	}
}
