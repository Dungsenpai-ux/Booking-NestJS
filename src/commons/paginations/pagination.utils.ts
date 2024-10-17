import { ClassConstructor, plainToInstance } from 'class-transformer'
// import { PaginateOptions, PipelineStage } from 'mongoose'
import { PageOptionsDto } from './page-options.dto'

export class PaginationUtils {
	// static queryToPaginateOptionsMapper(query: PageOptionsDto): PaginateOptions {
	// 	// TODO: Update paginateOptions
	// 	// paginate options builder
	// 	// const options: PaginateOptions = {
	// 	// 	DONE page: 1, // Client request
	// 	// 	DONE limit: 10, // Client request
	// 	// 	DONE pagination: true, // Client request => Should be based on page and limit
	// 	// 	DONE select: undefined, // Client request
	// 	// 	populate: undefined, // => Fixed from API
	// 	// 	DONE sort: undefined // Client request
	// 	// }
	// 	const { page, limit, select, orders } = query
	// 	const pagination = page > 0 && limit > 0
	// 	return {
	// 		page,
	// 		limit,
	// 		pagination,
	// 		select,
	// 		sort: orders
	// 	}
	// }
	// static queryToFilterMapper<T>(filterModel: ClassConstructor<T>, query: unknown) {
	// 	const filterInstance = plainToInstance(filterModel, query, {
	// 		excludeExtraneousValues: true,
	// 		exposeUnsetFields: false
	// 	})
	// 	const filter = Object.keys(filterInstance)
	// 		.map(key => {
	// 			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	// 			const value = query[key]
	// 			if (typeof value === 'object' && Array.isArray(value)) {
	// 				const conditions = value.map(condition => {
	// 					switch (typeof condition) {
	// 						case 'string': {
	// 							return new RegExp(`${condition}`, 'i')
	// 						}
	// 						default: {
	// 							return <unknown>condition
	// 						}
	// 					}
	// 				})
	// 				if (conditions.length > 0) {
	// 					return { [key]: { $in: conditions } }
	// 				}
	// 				return { [key]: undefined }
	// 			}
	// 			switch (typeof value) {
	// 				case 'string': {
	// 					return { [key]: new RegExp(`${value}`, 'i') }
	// 				}
	// 				case 'number': {
	// 					return { [key]: value }
	// 				}
	// 				default: {
	// 					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	// 					return { [key]: value }
	// 				}
	// 			}
	// 		})
	// 		.reduce((preObj, currentObj) => Object.assign(preObj, currentObj), {})
	// 	// Remove undefined and null value
	// 	Object.keys(filter).forEach(key => {
	// 		if (!filter[key]) {
	// 			delete filter[key]
	// 		}
	// 	})
	// 	return filter
	// }
	// static filterResultByUniqueField<T>(uniqueField: string, docs: Array<T>): [number, Array<T>] {
	// 	const uniqueDocs: Array<T> = []
	// 	const uniqueValueSet = new Set()
	// 	docs.forEach(item => {
	// 		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	// 		const uniqueFieldValue = item[uniqueField]
	// 		if (uniqueFieldValue && uniqueValueSet.has(uniqueFieldValue)) {
	// 			// Do nothing
	// 		}
	// 		if (uniqueFieldValue && !uniqueValueSet.has(uniqueFieldValue)) {
	// 			uniqueDocs.push(item)
	// 			uniqueValueSet.add(uniqueFieldValue)
	// 		}
	// 	})
	// 	const uniqueDocsCount = uniqueDocs.length
	// 	return [uniqueDocsCount, uniqueDocs]
	// }
	// static queryToAggregatePaginateOptionsMapper(query: PageOptionsDto): PaginateOptions {
	// 	// TODO: Update paginateOptions
	// 	// paginate options builder
	// 	const { page, limit, orders } = query
	// 	const pagination = page > 0 && limit > 0
	// 	return {
	// 		page,
	// 		limit,
	// 		pagination,
	// 		sort: orders
	// 	}
	// }
	// static queryToAggregateProjectStage(query: PageOptionsDto): PipelineStage {
	// 	const { select } = query
	// 	if (!select) {
	// 		return undefined
	// 	}
	// 	const projection = select
	// 		.map(field => ({ [field]: 1 }))
	// 		.reduce((prevObj, currentObj) => Object.assign(prevObj, currentObj), { _id: 0 })
	// 	return {
	// 		$project: projection
	// 	}
	// }
}
