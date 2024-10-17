import { TransformFnParams } from 'class-transformer'

export const transformArrayNumberToArray = ({ value }: TransformFnParams): number[] => {
	if (typeof value === 'string') {
		return value.split(',').map(item => parseInt(item))
	}

	return []
}
