import { Module } from '@nestjs/common'
import { PublishersService } from './publishers.service'
import { PublishersController } from './publishers.controller'
import { Publisher } from './entities/publisher.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
	imports: [TypeOrmModule.forFeature([Publisher])],
	controllers: [PublishersController],
	providers: [PublishersService],
	exports: [PublishersService]
})
export class PublishersModule {}
