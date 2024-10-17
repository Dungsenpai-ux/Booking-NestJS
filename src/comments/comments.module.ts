import { Module } from '@nestjs/common'
import { CommentsService } from './comments.service'
import { CommentsController } from './comments.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CustomersModule } from '../customers/customers.module'
import { BooksModule } from '../books/books.module'
import { Comment } from './entities/comment.entity'

@Module({
	imports: [TypeOrmModule.forFeature([Comment]), CustomersModule, BooksModule],
	controllers: [CommentsController],
	providers: [CommentsService],
	exports: [CommentsService]
})
export class CommentsModule {}
