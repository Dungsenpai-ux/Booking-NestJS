import { Controller } from '@nestjs/common'
import { Crud, CrudController } from '@nestjsx/crud'
import { WarehousesService } from './warehouses.service'
import { Warehouse } from './entities/warehouse.entity'
import { ApiTags } from '@nestjs/swagger'
import { CreateWarehouseDto } from './dto/create-warehouse.dto'
import { UpdateWarehouseDto } from './dto/update-warehouse.dto'

@Crud({
	model: {
		type: Warehouse
	},
	dto: {
		create: CreateWarehouseDto,
		update: UpdateWarehouseDto
	}
})
@ApiTags('Warehouse')
@Controller('warehouses')
export class WarehousesController implements CrudController<Warehouse> {
	constructor(public service: WarehousesService) {}
}
