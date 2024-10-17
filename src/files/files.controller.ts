import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	UseInterceptors,
	UploadedFile,
	UnsupportedMediaTypeException,
	Res,
	Query
} from '@nestjs/common'
import { FilesService } from './files.service'
import { CreateFileDto } from './dto/create-file.dto'
import { UpdateFileDto } from './dto/update-file.dto'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import { Response } from 'express'

@ApiTags('Files')
@Controller('files')
export class FilesController {
	constructor(private readonly filesService: FilesService) {}

	@Get(':container/download')
	getFile(@Param('container') container: string, @Res() response: Response, @Query('file') file: string) {
		return response.sendFile(file, { root: `./uploads/${container}` })
	}

	@Post(':resource/upload')
	// @UseGuards(JwtAuthGuard)
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(FileInterceptor('file'))
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
	async uploadThumbnail(@UploadedFile() file: Express.Multer.File, @Param('resource') resource: string) {
		// Only image file is allowed!
		if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)) {
			throw new UnsupportedMediaTypeException('Only image file is allowed!')
		}

		const fileName = `${Date.now()}-${file.originalname}`,
			fileStream = file.buffer,
			fileSize = file.size,
			metaData = {
				'Content-Type': file.mimetype
			}

		// const uploadFileRes: {
		// 	message: string
		// 	url: string
		// } = await this.minioService.uploadFile(fileName, fileStream, fileSize, metaData)

		// upload to folder upload on server without minio
		const uploadFileRes: {
			message: string
			fileName: string
		} = await this.filesService.uploadFileToFolder(resource, fileName, fileStream)

		return {
			message: 'File uploaded successfully',
			fileName: uploadFileRes.fileName
		}
	}
}
