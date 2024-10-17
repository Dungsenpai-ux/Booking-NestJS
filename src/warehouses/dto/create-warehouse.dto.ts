import { ApiProperty } from '@nestjs/swagger'
import { MinLength, MaxLength, IsNotEmpty, IsString, IsPhoneNumber, IsOptional } from 'class-validator'

export class CreateWarehouseDto {
	@MinLength(3)
	@MaxLength(255)
	@IsNotEmpty({ message: 'Name is required' })
	@IsString({ message: 'Name must be a string' })
	@ApiProperty()
	name: string

	@IsNotEmpty({ message: 'Phone is required' })
	@IsPhoneNumber(null, { message: 'Invalid phone number format' })
	@ApiProperty()
	phone: string

	@MinLength(3)
	@MaxLength(255)
	@IsOptional()
	@IsString({ message: 'Code must be a string' })
	@ApiProperty()
	code?: string

	@MinLength(3)
	@MaxLength(255)
	@IsNotEmpty({ message: 'Address is required' })
	@IsString({ message: 'Address must be a string' })
	@ApiProperty()
	address: string
}
