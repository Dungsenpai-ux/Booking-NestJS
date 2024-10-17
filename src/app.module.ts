import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import configuration from './config/configuration'
import { DatabaseModule } from './database/database.module'
import { BooksModule } from './books/books.module'
import { CategoriesModule } from './categories/categories.module'
import { AccountsModule } from './accounts/accounts.module'
import { AuthModule } from './auth/auth.module'
import { MinioModule } from './minio/minio.module'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { OrdersModule } from './orders/orders.module'
import { CustomersModule } from './customers/customers.module'
import { WarehousesModule } from './warehouses/warehouses.module'
import { OrderBooksModule } from './orders/order-books/order-books.module'
import { WarehouseBooksModule } from './warehouses/warehouse-books/warehouse-books.module'
import { FilesModule } from './files/files.module'
import { CommentsModule } from './comments/comments.module'
import { AuthorsModule } from './authors/authors.module'
import { PublishersModule } from './publishers/publishers.module'
import { SectionsModule } from './sections/sections.module'
import { EmailModule } from './email/email.module'
import { MailerModule } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
// load data from .env file
import * as dotenv from 'dotenv'
dotenv.config()

console.log('process.env :>> ', process.env)

@Module({
	imports: [
		MailerModule.forRoot({
			transport: {
				host: process.env.EMAIL_SERVER_HOST,
				secure: false,
				auth: {
					user: process.env.EMAIL_USER,
					pass: process.env.EMAIL_PASSWORD
				}
			},
			defaults: {
				from: `"No Reply" <${process.env.EMAIL_USER}>`
			},
			template: {
				dir: join(__dirname, '/templates'),
				adapter: new HandlebarsAdapter(),
				options: {
					strict: true
				}
			}
		}),
		ServeStaticModule.forRoot({
			rootPath: join('uploads'),
			serveRoot: '/uploads'
		}),
		ConfigModule.forRoot({
			isGlobal: true,
			cache: true,
			load: [configuration]
		}),
		DatabaseModule,
		MinioModule,
		BooksModule,
		CategoriesModule,
		AccountsModule,
		AuthModule,
		OrdersModule,
		CustomersModule,
		WarehousesModule,
		OrderBooksModule,
		WarehouseBooksModule,
		FilesModule,
		CommentsModule,
		AuthorsModule,
		PublishersModule,
		SectionsModule,
		EmailModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
