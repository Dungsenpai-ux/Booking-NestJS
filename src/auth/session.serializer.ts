import { Injectable } from '@nestjs/common'
import { PassportSerializer } from '@nestjs/passport'

@Injectable()
export class SessionSerializer extends PassportSerializer {
	serializeUser(acc: any, done: (err: Error, acc: any) => void): void {
		done(null, { id: acc.id, username: acc.username })
	}

	deserializeUser(payload: any, done: (err: Error, payload: string) => void): void {
		done(null, payload)
	}
}
