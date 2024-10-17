import { Module } from '@nestjs/common'
import { BooksService } from './books.service'
import { BooksController } from './books.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Book } from './entities/book.entity'
import { CategoriesModule } from '../categories/categories.module'
import { BookCategory } from './entities/book-category.entity'
import { MinioModule } from '../minio/minio.module'
import { AuthorsModule } from '../authors/authors.module'
import { PublishersModule } from '../publishers/publishers.module'

@Module({
	imports: [TypeOrmModule.forFeature([Book, BookCategory]), CategoriesModule, MinioModule, AuthorsModule, PublishersModule],
	controllers: [BooksController],
	providers: [BooksService],
	exports: [BooksService]
})
export class BooksModule {}
