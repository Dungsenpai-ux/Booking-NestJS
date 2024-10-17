import { ApiProperty } from '@nestjs/swagger'
import { IsString, MinLength, MaxLength, IsEmail, IsPhoneNumber, IsNotEmpty } from 'class-validator'

export class CreateAccountDto {
	@IsNotEmpty({ message: 'Email is required' })
	@IsString({ message: 'Email must be a string' })
	@IsEmail({}, { message: 'Invalid email format' })
	@ApiProperty()
	email: string

	@MinLength(3)
	@MaxLength(255)
	@IsNotEmpty({ message: 'First name is required' })
	@IsString({ message: 'First name must be a string' })
	@ApiProperty()
	firstName: string

	@MinLength(3)
	@MaxLength(255)
	@IsNotEmpty({ message: 'Last name is required' })
	@IsString({ message: 'Last name must be a string' })
	@ApiProperty()
	lastName: string

	@MinLength(3)
	@MaxLength(255)
	@IsNotEmpty({ message: 'User name is required' })
	@IsString({ message: 'User name must be a string' })
	@ApiProperty()
	username: string

	@MinLength(3)
	@MaxLength(255)
	@IsNotEmpty({ message: 'Password is required' })
	@IsString({ message: 'Password must be a string' })
	@ApiProperty()
	password: string

	@IsNotEmpty({ message: 'Phone is required' })
	@IsPhoneNumber(null, { message: 'Invalid phone number format' })
	@ApiProperty()
	phone: string

	// @IsNumber()
	// @Min(1)
	// @ApiProperty()
	// @IsOptional()
	// roleId?: number
}
