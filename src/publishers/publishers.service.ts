import { Injectable } from '@nestjs/common'
import { CreatePublisherDto } from './dto/create-publisher.dto'
import { UpdatePublisherDto } from './dto/update-publisher.dto'
import { Publisher } from './entities/publisher.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class PublishersService {
	constructor(@InjectRepository(Publisher) private publishersRepository: Repository<Publisher>) {}

	create(createPublisherDto: CreatePublisherDto): Promise<Publisher> {
		const newAuthor = this.publishersRepository.create(createPublisherDto)
		return this.publishersRepository.save(newAuthor)
	}

	findAll(): Promise<[Publisher[], number]> {
		return this.publishersRepository.findAndCount()
	}

	findOne(id: number): Promise<Publisher> {
		return this.publishersRepository.findOneBy({ id })
	}

	async update(id: number, updatePublisherDto: UpdatePublisherDto): Promise<Publisher> {
		await this.publishersRepository.update(id, updatePublisherDto)
		return this.findOne(id)
	}

	async remove(id: number): Promise<void> {
		await this.publishersRepository.delete(id)
	}
}
