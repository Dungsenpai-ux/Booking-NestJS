import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
	MinLength,
	MaxLength,
	IsOptional,
	IsArray,
	ArrayMinSize,
	ValidateNested,
	IsPositive,
	IsNumber,
	IsEmail,
	IsNotEmpty,
	IsString,
	IsObject
} from 'class-validator'
import { CreateCustomerDto } from '../../customers/dto/create-customer.dto'
import { Type } from 'class-transformer'

class CartItemDto {
	@ApiProperty()
	@IsNumber()
	bookId: number

	@ApiProperty()
	@IsPositive()
	@IsNumber()
	count: number
}

class DeliveryAddressDto {
	@ApiProperty()
	@IsString({ message: 'Province must be a string' })
	@IsNotEmpty({ message: 'Province is required' })
	province: string

	@ApiProperty()
	@IsString({ message: 'District must be a string' })
	@IsNotEmpty({ message: 'District is required' })
	district: string

	@ApiProperty()
	@IsString({ message: 'Street must be a string' })
	@IsNotEmpty({ message: 'Street is required' })
	street: string

	@ApiProperty()
	@IsString({ message: 'Address must be a string' })
	@IsNotEmpty({ message: 'Address is required' })
	address: string

	@ApiPropertyOptional({ type: Number })
	@IsNumber({}, { message: 'Zip code must be a number' })
	@IsOptional()
	zipCode?: number
}

class CustomerOrderDto {
	@IsString({ message: 'Email must be a string' })
	@IsEmail({}, { message: 'Invalid email format' })
	@IsNotEmpty({ message: 'Email is required' })
	@ApiProperty()
	email: string

	@MinLength(3, { message: 'First name must be at least 3 characters' })
	@MaxLength(255, { message: 'First name must be at most 255 characters' })
	@IsNotEmpty({ message: 'First name is required' })
	@IsString({ message: 'First name must be a string' })
	@ApiProperty()
	firstName: string

	@MinLength(3, { message: 'Last name must be at least 3 characters' })
	@MaxLength(255, { message: 'Last name must be at most 255 characters' })
	@IsNotEmpty({ message: 'Last name is required' })
	@IsString({ message: 'Last name must be a string' })
	@ApiProperty()
	lastName: string

	@IsNotEmpty({ message: 'Phone is required' })
	// @IsPhoneNumber(null, { message: 'Invalid phone number format' })
	@ApiProperty()
	@IsString({ message: 'Phone must be a string' })
	phone: string
}

export class CreateOrderDto {
	@MinLength(3)
	@MaxLength(255)
	@IsOptional()
	@ApiPropertyOptional()
	note?: string

	@ApiProperty({ type: CustomerOrderDto })
	@Type(() => CustomerOrderDto)
	@IsObject({ message: 'Customer must be an object' })
	customer: CustomerOrderDto

	@ApiProperty({ type: [CartItemDto] })
	@IsArray()
	@ArrayMinSize(1)
	@ValidateNested({ each: true })
	@Type(() => CartItemDto)
	books: CartItemDto[]

	@ApiProperty({
		type: 'jsonb',
		nullable: true,
		example: {
			province: 'Example Province',
			district: 'Example District',
			street: '123 Main St',
			address: 'Example Address',
			code: '123456'
		}
	})
	@IsObject({ message: 'Delivery address must be an object' })
	deliveryAddress: DeliveryAddressDto
}
