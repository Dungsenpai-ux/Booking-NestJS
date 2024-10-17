import * as fs from 'fs/promises'
import path from 'path'
import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger'

import { name as apiName, description as apiDescription, version as apiVersion } from '../package.json'

export default function SetupSwagger(apiPath: string, app: INestApplication) {
	const swaggerConfig = new DocumentBuilder()
		.setTitle(apiName)
		.setDescription(apiDescription)
		.setVersion(apiVersion)
		.addBearerAuth()
		.build()
	const document = SwaggerModule.createDocument(app, swaggerConfig)
	SwaggerModule.setup(apiPath, app, document)

	return document
}

export async function exportAPISpec(document: OpenAPIObject) {
	/* eslint-disable-next-line unicorn/prefer-module */
	const codegenDir = path.join(__dirname, '/../../codegen')

	let isDirectoryExisted = false
	try {
		const dirStat = await fs.lstat(codegenDir)
		if (dirStat.isDirectory()) {
			isDirectoryExisted = true
		}
	} catch {
		// DO NOTHING
	}

	if (!isDirectoryExisted) {
		await fs.mkdir(codegenDir)
	}

	await fs.writeFile(path.join(codegenDir, 'api.json'), JSON.stringify(document, undefined, 2))
}
