import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { LoginAccountDto, RefreshTokenDto } from './dto/login-account.dto'
import { AuthService } from './auth.service'

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	login(@Body() loginAccountDto: LoginAccountDto) {
		return this.authService.login(loginAccountDto)
	}

	@Post('/web/login')
	loginWeb(@Body() loginAccountDto: LoginAccountDto) {
		return this.authService.loginWeb(loginAccountDto)
	}

	@Post('/refresh-token')
	refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
		return this.authService.refreshToken(refreshTokenDto.refreshToken)
	}

	@Post('/web/refresh-token')
	refreshTokenWeb(@Body() refreshTokenDto: RefreshTokenDto) {
		return this.authService.refreshToken(refreshTokenDto.refreshToken)
	}

	@Post('/logout')
	logout(@Body() refreshTokenDto: RefreshTokenDto) {
		return this.authService.logout(refreshTokenDto.refreshToken)
	}
}
