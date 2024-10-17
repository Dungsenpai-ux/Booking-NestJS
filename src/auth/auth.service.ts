import { CustomersService } from './../customers/customers.service'
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { AccountsService } from '../accounts/accounts.service'
import { JwtService } from '@nestjs/jwt'
import { LoginAccountDto } from './dto/login-account.dto'
import { ConfigService } from '@nestjs/config'

class JwtPayload {
	username: string
	sub: number
	isLoginWeb?: boolean
}

class JwtToken {
	token: string
	ttl: number
}

class JwtTokenResponse {
	accessToken: JwtToken
	refreshToken: JwtToken
	accountId?: number
	customerId?: number
}

@Injectable()
export class AuthService {
	constructor(
		private readonly accountsService: AccountsService,
		private readonly jwtService: JwtService,
		private readonly customersService: CustomersService,
		private readonly configService: ConfigService
	) {}

	/**
	 * Logins auth service
	 * @param {LoginAccountDto} loginAccountDto
	 * @returns {Promise<JwtTokenResponse>}
	 * @memberof AuthService
	 * @example
	 * login({username: 'username', password: 'password'})
	 */
	async login(loginAccountDto: LoginAccountDto): Promise<JwtTokenResponse> {
		const { username, password } = loginAccountDto

		const acc = await this.accountsService.findByUsernameOrEmail(username)

		if (!acc) throw new NotFoundException('username or email do not exist')

		const isValid = acc.validPassword(password)
		if (!isValid) throw new UnauthorizedException('Invalid password')

		const payload: JwtPayload = { username: acc.username, sub: acc.id }

		const accessToken = this.signToken(payload, this.configService.get('JWT_EXPIRATION_TIME_ACCESS_TOKEN'))
		const refreshToken = this.signToken(payload, this.configService.get('JWT_EXPIRATION_TIME_REFRESH_TOKEN'))

		return {
			accessToken,
			refreshToken,
			accountId: acc.id
		}
	}

	/**
	 * Logins auth service for web as customer
	 * @param {LoginAccountDto} loginAccountDto
	 * @returns {Promise<JwtTokenResponse>}
	 * @memberof AuthService
	 * @example
	 * loginWeb({username: 'username', password: 'password'})
	 */
	async loginWeb(loginAccountDto: LoginAccountDto): Promise<JwtTokenResponse> {
		const { username, password } = loginAccountDto

		const customer = await this.customersService.findByUsernameOrEmail(username)

		if (!customer) throw new NotFoundException('username or email do not exist')

		const isValid = customer.validPassword(password)
		if (!isValid) throw new UnauthorizedException('Invalid password')

		const payload: JwtPayload = { username: customer.username, sub: customer.id, isLoginWeb: true }

		const accessToken = this.signToken(payload, this.configService.get('JWT_EXPIRATION_TIME_ACCESS_TOKEN'))
		const refreshToken = this.signToken(payload, this.configService.get('JWT_EXPIRATION_TIME_REFRESH_TOKEN'))

		return {
			accessToken,
			refreshToken,
			customerId: customer.id
		}
	}

	/**
	 * Get jwt expiration time in seconds
	 * @param {string} jwtExpirationTime
	 * @returns {number}
	 * @private
	 * @memberof AuthService
	 * @example
	 * getJwtExpirationTimeInSeconds('1d') // 86400
	 */
	getJwtExpirationTimeInSeconds(jwtExpirationTime: string) {
		const numDay = Number(jwtExpirationTime.substring(0, jwtExpirationTime.length - 1))
		return numDay * 24 * 3600
	}

	/**
	 * Sign token
	 * @param {*} payload
	 * @param {string} time
	 * @returns {{accessToken: string; ttl: number}}
	 * @private
	 * @memberof AuthService
	 * @example
	 * const payload = {username: 'username', sub: 1}
	 */
	signToken(payload: any, time: string): JwtToken {
		const token = this.jwtService.sign(payload, {
			secret: this.configService.get('JWT_SECRET'),
			expiresIn: time
		})

		const ttl = this.getJwtExpirationTimeInSeconds(time)

		return { token, ttl }
	}

	/**
	 * Verify token
	 * @param {string} token
	 * @returns {Promise<JwtPayload>}
	 * @memberof AuthService
	 * @example
	 * verifyToken('token')
	 * @todo
	 */
	async verifyToken(token: string): Promise<JwtPayload> {
		try {
			const payload = await this.jwtService.verifyAsync(token, {
				secret: this.configService.get('JWT_SECRET')
			})
			return { username: payload.username, sub: payload.sub, isLoginWeb: payload.isLoginWeb }
		} catch (error) {
			throw new UnauthorizedException('Invalid token')
		}
	}

	/**
	 * Refresh token
	 * @param {string} refreshToken
	 * @returns {Promise<JwtTokenResponse>}
	 * @memberof AuthService
	 * @example
	 * refreshToken('refreshToken')
	 * @todo
	 */
	async refreshToken(refreshToken: string): Promise<JwtTokenResponse> {
		const payload: JwtPayload = await this.verifyToken(refreshToken)
		const newAccessToken = this.signToken(payload, this.configService.get('JWT_EXPIRATION_TIME_ACCESS_TOKEN'))
		const newRefreshToken = this.signToken(payload, this.configService.get('JWT_EXPIRATION_TIME_REFRESH_TOKEN'))

		return {
			accessToken: newAccessToken,
			refreshToken: newRefreshToken
		}
	}

	/**
	 * Logout
	 * @param {string} refreshToken
	 * @returns {Promise<void>}
	 * @memberof AuthService
	 * @example
	 * logout('refreshToken')
	 * @todo
	 */
	async logout(refreshToken: string): Promise<string> {
		await this.verifyToken(refreshToken)

		return 'Logout successfully'
	}
}
