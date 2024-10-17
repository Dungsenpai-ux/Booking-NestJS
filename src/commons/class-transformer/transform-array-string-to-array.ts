import { TransformFnParams } from 'class-transformer'

export const transformArrayStringToArray = ({ value }: TransformFnParams): string[] => {
	if (typeof value === 'string') {
		return value
			.split(',')
			.map(item => item.trim())
			.filter(item => item !== '')
	}

	return []
}
