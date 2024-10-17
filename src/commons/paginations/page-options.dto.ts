import { IntersectionType } from '@nestjs/swagger'
import { PagePaginationDto } from './page-pagination.dto'
import { PageOrderDto } from './page-order.dto'

export class PageOptionsDto extends IntersectionType(PageOrderDto, PagePaginationDto) {}
