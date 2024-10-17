import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { AccountsModule } from '../accounts/accounts.module'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './jwt.strategy'
import { AuthController } from './auth.controller'
import { CustomersModule } from '../customers/customers.module'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
	imports: [
		AccountsModule,
		CustomersModule,
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				secret: configService.get('JWT_SECRET'),
				signOptions: {
					expiresIn: configService.get('JWT_EXPIRATION_TIME_ACCESS_TOKEN')
				}
			})
		})
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy],
	exports: [AuthService]
})
export class AuthModule {}
