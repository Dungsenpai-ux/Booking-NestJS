import { Injectable } from '@nestjs/common'
import { SendEmailDto } from './dto/send-email.dto'
import { MailerService } from '@nestjs-modules/mailer'

@Injectable()
export class EmailService {
	constructor(private readonly mailerService: MailerService) {}

	public sendMail(sendEmailDto: SendEmailDto): Promise<any> {
		return this.mailerService.sendMail({
			...sendEmailDto,
			headers: {
				priority: 'high'
			},
			template: 'welcome',
			context: {
				name: sendEmailDto.to
			}
		})
	}
}
