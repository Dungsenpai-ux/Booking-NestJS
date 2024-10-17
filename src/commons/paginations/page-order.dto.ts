import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsObject, IsOptional } from 'class-validator'
import { FieldOrderDto } from './field-order.dto'
import { FieldOrder } from './field-order.enum'

export class PageOrderDto {
	@ApiPropertyOptional({ type: String })
	@IsObject()
	@IsOptional()
	@Transform(({ value }) => {
		console.log('value :>> ', value)
		if (typeof value === 'string') {
			const fieldConfigs = value
				.split(',')
				.map(item => item.trim())
				.filter(item => item !== '')
			const fieldOrders: FieldOrderDto = fieldConfigs
				.map(fieldConfig => {
					const [field, order] = fieldConfig.split(' ')
					// if (order && Object.keys(FieldOrder).includes(order.toUpperCase())) {
					// 	return {
					// 		[field]: <FieldOrder>order.toLocaleLowerCase()
					// 	}
					// }

					return {
						[field]: <FieldOrder>order.toUpperCase()
					}
				})
				.filter(item => !!item)
				.reduce((prevObj, currentObj) => Object.assign(prevObj, currentObj), {})

			return fieldOrders
		}

		return {}
	})
	orders?: FieldOrderDto
}
