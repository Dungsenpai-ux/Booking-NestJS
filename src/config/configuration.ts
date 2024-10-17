import { Environment, validate } from './configuration.validation'

export type AppConfiguration = {
	env: Environment
	port: number
	postgres_host: string
	postgres_port: number
	postgres_user: string
	postgres_password: string
	postgres_db: string
	minio_endpoint: string
	minio_port: number
	minio_access_key: string
	minio_secret_key: string
}

export default (): AppConfiguration => {
	const validateResult = validate(process.env)

	return {
		env: validateResult.NODE_ENV || Environment.Development,
		port: validateResult.PORT || 3000,
		postgres_host: validateResult.POSTGRES_HOST || 'localhost',
		postgres_port: validateResult.POSTGRES_PORT || 5432,
		postgres_user: validateResult.POSTGRES_USER || 'postgres',
		postgres_password: validateResult.POSTGRES_PASSWORD || 'password',
		postgres_db: validateResult.POSTGRES_DB || 'bookshelf',
		minio_endpoint: validateResult.MINIO_ENDPOINT || 'localhost',
		minio_port: validateResult.MINIO_PORT || 9000,
		minio_access_key: validateResult.MINIO_ACCESS_KEY || 'MwOdlzSxuabONGgRB7A3',
		minio_secret_key: validateResult.MINIO_SECRET_KEY || '6Ffoj7NdejAGJDN3MjIdSnKsAaaMJcrK1i0gP3Ct'
	}
}
