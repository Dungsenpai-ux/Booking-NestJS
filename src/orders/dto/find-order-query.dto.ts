import { IntersectionType } from '@nestjs/swagger'
import { PageOptionsDto } from 'src/commons/paginations'
import { FindOrderFilterDto } from './find-order-filter.dto'

export class FindOrderQueryDto extends IntersectionType(PageOptionsDto, FindOrderFilterDto) {}
