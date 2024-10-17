import { plainToInstance } from 'class-transformer'
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator'

export enum Environment {
	Development = 'development',
	Production = 'production'
}

export class AppConfiguration {
	@IsEnum(Environment)
	NODE_ENV: Environment

	@IsNumber()
	PORT: number

	@IsString()
	POSTGRES_HOST: string

	@IsNumber()
	POSTGRES_PORT: number

	@IsString()
	POSTGRES_USER: string

	@IsString()
	POSTGRES_PASSWORD: string

	@IsString()
	POSTGRES_DB: string

	@IsString()
	MINIO_ENDPOINT: string

	@IsNumber()
	MINIO_PORT: number

	@IsString()
	MINIO_ACCESS_KEY: string

	@IsString()
	MINIO_SECRET_KEY: string
}

export function validate(config: Record<string, unknown>) {
	const validatedConfig = plainToInstance(AppConfiguration, config, { enableImplicitConversion: true })
	const errors = validateSync(validatedConfig, { skipMissingProperties: false })

	if (errors.length > 0) {
		throw new Error(errors.toString())
	}

	return validatedConfig
}
