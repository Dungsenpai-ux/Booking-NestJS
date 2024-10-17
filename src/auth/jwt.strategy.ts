import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { AccountsService } from '../accounts/accounts.service'
import { CustomersService } from '../customers/customers.service'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly configService: ConfigService,
		private readonly accountsService: AccountsService,
		private readonly customersService: CustomersService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: configService.get('JWT_SECRET'),
			ignoreExpiration: false
		})
	}

	async validate(payload: any) {
		if (payload.isLoginWeb) {
			const customer = await this.customersService.findByUsernameOrEmail(payload.username)
			if (customer) return customer.toJSON()
			throw new UnauthorizedException()
		} else {
			const acc = await this.accountsService.findByUsernameOrEmail(payload.username)
			if (acc) return acc.toJSON()
			throw new UnauthorizedException()
		}
	}
}
