import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, MinLength, MaxLength, IsOptional, IsPhoneNumber, IsNotEmpty, IsString, IsNumber } from 'class-validator'

export class CreateCustomerDto {
	@IsString({ message: 'Email must be a string' })
	@IsEmail({}, { message: 'Invalid email format' })
	@IsOptional()
	@ApiProperty()
	email?: string

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
	@IsString({ message: 'User name must be a string' })
	@IsOptional()
	@ApiProperty()
	username?: string

	@MinLength(3)
	@MaxLength(255)
	@IsString({ message: 'Password must be a string' })
	@IsOptional()
	@ApiProperty()
	password?: string

	@IsNotEmpty({ message: 'Phone is required' })
	// @IsPhoneNumber(null, { message: 'Invalid phone number format' })
	@ApiProperty()
	@IsString()
	phone: string

	@MinLength(3)
	@MaxLength(255)
	@IsNotEmpty({ message: 'Address is required' })
	@IsString({ message: 'Address name must be a string' })
	@ApiProperty()
	address: string

	@MinLength(3)
	@MaxLength(255)
	@IsNotEmpty({ message: 'Province is required' })
	@IsString({ message: 'Province name must be a string' })
	@ApiProperty()
	province: string

	@MinLength(3)
	@MaxLength(255)
	@IsNotEmpty({ message: 'District is required' })
	@IsString({ message: 'District name must be a string' })
	@ApiProperty()
	district: string

	@MinLength(3)
	@MaxLength(255)
	@IsNotEmpty({ message: 'Street is required' })
	@IsString({ message: 'Street name must be a string' })
	@ApiProperty()
	street: string

	@ApiPropertyOptional({ type: Number })
	@IsNumber({}, { message: 'Zip code must be a number' })
	@IsOptional()
	zipCode?: number
}
