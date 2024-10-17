import { IntersectionType } from '@nestjs/swagger'
import { PageOptionsDto } from 'src/commons/paginations'
import { FindBookFilterDto } from './find-book-filter.dto'

export class FindBookQueryDto extends IntersectionType(PageOptionsDto, FindBookFilterDto) {}
