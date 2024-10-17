import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateFileDto } from './dto/create-file.dto'
import { UpdateFileDto } from './dto/update-file.dto'
import * as fsAsync from 'node:fs/promises'
import * as fs from 'node:fs'
@Injectable()
export class FilesService {
	async uploadFileToFolder(
		resource: string,
		fileName: string,
		fileStream: Buffer
	): Promise<{ message: string; fileName: string }> {
		try {
			const url = `./uploads/${resource}`
			const path = `${url}/${fileName}`
			if (!fs.existsSync(url)) {
				fs.mkdirSync(url, { recursive: true })
			}
			await fsAsync.writeFile(path, fileStream)

			return {
				message: 'File uploaded successfully',
				fileName
			}
		} catch (error) {
			throw new BadRequestException(`Error uploading file: ${error}`)
		}
	}
}
