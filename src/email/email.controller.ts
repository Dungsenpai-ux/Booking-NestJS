import { Controller, Post, Body, BadRequestException } from '@nestjs/common'
import { EmailService } from './email.service'
import { ApiTags } from '@nestjs/swagger'
import { SendEmailDto } from './dto/send-email.dto'

@ApiTags('Email')
@Controller('emails')
export class EmailController {
	constructor(private readonly emailService: EmailService) {}

	@Post('send')
	async sendEmail(@Body() sendEmailDto: SendEmailDto): Promise<string> {
		try {
			this.emailService.sendMail(sendEmailDto).then()

			return 'Email sent successfully'
		} catch (error) {
			throw new BadRequestException(error)
		}
	}
}
