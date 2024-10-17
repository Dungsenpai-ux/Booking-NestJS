import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

export class SendEmailDto {
	@ApiProperty({
		description: 'The email to send'
	})
	@IsNotEmpty({ message: 'Email is required' })
	@IsEmail({}, { message: 'Invalid email format' })
	to: string

	@ApiProperty({
		description: 'The subject of email'
	})
	@IsString()
	@MinLength(1)
	@MaxLength(255)
	subject: string

	@ApiProperty({
		description: 'The text of email'
	})
	@IsString()
	@MinLength(1)
	@MaxLength(255)
	text: string
}
