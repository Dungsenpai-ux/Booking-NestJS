import { Injectable } from '@nestjs/common'
import { CreateAuthorDto } from './dto/create-author.dto'
import { UpdateAuthorDto } from './dto/update-author.dto'
import { Author } from './entities/author.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class AuthorsService {
	constructor(@InjectRepository(Author) private authorsRepository: Repository<Author>) {}

	create(createAuthorDto: CreateAuthorDto): Promise<Author> {
		const newAuthor = this.authorsRepository.create(createAuthorDto)
		return this.authorsRepository.save(newAuthor)
	}

	findAll(): Promise<[Author[], number]> {
		return this.authorsRepository.findAndCount()
	}

	findOne(id: number): Promise<Author> {
		return this.authorsRepository.findOneBy({ id })
	}

	async update(id: number, updateAuthorDto: UpdateAuthorDto): Promise<Author> {
		await this.authorsRepository.update(id, updateAuthorDto)
		return this.findOne(id)
	}

	async remove(id: number): Promise<void> {
		await this.authorsRepository.delete(id)
	}
}
