import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

export class CreateCommentDto {
	@IsString({ message: 'Content must be a string' })
	@ApiProperty()
	content: string

	@IsNumber()
	@ApiProperty()
	bookId: number
}
