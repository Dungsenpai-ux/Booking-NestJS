import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreateAuthorDto {
	@IsString({ message: 'Name must be a string' })
	@ApiProperty()
	name: string

	@IsString({ message: 'Description must be a string' })
	@ApiProperty()
	description: string
}
