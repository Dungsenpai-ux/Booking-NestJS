import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class LoginAccountDto {
	@ApiProperty()
	@IsString()
	username: string

	@ApiProperty()
	@IsString()
	password: string
}

export class RefreshTokenDto {
	@ApiProperty()
	@IsString()
	refreshToken: string
}
