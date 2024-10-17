import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'

import { Warehouse } from './entities/warehouse.entity'

@Injectable()
export class WarehousesService extends TypeOrmCrudService<Warehouse> {
	constructor(@InjectRepository(Warehouse) repo: any) {
		super(repo)
	}
}
