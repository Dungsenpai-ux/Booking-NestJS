import { BadRequestException, Injectable } from '@nestjs/common'
import * as MinIo from 'minio'

@Injectable()
export class MinioService {
	private minIoClient: MinIo.Client
	private bucketName = process.env.MINIO_BUCKET_NAME

	constructor() {
		const endPoint = process.env.MINIO_ENDPOINT
		const port = process.env.MINIO_PORT
		const accessKey = process.env.MINIO_ACCESS_KEY
		const secretKey = process.env.MINIO_SECRET_KEY

		this.minIoClient = new MinIo.Client({
			endPoint,
			port: Number.parseInt(port),
			accessKey,
			secretKey,
			useSSL: false,
			pathStyle: true
		})
	}

	// Add methods to upload, download, and manage files on MinIO

	// Upload a file to MinIO
	public async uploadFile(
		fileName: string,
		fileStream: Buffer,
		fileSize: number,
		metaData: any
	): Promise<{ message: string; url: string }> {
		try {
			await this.minIoClient.putObject(this.bucketName, fileName, fileStream, fileSize, metaData)

			return {
				message: 'File uploaded successfully',
				url: `/${this.bucketName}/${fileName}`
			}
		} catch (error) {
			throw new BadRequestException(`Error uploading file: ${error}`)
		}
	}

	// Download a file from MinIO
	public async downloadFile(filePath: string, fileName: string, bucketName: string): Promise<string> {
		try {
			await this.minIoClient.fGetObject(bucketName, fileName, filePath)
			return 'File downloaded successfully'
		} catch (error) {
			throw new BadRequestException(`Error downloading file: ${error}`)
		}
	}

	// Remove a file from MinIO
	public async removeFile(fileName: string, bucketName: string): Promise<string> {
		try {
			await this.minIoClient.removeObject(bucketName, fileName)
			return 'File removed successfully'
		} catch (error) {
			return `Error removing file: ${error}`
		}
	}

	// List all files in a bucket
	public async listFiles(bucketName: string): Promise<string> {
		try {
			const files = await this.minIoClient.listObjects(bucketName, '', true)
			return JSON.stringify(files)
		} catch (error) {
			return `Error listing files: ${error}`
		}
	}

	// Create a bucket
	public async createBucket(bucketName: string): Promise<string> {
		try {
			await this.minIoClient.makeBucket(bucketName, 'us-east-1')
			return 'Bucket created successfully'
		} catch (error) {
			return `Error creating bucket: ${error}`
		}
	}

	// Remove a bucket
	public async removeBucket(bucketName: string): Promise<string> {
		try {
			await this.minIoClient.removeBucket(bucketName)
			return 'Bucket removed successfully'
		} catch (error) {
			return `Error removing bucket: ${error}`
		}
	}

	// Get bucket policy
	public async getBucketPolicy(bucketName: string): Promise<string> {
		try {
			const policy = await this.minIoClient.getBucketPolicy(bucketName)
			return policy
		} catch (error) {
			return `Error getting bucket policy: ${error}`
		}
	}

	// Set bucket policy
	public async setBucketPolicy(bucketName: string, policy: string): Promise<string> {
		try {
			await this.minIoClient.setBucketPolicy(bucketName, policy)
			return 'Bucket policy set successfully'
		} catch (error) {
			return `Error setting bucket policy: ${error}`
		}
	}
}
