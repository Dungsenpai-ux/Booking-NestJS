import { IntersectionType } from '@nestjs/swagger'
import { PageOptionsDto } from 'src/commons/paginations'
import { FindCategoryFilterDto } from './find-category-filter.dto'

export class FindCategoryQueryDto extends IntersectionType(PageOptionsDto, FindCategoryFilterDto) {}
