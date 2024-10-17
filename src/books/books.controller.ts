import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	ParseIntPipe,
	NotFoundException,
	UseGuards,
	UploadedFile,
	UseInterceptors,
	UploadedFiles,
	UnsupportedMediaTypeException,
	Query
} from '@nestjs/common'
import { BooksService } from './books.service'
import { CreateBookDto } from './dto/create-book.dto'
import { UpdateBookDto } from './dto/update-book.dto'
import { Book } from './entities/book.entity'
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { MinioService } from '../minio/minio.service'
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express'
import { FindBookQueryDto } from './dto/find-book-query.dto'
import { FindBookStatic } from './dto/find-book-static.enum'

@ApiTags('Book')
@Controller('books')
@ApiBearerAuth()
export class BooksController {
	constructor(private readonly booksService: BooksService, private readonly minioService: MinioService) {}

	@Post()
	@UseGuards(JwtAuthGuard)
	create(@Body() createBookDto: CreateBookDto): Promise<Book> {
		return this.booksService.create(createBookDto)
	}

	@Get()
	async findAll(@Query() findBookQueryDto: FindBookQueryDto): Promise<{ data: Book[]; total: number }> {
		const rs: [Book[], number] = await this.booksService.findAll(findBookQueryDto)
		return { data: rs[0], total: rs[1] }
	}

	@Get('static')
	async findBooksPopular(): Promise<any> {
		const rs = await this.booksService.findBookStatic()
		return { data: rs }
	}

	@Get('suggestions')
	async findBooksSuggestion(@Query() findBookQueryDto: FindBookQueryDto): Promise<any> {
		const rs = await this.booksService.findBookSuggestion(findBookQueryDto)
		return { data: rs }
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number): Promise<Book> {
		return this.checkBookExist(id)
	}

	@Patch(':id')
	@UseGuards(JwtAuthGuard)
	async update(@Param('id', ParseIntPipe) id: number, @Body() updateBookDto: UpdateBookDto): Promise<Book> {
		await this.checkBookExist(id)
		return this.booksService.update(id, updateBookDto)
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard)
	async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
		await this.checkBookExist(id)
		return this.booksService.remove(id)
	}

	private async checkBookExist(id: number): Promise<Book> {
		const book = await this.booksService.findOne(id)
		if (!book) {
			throw new NotFoundException('Book not found!')
		}
		return book
	}

	@Post('upload-thumbnail')
	@UseGuards(JwtAuthGuard)
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(FileInterceptor('thumbnail'))
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				thumbnail: {
					type: 'string',
					format: 'binary'
				}
			}
		}
	})
	async uploadThumbnail(@UploadedFile() thumbnail: Express.Multer.File) {
		// Only image file is allowed!
		if (!['image/png', 'image/jpg', 'image/jpeg'].includes(thumbnail.mimetype)) {
			throw new UnsupportedMediaTypeException('Only image file is allowed!')
		}

		const fileName = `book/thumbnail/${Date.now()}-${thumbnail.originalname}`,
			fileStream = thumbnail.buffer,
			fileSize = thumbnail.size,
			metaData = {
				'Content-Type': thumbnail.mimetype
			}

		// const uploadFileRes: {
		// 	message: string
		// 	url: string
		// } = await this.minioService.uploadFile(fileName, fileStream, fileSize, metaData)

		// upload to folder upload on server without minio
		const uploadFileRes: {
			message: string
			url: string
		} = await this.booksService.uploadFileToFolder(fileName, fileStream)

		return {
			message: 'Thumbnail uploaded successfully',
			url: uploadFileRes.url
		}
	}

	@Post('upload-pdf')
	@UseGuards(JwtAuthGuard)
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(FileInterceptor('pdf'))
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				pdf: {
					type: 'string',
					format: 'binary'
				}
			}
		}
	})
	async uploadPdf(@UploadedFile() pdf: Express.Multer.File) {
		// Only pdf file is allowed!
		if (pdf.mimetype !== 'application/pdf') {
			throw new UnsupportedMediaTypeException('Only pdf file is allowed!')
		}

		const fileName = `book/pdf/${Date.now()}-${pdf.originalname}`,
			fileStream = pdf.buffer,
			fileSize = pdf.size,
			metaData = {
				'Content-Type': pdf.mimetype
			}

		// const uploadFileRes: {
		// 	message: string
		// 	url: string
		// } = await this.minioService.uploadFile(fileName, fileStream, fileSize, metaData)

		// upload to folder upload on server without minio
		const uploadFileRes: {
			message: string
			url: string
		} = await this.booksService.uploadFileToFolder(fileName, fileStream)

		return {
			message: 'Pdf uploaded successfully',
			url: uploadFileRes.url
		}
	}

	@Post('upload-images')
	@UseGuards(JwtAuthGuard)
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 10 }]))
	@ApiBody({
		description: 'Array of image files',
		type: 'object',
		schema: {
			type: 'object',
			properties: {
				images: {
					type: 'array',
					items: {
						type: 'string',
						format: 'binary'
					}
				}
			}
		}
	})
	async uploadImages(@UploadedFiles() files: Record<string, Express.Multer.File[]>) {
		// Only image file is allowed!
		const isInvalid = files.images.some(image => !['image/png', 'image/jpg', 'image/jpeg'].includes(image.mimetype))
		if (isInvalid) {
			throw new UnsupportedMediaTypeException('Only image file is allowed!')
		}

		const uploadFileRes = files.images.map(image => {
			const fileName = `book/image/${Date.now()}-${image.originalname}`,
				fileStream = image.buffer,
				fileSize = image.size,
				metaData = {
					'Content-Type': image.mimetype
				}

			// return this.minioService.uploadFile(fileName, fileStream, fileSize, metaData)

			return this.booksService.uploadFileToFolder(fileName, fileStream)
		})

		const urls = (await Promise.all(uploadFileRes)).map(url => url.url)

		return {
			message: 'Images uploaded successfully',
			url: urls
		}
	}
}
