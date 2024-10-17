import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger, ValidationPipe } from '@nestjs/common'
import helmet from 'helmet'
import SetupSwagger, { exportAPISpec } from './app.swagger'
import { ConfigService } from '@nestjs/config/dist/config.service'
import { Environment } from './config/configuration.validation'
import passport from 'passport'

async function bootstrap() {
	const whitelist = [
		'http://localhost:3000',
		'http://localhost:3001',
		'http://localhost:5173',
		'https://cms.bookself.serendipitylife.site',
		'https://web.bookself.serendipitylife.site'
	]
	const app = await NestFactory.create(AppModule)
	app.setGlobalPrefix('api')
	const configService = app.get(ConfigService)
	const env = configService.get<string>('env')
	const port = configService.get<number>('port')

	app.use(passport.initialize())

	// app.use(helmet())
	app.enableCors({
		origin: function (origin, callback) {
			// console.log('origin', origin);

			if (!origin || whitelist.indexOf(origin) !== -1) {
				callback(null, true)
			} else {
				callback(new Error('Not allowed by CORS'))
			}
		}
	})
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
			forbidNonWhitelisted: true,
			transformOptions: {
				enableImplicitConversion: true
			}
		})
	)
	const document = SetupSwagger('explorer', app)
	if (env === Environment.Development) {
		await exportAPISpec(document)
	}

	// create upload folder
	checkUploadFolderExist()

	await app.listen(port)
}
bootstrap().catch(error => {
	Logger.log('Error on bootstrap ', error)
})
function checkUploadFolderExist() {
	// if not exist folder uploads/book/thumbnail, uploads/book/pdf, uploads/book/image, create it

	const fs = require('fs'),
		dir = './uploads',
		dirBook = './uploads/books'

	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir)
	}
	if (!fs.existsSync(dirBook)) {
		fs.mkdirSync(dirBook)
	}
}
