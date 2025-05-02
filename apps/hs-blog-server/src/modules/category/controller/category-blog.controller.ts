import { Controller, Get } from '@nestjs/common';
import { CategoryService } from '@/modules/category/service/category.service';

@Controller('blog/category')
export class CategoryBlogController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAll() {
    const result = await this.categoryService.findAll();
    return { data: result };
  }
}
